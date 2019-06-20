import React, { Component } from 'react';
import { View, FlatList, Alert } from 'react-native';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import { RadioGroup, RadioButton } from 'react-native-flexi-radio-button';
import { Button } from '../../../components/common';
import VanInventoryRow from './VanInventoryRow';
import { labels } from '../../../stringConstants';
import { ACTIVITY_STATUS_LOV } from '../../../constants';
import {
  fetchObjectCollection,
  API_END_POINT,
  API_NAME,
  JTI_API,
  createNewObject,
  SyncPinPriority,
  createNewFile
} from '../../../services/omcClient';
import Loader from '../../../components/common/Loader';
import {
  getRouteInvTransCode,
  getCurrentTimestampInGMT
} from '../../../utility';
import { CameraModal } from '../../../components/common/CameraModal';
import PhotoPreview from '../../../components/common/PhotoPreview';
export default class VanInventoryList extends Component {
  state = {
    selectedProducts: [],
    physicalQuantityProduct: [],
    isBadStock: false,
    loading: false,
    captureImage: false,
    previewImage: false,
    routeId: null,
    disableValidateButton: true,
    filePath: ''
  };

  onGridItemPressHandler = route => {
    const { navigation } = this.props;
    navigation.push(route);
  };

  async componentDidMount() {
    const {
      stock: { routeAllocation, stockRequests },
      customersActions,
      customers
    } = this.props;
    customersActions.getActivity(customers.fromDate, customers.toDate);
    const routeId =
      routeAllocation && routeAllocation.length > 0
        ? routeAllocation[0].__ORACO__Route_Id_c
        : '';
    this.setState({ routeId: routeId }, () => {
      const filteredStockRequest =
        stockRequests &&
        stockRequests.filter(
          activity =>
            activity.function == 'TASK' &&
            activity.subtype == 'STOCK_REQUEST' &&
            activity.routeid == routeId &&
            activity.duedate == moment(new Date()).format('YYYY-MM-DD')
        );
      if (filteredStockRequest.length > 0 == true) {
        this.fetchInventory();
      }
    });
  }
  componentWillReceiveProps(newProps) {
    const {
      customers: { activityList }
    } = newProps;
    if (!isEmpty(activityList)) {
      const filteredActivity = activityList.filter(
        activity =>
          activity.function === 'APPOINTMENT' && activity.subtype === 'MEETING'
      );
      const completedActivity =
        filteredActivity &&
        filteredActivity.filter(
          activity => activity.statuscode === ACTIVITY_STATUS_LOV.COMPLETE
        );
      this.setState({ disableValidateButton: isEmpty(completedActivity) });
    }
  }

  fetchInventory = async () => {
    const { stock } = this.props;
    const routeName =
      stock.routeAllocation.length > 0
        ? stock.routeAllocation[0].__ORACO__Route_c
        : '';
    try {
      const response = await fetchObjectCollection(
        API_NAME,
        API_END_POINT.ROUTE_INVENTORY
      );
      const filteredInventoryProduct = response.filter(
        inventoryProduct => inventoryProduct.__ORACO__Route_c === routeName
      );
      const physicalQuantityProduct = filteredInventoryProduct.map(product => {
        return {
          ...product,
          TotalPhysicalQuantity: product.__ORACO__TotalQuantity_c
        };
      });
      this.setState({
        selectedProducts: filteredInventoryProduct,
        physicalQuantityProduct: physicalQuantityProduct,
        loading: false
      });
    } catch (error) {
      console.log('error while fetching stock request', error);
    }
  };

