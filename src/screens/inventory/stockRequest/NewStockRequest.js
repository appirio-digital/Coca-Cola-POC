import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Alert,
  Platform
} from 'react-native';
import moment from 'moment';
import { CardSection, Input, Scanner } from '../../../components/common';
import { labels } from '../../../stringConstants';
import StockRequestProductRow from './StockRequestProductRow';
import AutoCompleteInput from '../../../components/AutoCompleteInput';
import { APP_FONTS, APP_THEME } from '../../../constants';
import {
  fetchObjectCollection,
  API_END_POINT,
  API_NAME,
  JTI_API,
  createNewObject,
  SyncPinPriority,
  API_NAME_POC,
  API_NAME_MCS,
  invokeCustomAPI
} from '../../../services/omcClient';
import Loader from '../../../components/common/Loader';
import {
  ACTIVITY_STATUS_CODE,
  getRouteInvTransCode,
  getCurrentTimestampInGMT
} from '../../../utility';

export default class NewStockRequest extends Component {
  state = {
    showBarcodeModal: false,
    dropdownList: [],
    selectedProductValue: {},
    selectedProducts: [],
    loading: false,
    editedProducts: {},
    newlyAddedProduct: []
  };
  onGridItemPressHandler = route => {
    this.props.navigation.push(route);
  };

  async componentWillMount() {
    const {
      product: { products }
    } = this.props;
    this.setState({ loading: true });
    this.fetchAllocatedRouteInventory();
    const dropdownList = products.map(product => {
      const { Name, ItemNumber } = product;
      return { value: ItemNumber, label: Name };
    });
    this.setState({ dropdownList });
  }