  onStepperTextChange = (text, item) => {
    const {
      auth: {
        profile: { PrimaryCountry_c, SR_Quantity }
      }
    } = this.props;
    let MaxQuantity = 0;
    if (parseInt(text) <= SR_Quantity) {
      MaxQuantity = parseInt(text);
    } else {
      const message = labels.MORE_PRODUCT_ADD_ERROR;
      Alert.alert('', message);
    }
    const physicalQuantityProduct = this.state.physicalQuantityProduct.map(
      product => {
        if (item.Id) {
          let newQuantity = product.__ORACO__TotalQuantity_c;
          if (item.Id === product.Id) {
            if (Number.isNaN(parseInt(MaxQuantity))) {
              newQuantity = 0;
            } else {
              newQuantity = parseInt(MaxQuantity);
            }
          }
          return {
            ...product,
            TotalPhysicalQuantity: newQuantity
          };
        }
      }
    );
    this.setState({ physicalQuantityProduct });
  };

  // onSelect = value => {
  //   this.setState({
  //     stockTypeValue: value
  //   });
  // };

  addProductClicked = item => {
    const {
      auth: {
        profile: { PrimaryCountry_c, SR_Quantity }
      }
    } = this.props;
    const MaxQuantity = SR_Quantity;
    if (item.Id) {
      const physicalQuantityProduct = this.state.physicalQuantityProduct.map(
        product => {
          let newQuantity = product.TotalPhysicalQuantity;
          if (item.Id === product.Id) {
            if (MaxQuantity > product.TotalPhysicalQuantity) {
              newQuantity = `${parseInt(product.TotalPhysicalQuantity) + 1}`;
            } else {
              const message = labels.MORE_PRODUCT_ADD_ERROR;
              Alert.alert('', message);
            }
          }
          return {
            ...product,
            TotalPhysicalQuantity: newQuantity
          };
        }
      );
      this.setState({ physicalQuantityProduct });
    }
  };

  substractProductClicked = item => {
    if (item.Id) {
      if (item.__ORACO__TotalQuantity_c > 0) {
        const physicalQuantityProduct = this.state.physicalQuantityProduct.map(
          product => {
            let newQuantity =
              item.Id === product.Id
                ? `${parseInt(product.TotalPhysicalQuantity) - 1}`
                : product.TotalPhysicalQuantity;
            return { ...product, TotalPhysicalQuantity: newQuantity };
          }
        );
        this.setState({ physicalQuantityProduct });
      }
    }
  };

  validateStock = () => {
    const { physicalQuantityProduct } = this.state;
    const systemQuantityTotal = physicalQuantityProduct.reduce(
      (acc, vanInven) => {
        return acc + parseInt(vanInven.__ORACO__TotalQuantity_c);
      },
      0
    );
    const physicalQuantityTotal = physicalQuantityProduct.reduce(
      (acc, vanInven) => {
        return acc + parseInt(vanInven.TotalPhysicalQuantity);
      },
      0
    );
    if (systemQuantityTotal > physicalQuantityTotal) {
      this.setState({ isBadStock: true }, () => {
        Alert.alert(
          '',
          labels.STOCK_QUANTITY_GREATER,
          [
            {
              text: labels.OK,
              onPress: () => {
                this.setState({ loading: true });
                this.createRouteInventoryTransaction();
              }
            }
          ],
          {
            cancelable: false
          }
        );
      });
    } else if (systemQuantityTotal < physicalQuantityTotal) {
      this.setState({ isBadStock: true }, () => {
        Alert.alert(
          '',
          labels.STOCK_QUANTITY_LESSER,
          [
            {
              text: labels.OK,
              onPress: () => {
                this.setState({ loading: true });
                this.createRouteInventoryTransaction();
              }
            }
          ],
          {
            cancelable: false
          }
        );
      });
    } else {
      Alert.alert(
        '',
        labels.STOCK_QUANTITY_EVEN,
        [
          {
            text: labels.OK,
            onPress: () => {
              this.setState({ loading: true });
              this.createRouteInventoryTransaction();
            }
          }
        ],
        {
          cancelable: false
        }
      );
    }
  };