  fetchAllocatedRouteInventory = async () => {
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
      this.setState({
        selectedProducts: filteredInventoryProduct,
        loading: false
      });
    } catch (error) {
      console.log('error while fetching stock request', error);
    }
  };

  onStepperTextEditingEnd = (text, item) => {
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
    const selectedProducts = this.state.selectedProducts.map(product => {
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
          __ORACO__TotalQuantity_c: newQuantity,
          __ORACO__SellableQuantity_c: newQuantity
        };
      } else {
        let newQuantity = product.__ORACO__Product_Id_c;
        if (item.__ORACO__Product_Id_c === product.__ORACO__Product_Id_c) {
          if (Number.isNaN(parseInt(MaxQuantity))) {
            newQuantity = 0;
          } else {
            newQuantity = parseInt(MaxQuantity);
          }
        }
        return {
          ...product,
          __ORACO__TotalQuantity_c: newQuantity,
          __ORACO__SellableQuantity_c: newQuantity
        };
      }
    });
    let editedProducts = this.state.editedProducts;
    editedProducts[item.__ORACO__Product_Id_c] = 'changed';
    this.setState({ selectedProducts, editedProducts });
  };

  onStepperTextChange = (text, item) => {};

  inputLeftView = () => (
    <TouchableOpacity style={styles.leftContainer}>
      <Text style={styles.leftIconStyle}></Text>
    </TouchableOpacity>
  );

  inputRightView = () => (
    <TouchableOpacity
      style={styles.rightContainer}
      onPress={this.scanBarcodeButtonClicked}
    >
      <Text style={styles.rightIconStyle}></Text>
    </TouchableOpacity>
  );

  onValueChange = name => value => {
    const { stock } = this.props;
    if (stock.selectedStockRequest) {
      this.addProductFromDropDown(value);
    } else {
      this.addNewProductFromDropDown(value);
    }
  };

  renderItem = item => {
    const { StatusCode } = this.props.stock.selectedStockRequest;
    return (
      <StockRequestProductRow
        item={item.item}
        editedProducts={this.state.editedProducts}
        newlyAddedProduct={this.state.newlyAddedProduct}
        deleteProductClicked={this.deleteProductClicked}
        addProductClicked={this.addProductClicked}
        substractProductClicked={this.substractProductClicked}
        onStepperTextChange={this.onStepperTextChange}
        onStepperTextEditingEnd={this.onStepperTextEditingEnd}
        isEditable={StatusCode === ACTIVITY_STATUS_CODE.Approved}
      />
    );
  };

  deleteProductClicked = item => {
    if (item.Id) {
      const selectedProducts = this.state.selectedProducts.filter(product => {
        return product.Id !== item.Id;
      });
      const newlyAddedProduct = this.state.newlyAddedProduct.filter(product => {
        return product.Id !== item.Id;
      });
      this.setState({ selectedProducts, newlyAddedProduct });
    } else {
      const selectedProducts = this.state.selectedProducts.filter(product => {
        return product.__ORACO__Product_Id_c !== item.__ORACO__Product_Id_c;
      });
      const newlyAddedProduct = this.state.newlyAddedProduct.filter(product => {
        return product.__ORACO__Product_Id_c !== item.__ORACO__Product_Id_c;
      });
      this.setState({ selectedProducts, newlyAddedProduct });
    }
  };

  addProductClicked = item => {
    const {
      auth: {
        profile: { PrimaryCountry_c, SR_Quantity }
      }
    } = this.props;
    const MaxQuantity = SR_Quantity;
    if (item.Id) {
      const selectedProducts = this.state.selectedProducts.map(product => {
        let newQuantity = product.__ORACO__TotalQuantity_c;
        if (item.Id === product.Id) {
          if (MaxQuantity > product.__ORACO__TotalQuantity_c) {
            newQuantity = `${parseInt(product.__ORACO__TotalQuantity_c) + 1}`;
          } else {
            const message = labels.MORE_PRODUCT_ADD_ERROR;
            Alert.alert('', message);
          }
        }
        return {
          ...product,
          __ORACO__TotalQuantity_c: newQuantity,
          __ORACO__SellableQuantity_c: newQuantity
        };
      });
      this.setState({ selectedProducts });
    } else {
      const selectedProducts = this.state.selectedProducts.map(product => {
        let newQuantity = product.__ORACO__TotalQuantity_c;
        if (item.Id === product.Id) {
          if (MaxQuantity > product.__ORACO__TotalQuantity_c) {
            newQuantity = `${parseInt(product.__ORACO__TotalQuantity_c) + 1}`;
          } else {
            const message = labels.MORE_PRODUCT_ADD_ERROR;
            Alert.alert('', message);
          }
        }
        return {
          ...product,
          __ORACO__TotalQuantity_c: newQuantity,
          __ORACO__SellableQuantity_c: newQuantity
        };
      });
      this.setState({ selectedProducts });
    }
    let editedProducts = this.state.editedProducts;
    editedProducts[item.__ORACO__Product_Id_c] = 'changed';
    this.setState({ editedProducts });
  };

  substractProductClicked = item => {
    if (item.Id) {
      if (item.__ORACO__TotalQuantity_c > 0) {
        const selectedProducts = this.state.selectedProducts.map(product => {
          let newQuantity =
            item.Id === product.Id
              ? `${parseInt(product.__ORACO__TotalQuantity_c) - 1}`
              : product.__ORACO__TotalQuantity_c;
          return {
            ...product,
            __ORACO__TotalQuantity_c: newQuantity,
            __ORACO__SellableQuantity_c: newQuantity
          };
        });
        this.setState({ selectedProducts });
      }
    } else {
      if (item.__ORACO__TotalQuantity_c > 0) {
        const selectedProducts = this.state.selectedProducts.map(product => {
          let newQuantity =
            item.__ORACO__Product_Id_c === product.__ORACO__Product_Id_c
              ? `${parseInt(product.__ORACO__TotalQuantity_c) - 1}`
              : product.__ORACO__TotalQuantity_c;
          return {
            ...product,
            __ORACO__TotalQuantity_c: newQuantity,
            __ORACO__SellableQuantity_c: newQuantity
          };
        });
        this.setState({ selectedProducts });
      }
    }
    let editedProducts = this.state.editedProducts;
    editedProducts[item.__ORACO__Product_Id_c] = 'changed';
    this.setState({ editedProducts });
  };

  scanBarcodeButtonClicked = () => {
    this.setState({ showBarcodeModal: true });
  };

  getGridData = (data, column) => {
    if (data) {
      const gridData = [...data];
      var count = gridData.length % column;
      if (count > 0) {
        for (let i = 0; i < column - count; i++) {
          gridData.push({});
        }
      }
      return gridData;
    }
    return [];
  };

  onBarCodeRead = barcode => {
    this.setState({ showBarcodeModal: false });
    const {
      stock,
      stockActions,
      product: { products }
    } = this.props;
    if (stock.selectedStockRequest) {
      this.addProductFromBarcode(barcode);
    } else {
      this.addNewProductFromBarcode(barcode);
    }
  };

  onBarCodeReadCancel = () => {
    this.setState({ showBarcodeModal: false });
  };

  addProductFromBarcode = barcode => {
    const {
      product: { products },
      stock,
      auth: {
        profile: { PrimaryCountry_c, SR_Quantity }
      }
    } = this.props;
    var { selectedProducts } = this.state;
    if (products) {
      const scannedProducts = products.filter(
        product => product.ItemNumber === barcode || product.Name === barcode
      );
      if (scannedProducts.length > 0) {
        const isAdded = selectedProducts.findIndex(
          product =>
            product.__ORACO__Product_c === scannedProducts[0].Name ||
            product.__ORACO__Product_Id_c === scannedProducts[0].InventoryItemId
        );
        const productItem = {
          RecordName: stock.selectedStockRequest
            ? `${stock.selectedStockRequest.__ORACO__Route_c}_${
                scannedProducts[0].Name
              }`
            : scannedProducts[0].Name, // need to add Route c like Canada 101LD Red Soft SKU
          __ORACO__LastCountDate_c: '',
          __ORACO__LastProcessedTimestamp_c: '',
          __ORACO__Product_Id_c:
            scannedProducts && scannedProducts[0].InventoryItemId,
          __ORACO__Product_c: scannedProducts && scannedProducts[0].Name,
          __ORACO__Route_Id_c: stock.selectedStockRequest
            ? stock.selectedStockRequest.__ORACO__Route_Id_c
            : '',
          __ORACO__Route_c: stock.selectedStockRequest
            ? stock.selectedStockRequest.__ORACO__Route_c
            : '',
          __ORACO__SellableQuantity_c: `${SR_Quantity}`,
          __ORACO__TotalQuantity_c: `${SR_Quantity}`,
          __ORACO__UnsellableQuantity_c: '0',
          __ORACO__UOM_c: scannedProducts && scannedProducts[0].DefaultUOM,
          __ORACO__UOMCode_c: ''
        };
        if (isAdded == -1) {
          if (selectedProducts.length > 0) {
            selectedProducts.push(productItem);
          } else {
            selectedProducts = [productItem];
          }
          let editedProducts = this.state.editedProducts;
          editedProducts[productItem.__ORACO__Product_Id_c] = 'changed';
          let newlyAddedProduct = this.state.newlyAddedProduct;
          newlyAddedProduct.push(productItem.__ORACO__Product_Id_c);
          this.setState({
            selectedProducts,
            editedProducts,
            newlyAddedProduct
          });
        } else {
          const message =
            isAdded > -1
              ? labels.PRODUCT_ADDED
              : labels.PRODUCT_NOT_FOUND + ':-' + barcode;
          setTimeout(() => {
            Alert.alert('', message);
          }, 200);
        }
      }
    }
  };

  addNewProductFromBarcode = barcode => {
    const {
      product: { products },
      stock: { routeAllocation },
      auth: {
        profile: { PrimaryCountry_c, SR_Quantity }
      }
    } = this.props;
    var selectedProducts = this.state.selectedProducts;
    const productItem = products.filter(
      product => product.ItemNumber === barcode || product.Name === barcode
    );
    if (productItem.length > 0) {
      const isAdded = selectedProducts.findIndex(
        product =>
          product.__ORACO__Product_c == productItem[0].Name ||
          product.__ORACO__Product_Id_c == productItem[0].Name
      );
      const newProductItem = {
        RecordName: routeAllocation
          ? `${routeAllocation[0].__ORACO__Route_c}_${productItem[0].Name}`
          : productItem[0].Name, // need to add Route c like Canada 101LD Red Soft SKU
        __ORACO__LastCountDate_c: '',
        __ORACO__LastProcessedTimestamp_c: '',
        __ORACO__Product_Id_c: productItem[0].InventoryItemId,
        __ORACO__Product_c: productItem[0].Name,
        __ORACO__Route_Id_c: routeAllocation
          ? routeAllocation[0].__ORACO__Route_Id_c
          : '',
        __ORACO__Route_c: routeAllocation
          ? routeAllocation[0].__ORACO__Route_c
          : '',
        __ORACO__SellableQuantity_c: `${SR_Quantity}`,
        __ORACO__TotalQuantity_c: `${SR_Quantity}`,
        __ORACO__UnsellableQuantity_c: '0',
        __ORACO__UOM_c: productItem[0].DefaultUOM,
        __ORACO__UOMCode_c: ''
      };
      if (isAdded == -1) {
        if (selectedProducts.length > 0) {
          selectedProducts.push(newProductItem);
        } else {
          selectedProducts = [newProductItem];
        }
        let editedProducts = this.state.editedProducts;
        editedProducts[newProductItem.__ORACO__Product_Id_c] = 'changed';
        let newlyAddedProduct = this.state.newlyAddedProduct;
        newlyAddedProduct.push(newProductItem.__ORACO__Product_Id_c);
        this.setState({
          selectedProducts,
          editedProducts,
          newlyAddedProduct
        });
      } else {
        const message =
          isAdded > -1
            ? labels.PRODUCT_ADDED
            : labels.PRODUCT_NOT_FOUND + ':-' + barcode;
        setTimeout(() => {
          Alert.alert('', message);
        }, 200);
      }
    }
  };

  addProductFromDropDown = value => {
    const {
      product: { products },
      stock,
      auth: {
        profile: { PrimaryCountry_c, SR_Quantity }
      }
    } = this.props;
    var selectedProducts = this.state.selectedProducts;
    const productExist = selectedProducts.some(
      product => product.__ORACO__Product_c === value.label
    );
    if (!productExist) {
      if (products) {
        const item = products.filter(product => {
          if (
            product.ItemNumber === value.value ||
            product.Name === value.label
          ) {
            this.setState({ selectedProductValue: value });
            return product;
          }
          return null;
        });
        const productItem = {
          RecordName: stock.selectedStockRequest
            ? `${stock.selectedStockRequest.__ORACO__Route_c}_${item[0].Name}`
            : item[0].Name, // need to add Route c like Canada 101LD Red Soft SKU
          __ORACO__LastCountDate_c: '',
          __ORACO__LastProcessedTimestamp_c: '',
          __ORACO__Product_Id_c: item[0].InventoryItemId,
          __ORACO__Product_c: item[0].Name,
          __ORACO__Route_Id_c: stock.selectedStockRequest
            ? stock.selectedStockRequest.__ORACO__Route_Id_c
            : '',
          __ORACO__Route_c: stock.selectedStockRequest
            ? stock.selectedStockRequest.__ORACO__Route_c
            : '',
          __ORACO__SellableQuantity_c: `${SR_Quantity}`,
          __ORACO__TotalQuantity_c: `${SR_Quantity}`,
          __ORACO__UnsellableQuantity_c: '0',
          __ORACO__UOM_c: item[0].DefaultUOM,
          __ORACO__UOMCode_c: ''
        };
        if (selectedProducts) {
          selectedProducts.push(productItem);
        } else {
          selectedProducts = [productItem];
        }
        let editedProducts = this.state.editedProducts;
        editedProducts[productItem.__ORACO__Product_Id_c] = 'changed';
        let newlyAddedProduct = this.state.newlyAddedProduct;
        newlyAddedProduct.push(productItem.__ORACO__Product_Id_c);
        this.setState({
          selectedProducts,
          editedProducts,
          newlyAddedProduct
        });
      }
    } else {
      const message = labels.PRODUCT_ADDED;
      setTimeout(() => {
        Alert.alert('', message);
      }, 200);
    }
  };

  addNewProductFromDropDown = value => {
    const {
      product: { products },
      stock: { routeAllocation },
      auth: {
        profile: { PrimaryCountry_c, SR_Quantity }
      }
    } = this.props;
    const productItem = products.filter(
      product => product.ItemNumber === value.value
    );
    var selectedProducts = this.state.selectedProducts;
    const productExist = selectedProducts.some(
      product => product.__ORACO__Product_c === value.label
    );
    if (!productExist) {
      const newProductItem = {
        RecordName: routeAllocation
          ? `${routeAllocation[0].__ORACO__Route_c}_${productItem[0].Name}`
          : productItem[0].Name, // need to add Route c like Canada 101LD Red Soft SKU
        __ORACO__LastCountDate_c: '',
        __ORACO__LastProcessedTimestamp_c: '',
        __ORACO__Product_Id_c: productItem[0].InventoryItemId,
        __ORACO__Product_c: productItem[0].Name,
        __ORACO__Route_Id_c: routeAllocation
          ? routeAllocation[0].__ORACO__Route_Id_c
          : '',
        __ORACO__Route_c: routeAllocation
          ? routeAllocation[0].__ORACO__Route_c
          : '',
        __ORACO__SellableQuantity_c: `${SR_Quantity}`,
        __ORACO__TotalQuantity_c: `${SR_Quantity}`,
        __ORACO__UnsellableQuantity_c: '0',
        __ORACO__UOM_c: productItem[0].DefaultUOM,
        __ORACO__UOMCode_c: ''
      };
      if (selectedProducts) {
        selectedProducts.push(newProductItem);
      } else {
        selectedProducts = [newProductItem];
      }
      let editedProducts = this.state.editedProducts;
      editedProducts[newProductItem.__ORACO__Product_Id_c] = 'changed';
      let newlyAddedProduct = this.state.newlyAddedProduct;
      newlyAddedProduct.push(newProductItem.__ORACO__Product_Id_c);
      this.setState({
        selectedProductValue: value,
        selectedProducts: selectedProducts,
        editedProducts,
        newlyAddedProduct
      });
    } else {
      const message = labels.PRODUCT_ADDED;
      setTimeout(() => {
        Alert.alert('', message);
      }, 200);
    }
  };

  onSaveHandler = async () => {
    const { selectedProducts } = this.state;
    let products = [];
    let filteredProductsToSave = selectedProducts.filter(product => {
      return (
        this.state.editedProducts[product.__ORACO__Product_Id_c] == 'changed'
      );
    });
    this.setState({ loading: true });
    try {
      const response = await Promise.all(
        filteredProductsToSave.map(product => {
          return createNewObject(
            product,
            API_NAME,
            API_END_POINT.ROUTE_INVENTORY,
            'Id',
            SyncPinPriority.Normal
          );
        })
      );
      if (response) {
        response.forEach(result => {
          if (result.success === false) {
            isFailed = !result.success;
          }
          result.success && products.push(result.object);
        });
        this.setState({ loading: false });
      } else {
        this.setState({ loading: false }, () => {
          setTimeout(() => {
            this.goBackWithError();
          }, 200);
        });
      }
      let editedProducts = this.state.editedProducts;
      editedProducts = {};
      let newlyAddedProduct = this.state.newlyAddedProduct;
      newlyAddedProduct = [];
      this.setState({ editedProducts, newlyAddedProduct });
    } catch (error) {
      this.setState({ loading: false }, () => {
        setTimeout(() => {
          this.goBackWithProductError();
        }, 200);
      });
    }
  };

  onSubmit = () => {
    Alert.alert(
      '',
      labels.STOCK_REQUEST_APPROVAL_ALERT,
      [
        {
          text: labels.OK,
          onPress: () => {
            this.setState({ loading: true });
            this.goForApproval();
          }
        },
        {
          text: labels.CANCEL,
          onPress: () => {
            console.log('cancel pressed');
          }
        }
      ],
      { cancelable: false }
    );
  };

  createNewActivity = async product => {
    const {
      auth: {
        profile: { PartyId }
      }
    } = this.props;

    const theDate = new Date();
    const formatedDate = moment(theDate).format('MM-DD-YYYY HH:mm a');
    const newActivity = {
      ActivityFunctionCode: 'TASK',
      ActivityTypeCode: 'STOCK_REQUEST',
      DueDate: new Date(theDate.getTime() + 7 * 24 * 60 * 60 * 1000),
      Subject: `${'SR'} (${product.__ORACO__Route_c} ${formatedDate})`,
      __ORACO__AppointmentName_c: `${'SR'} (${
        product.__ORACO__Route_c
      } ${formatedDate})`,
      __ORACO__Route_c: product.__ORACO__Route_c,
      __ORACO__Route_Id_c: product.__ORACO__Route_Id_c,
      __ORACO__StoreVisit_c: 'false',
      OwnerId: PartyId
    };
    const result = await createNewObject(
      newActivity,
      API_NAME,
      API_END_POINT.ACTIVITY,
      'ActivityId',
      SyncPinPriority.Normal
    );
    if (result.success) {
      this.goForApproval();
    } else {
      this.setState({ loading: false }, () => {
        setTimeout(() => {
          this.goBackWithActivityError();
        }, 200);
      });
    }
  };

  goForApproval = async () => {
    const {
      id,
      activitynumber,
      description,
      duedate,
      ownerid,
      statuscode,
      subject,
      routeid
    } = this.props.stock.selectedStockRequest;
    console.log('this.props', this.props);
    const approvalRequest = {
      ActivityId: id,
      ActivityNumber: activitynumber,
      ActivityPartialDescription: description,
      ActivityFunctionCode: 'TASK',
      StatusCode: statuscode,
      Subject: subject,
      ActivityTypeCode: 'STOCK_REQUEST',
      DueDate: duedate,
      MobileActivityCode: '',
      OutcomeCode: '',
      OwnerId: ownerid,
      __ORACO__Route_Id_c: routeid
    };
    console.log('approvalRequest', approvalRequest);
    const response = await invokeCustomAPI(
      approvalRequest,
      API_NAME_MCS,
      API_END_POINT.ACTIVITY_APPROVAL_SERVICE
    );
    console.log('response', response);
    if (
      response &&
      response.items &&
      response.items.length > 0 &&
      response.items[0].OutcomeCode === 'Approved'
    ) {
      console.log('inside response');
      try {
        const updateActivity = { ...this.props.stock.selectedStockRequest };
        updateActivity.statuscode = ACTIVITY_STATUS_CODE.Approved;
        const activityResponse = await createNewObject(
          updateActivity,
          JTI_API,
          API_END_POINT.ACTIVITY,
          'activitynumber',
          SyncPinPriority.Normal
        );
        console.log('activityResponse', activityResponse);
        const { stockActions } = this.props;
        await stockActions.getAllStockRequest();
        if (activityResponse) {
          this.createRouteInventoryTransaction();
        }
      } catch (error) {
        this.setState({ loading: false }, () => {
          setTimeout(() => {
            this.goBackWithError();
          }, 200);
        });
      }
    } else {
      this.setState({ loading: false }, () => {
        setTimeout(() => {
          this.goBackWithError();
        }, 200);
      });
    }
  };

  createRouteInventoryTransaction = () => {
    this.setState({ loading: false }, () => {
      setTimeout(() => {
        this.goBack();
      }, 200);
    });
  };

  goBack = () => {
    Alert.alert(
      '',
      labels.PRODUCT_APPROVED_SUCCESSFULLY,
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

  goBackWithError = () => {
    Alert.alert('', labels.ERROR_WHILE_ADDING_PRODUCT);
  };

  goBackWithProductError = () => {
    Alert.alert('', labels.PRODUCT_POST_ERROR);
  };

  goBackWithActivityError = () => {
    Alert.alert('', labels.ACTIVITY_POST_ERROR);
  };

  goBackWithRouteInvTransError = () => {
    Alert.alert('', labels.INVENTORY_TRANSACTION_POST_ERROR);
  };

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const { statuscode } = this.props.stock.selectedStockRequest;
    const isDisable = statuscode === ACTIVITY_STATUS_CODE.Approved;
    return (
      <KeyboardAvoidingView
        style={[styles.container]}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        enabled={Platform.OS === 'ios' ? true : false}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : null}
      >
        <View style={{ flex: 1 }}>
          <Scanner
            visible={this.state.showBarcodeModal}
            onBarCodeRead={this.onBarCodeRead}
            onBarCodeReadCancel={this.onBarCodeReadCancel}
          />
          <Loader loading={this.state.loading} />
          <View
            pointerEvents={isDisable ? 'none' : 'auto'}
            style={
              Platform.OS === 'ios'
                ? styles.autocompleteParentViewIOS
                : styles.autocompleteParentViewAndroid
            }
          >
            <View style={{ maxHeight: 50, paddingLeft: 15, flex: 7 }}>
              <AutoCompleteInput
                options={this.state.dropdownList}
                fieldName="product"
                placeholder={labels.PRODUCT_SEARCH}
                isFormEditable={true}
                leftView={this.inputLeftView()}
                rightView={this.inputRightView()}
                onValueChange={this.onValueChange}
                value={
                  this.state.selectedProductValue.label
                    ? this.state.selectedProductValue.label
                    : null
                }
              />
            </View>
            <View
              pointerEvents={this.state.disableSubmitButton ? 'none' : 'auto'}
              style={
                isDisable ? styles.submitButtonDisable : styles.submitButton
              }
            >
              <TouchableOpacity
                style={styles.headerButton}
                onPress={this.onSubmit}
              >
                <Text style={styles.headerButtonIcon}>  </Text>
                <Text style={styles.headerButtonText}>
                  {' '}
                  {labels.SAVE_PAYMENT}
                </Text>
              </TouchableOpacity>
            </View>
            <View
              style={isDisable ? styles.saveButtonDisable : styles.saveButton}
            >
              <TouchableOpacity
                style={styles.headerButton}
                onPress={this.onSaveHandler}
              >
                <Text style={styles.headerButtonIcon}>  </Text>
                <Text style={styles.headerButtonText}> {labels.SAVE}</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View
            style={
              Platform.OS === 'ios'
                ? styles.viewListIOS
                : styles.viewListAndroid
            }
          >
            <FlatList
              style={{ flex: 1, marginLeft: 10, marginRight: 10 }}
              data={this.getGridData(this.state.selectedProducts, 2)}
              numColumns={2}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  leftContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
  },
  leftIconStyle: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 20,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: APP_THEME.APP_BASE_COLOR,
    borderRadius: 13,
    width: 25,
    height: 25
  },
  rightContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightIconStyle: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 25,
    textAlign: 'center',
    width: 25,
    height: 25
  },
  headerButton: {
    flex: 1,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    flexDirection: 'row'
  },
  headerButtonText: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    color: APP_THEME.APP_BASE_COLOR_WHITE
  },
  headerButtonIcon: {
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    color: APP_THEME.APP_BASE_COLOR_WHITE
  },
  saveButton: {
    flex: 3,
    maxHeight: 50,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
  saveButtonDisable: {
    flex: 3,
    opacity: 0.7,
    maxHeight: 50,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
  submitButton: {
    flex: 3,
    maxHeight: 50,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
  submitButtonDisable: {
    flex: 3,
    opacity: 0.7,
    maxHeight: 50,
    paddingLeft: 15,
    paddingTop: 5,
    paddingBottom: 5
  },
  viewListIOS: {
    flex: 10,
    zIndex: 1,
    position: 'relative'
  },
  viewListAndroid: {
    flex: 10
  },
  autocompleteParentViewIOS: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
    zIndex: 10,
    position: 'relative'
  },
  autocompleteParentViewAndroid: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10
  }
});