  createNewActivityNotification = async () => {
    try {
      const {
        auth: {
          profile: { PartyId }
        },
        stock: { routeAllocation }
      } = this.props;
      const theDate = new Date();
      const formatedDate = moment(theDate).format('MM-DD-YYYY HH:mm a');
      const newActivity = {
        function: 'TASK',
        subtype: 'NOTIFY_STOCK_VALIDATION',
        description: '',
        duedate: new Date(theDate.getTime() + 24 * 60 * 60 * 1000),
        subject: `${'Stock Mismatch'} (${routeAllocation &&
          routeAllocation.length > 0 &&
          routeAllocation[0].__ORACO__Route_c} ${formatedDate})`,
        routeid:
          routeAllocation &&
          routeAllocation.length > 0 &&
          routeAllocation[0].__ORACO__Route_Id_c,
        storevisit: 'false',
        OwnerId: PartyId //'300000014815334'
      };
      const result = await createNewObject(
        newActivity,
        JTI_API,
        API_END_POINT.ACTIVITY,
        'ActivityId',
        SyncPinPriority.Normal
      );
      this.setState({ loading: false }, () => {
        setTimeout(() => {
          this.goBack();
        }, 200);
      });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  updateRouteInventory = async () => {
    try {
      const inventoryProducts = this.state.selectedProducts.map(product => {
        return {
          ...product,
          __ORACO__TotalQuantity_c: 0,
          __ORACO__SellableQuantity_c: 0
        };
      });
      const response = await Promise.all(
        inventoryProducts.map(product => {
          return createNewObject(
            product,
            API_NAME,
            API_END_POINT.ROUTE_INVENTORY,
            'Id',
            SyncPinPriority.Normal
          );
        })
      );
      if (this.state.isBadStock) {
        this.createNewActivityNotification();
      } else {
        this.setState({ loading: false }, () => {
          setTimeout(() => {
            this.goBack();
          }, 200);
        });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  createRouteInventoryTransaction = () => {
    this.updateRouteInventory();
    // try {
    //   const formatedDate = moment(new Date()).format('YYYY-MM-DD');
    //   const routeInventoryTransactionRequests = this.state.physicalQuantityProduct.map(
    //     product => {
    //       return {
    //         __ORACO__Route_Id_c: product.__ORACO__Route_Id_c,
    //         __ORACO__TransactionDate_c: formatedDate,
    //         RecordName: `${
    //           product.__ORACO__Route_c
    //         }${'_'}${formatedDate}${'_'}${
    //           product.__ORACO__Product_Id_c
    //         }${'_'}${'Unload'}`,
    //         __ORACO__OrderNumber_c: product.RecordNumber,
    //         __ORACO__SellableQuantity_c: product.__ORACO__TotalQuantity_c,
    //         __ORACO__UOM_c: product.__ORACO__UOM_c,
    //         __ORACO__Product_Id_c: product.__ORACO__Product_Id_c,
    //         __ORACO__Route_c: product.__ORACO__Route_c,
    //         __ORACO__TransactionQuantity_c: product.TotalPhysicalQuantity,
    //         CurrencyCode: product.CurrencyCode,
    //         __ORACO__Product_c: product.__ORACO__Product_c,
    //         __ORACO__TransactionType_c: getRouteInvTransCode('Unload')
    //       };
    //     }
    //   );
    //   const response = await Promise.all(
    //     routeInventoryTransactionRequests.map(routeTransaction => {
    //       return createNewObject(
    //         routeTransaction,
    //         API_NAME,
    //         API_END_POINT.ROUTE_INVENTORY_TRANSACTION,
    //         'Id',
    //         SyncPinPriority.Normal
    //       );
    //     })
    //   );
    //   if (response) {
    //     this.updateRouteInventory();
    //   }
    // } catch (error) {
    //   this.setState({ loading: false });
    // }
  };

  goBack = () => {
    Alert.alert(
      '',
      labels.VAN_INVENTORY_VALIDATED,
      [
        {
          text: 'OK',
          onPress: () => {
            const { navigation } = this.props;
            navigation.goBack();
          }
        }
      ],
      { cancelable: false }
    );
  };

  renderItem = item => {
    const { deviceInfo } = this.props;
    return (
      <VanInventoryRow
        item={item && item.item && item.item}
        addProductClicked={this.addProductClicked}
        substractProductClicked={this.substractProductClicked}
        deviceInfo={deviceInfo}
        onStepperTextChange={this.onStepperTextChange}
      />
    );
  };

  getGridData = (data, column) => {
    if (data) {
      let gridData = [...data];
      var count = gridData.length % column;
      for (let i = 0; i < column - count; i++) {
        gridData.push({});
      }
      return gridData;
    }
    return [];
  };

  onCameraCapture = async imagePath => {
    const { captureImage } = this.state;
    this.setState({
      captureImage: !captureImage,
      previewImage: true,
      filePath: imagePath
    });
  };

  onUploadImage = () => {
    try {
      this.setState(
        {
          loading: true,
          previewImage: false
        },
        async () => {
          if (this.state.filePath) {
            try {
              const routeID = `/ORACO__Route_c/${
                this.state.routeId
              }/Attachment`;
              const respo = await createNewFile(
                `${getCurrentTimestampInGMT()}.jpeg`,
                'image/jpeg',
                this.state.filePath,
                API_NAME,
                routeID
              );
              this.setState({ loading: false });
            } catch (error) {
              this.setState({ loading: false });
            }
          } else {
            this.setState({ loading: false });
          }
        }
      );
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  onCancelPrivew = () => {
    this.setState({ previewImage: false });
  };

  onCameraCancel = error => {
    const { captureImage } = this.state;
    this.setState({ captureImage: !captureImage });
  };

  captureImage = () => {
    const { captureImage } = this.state;
    this.setState({ captureImage: !captureImage });
  };

  _keyExtractor = (item, index) => `${index}`;
  render() {
    const { disableValidateButton } = this.state;
    const { stock } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <CameraModal
          visible={this.state.captureImage}
          onCameraCapture={this.onCameraCapture}
          onCameraCancel={this.onCameraCancel}
        />
        <PhotoPreview
          imagePath={this.state.filePath}
          visible={this.state.previewImage}
          //uploadAttchment={this.onUploadImage}
          uploadAttchment={() => {}}
          onPreviewCancel={this.onCancelPrivew}
        />
        <Loader loading={this.state.loading} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 10,
              marginTop: 10,
              alignItems: 'center',
              paddingLeft: 20
            }}
          >
            <View
              style={{
                alignSelf: 'center',
                alignItems: 'center',
                height: 40,
                width: 200
              }}
            >
              <Button onPress={this.captureImage}>
                {' '}
                {labels.ATTACH_IMAGE}{' '}
              </Button>
            </View>
            {/* <View style={{ paddingRight: 5 }}>
              <Text style={{ fontSize: 16 }}>{labels.STOCK_TYPE}:</Text>
            </View>
            <View
              style={{
                flexDirection: 'row'
              }}
            >
              <RadioGroup
                style={{ flexDirection: 'row' }}
                selectedIndex={0}
                activeColor={APP_THEME.APP_BASE_COLOR}
                color={APP_THEME.APP_LIST_BORDER_COLOR}
                onSelect={(index, value) => this.onSelect(value)}
              >
                <RadioButton value={'Good'}>
                  <Text>{labels.GOOD}</Text>
                </RadioButton>
                <RadioButton value={'Bad'}>
                  <Text>{labels.BAD}</Text>
                </RadioButton>
              </RadioGroup>
            </View> */}
          </View>

          <View
            style={{
              alignItems: 'flex-end',
              height: 40,
              width: 200,
              marginBottom: 10,
              marginTop: 10,
              paddingRight: 20
            }}
          >
            <Button
              onPress={this.validateStock}
              disable={disableValidateButton}
            >
              {labels.VALIDATESTOCK}{' '}
            </Button>
          </View>
        </View>
        <FlatList
          style={{ flex: 1, paddingLeft: 15, paddingRight: 15 }}
          extraData={this.state}
          data={this.getGridData(this.state.physicalQuantityProduct, 2)}
          numColumns={2}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
