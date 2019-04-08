import React, { PureComponent, Component } from 'react';
import { isEmpty } from 'lodash';

import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  Image
} from 'react-native';
import { APP_FONTS, APP_THEME } from '../../../constants';
import AttrbuteRow from './AttrbuteRow';
import { labels } from '../../../stringConstants';
import { CameraModal } from '../../../components/common/CameraModal';
import { Button } from '../../../components/common';
import {
  fetchFile,
  API_END_POINT,
  API_NAME
} from '../../../services/omcClient';

export default class IpadLandscap extends Component {
  state = {
    captureImage: false,
    filePath: ''
  };
  onCameraCapture = imagePath => {
    const { captureImage } = this.state;
    this.setState({ captureImage: !captureImage });
  };

  onCameraCancel = error => {
    console.log(error);
    const { captureImage } = this.state;
    this.setState({ captureImage: !captureImage });
  };

  captureImage = () => {
    const { captureImage } = this.state;
    this.setState({ captureImage: !captureImage });
  };

  componentDidMount() {
    const {
      product: { InventoryItemId }
    } = this.props;
    this.loadProductImage();
  }

  loadProductImage = async () => {
    try {
      const {
        product: { InventoryItemId }
      } = this.props;
      const filePaths = await fetchFile(
        API_NAME,
        `${API_END_POINT.PRODUCT}/${InventoryItemId}/ImageDetails`
      );
      if (!isEmpty(filePaths)) {
        if (filePaths[0]) {
          this.setState({ filePath: filePaths[0] });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { product } = this.props;
    const {
      ProdGroup,
      ActiveFlag,
      ItemNumber,
      __ORACO__Size_c,
      __ORACO__EligibleForShipment_c,
      __ORACO__ContainerClass_Id_c,
      category,
      __ORACO__Brand_c,
      Name,
      EligibleToSellFlag,
      DefaultUOM
    } = product;

    let imageSource = require('../../../images/cigarette-product.jpg');
    if (this.state.filePath !== '') {
      imageSource = {
        uri: this.state.filePath,
        scale: 1
      };
    }

    // if (ItemNumber === 'LD SS Amber SKU')
    //   imageSource = require('../../../images/amber-leaf-30g-pouch.png');

    // if (ItemNumber === '13598314')
    //   imageSource = require('../../../images/mayfair-green-ks.png');

    // if (ItemNumber === '14011327')
    //   imageSource = require('../../../images/Mayfair-Original-30s.png');

    // if (ItemNumber === '13751620')
    //   imageSource = require('../../../images/mayfair-sk-original.png');

    // if (ItemNumber === '13212514')
    //   imageSource = require('../../../images/silk-cut-purple-23s.jpg');

    // if (ItemNumber === '13613461')
    //   imageSource = require('../../../images/silk-cut-silver-100s.jpg');
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <CameraModal
          visible={this.state.captureImage}
          onCameraCapture={this.onCameraCapture}
          onCameraCancel={this.onCameraCancel}
        />
        <View
          style={{
            flex: 1,
            marginRight: 10
          }}
        >
          <Image source={imageSource} style={styles.productImage} />
          {/* <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
              height: 40,
              width: 340,
              marginBottom: 10,
              marginTop: 10
            }}
          >
            <Button onPress={this.captureImage}> {labels.ATTACH_IMAGE} </Button>
          </View> */}

          <View
            style={{
              marginTop: 10,
              justifyContent: 'space-between'
            }}
          >
            <View style={styles.attrbuteContainer}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-start'
                }}
              >
                <AttrbuteRow
                  title={labels.PRODUCT_SIZE + ':'}
                  value={__ORACO__Size_c}
                />
                <AttrbuteRow
                  title={labels.PRODUCT_ELIGIBLITY + ':'}
                  value={__ORACO__EligibleForShipment_c}
                />
                <AttrbuteRow
                  title={labels.PRODUCT_COTAINER_ID + ':'}
                  value={__ORACO__ContainerClass_Id_c}
                />
                <AttrbuteRow
                  title={labels.PRODUCT_DEFAULT_UOM + ':'}
                  value={DefaultUOM}
                />
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'flex-end'
                }}
              >
                <AttrbuteRow
                  title={labels.PRODUCT_BRAND + ':'}
                  value={__ORACO__Brand_c}
                />
                <AttrbuteRow title={labels.STATUS + ':'} value={ActiveFlag} />
                <AttrbuteRow
                  title={labels.CATEGORY + ':'}
                  value={category ? category.ProdGroupName : ''}
                />
                <AttrbuteRow
                  title={labels.ELIGIBLE_FOR_SALE + ':'}
                  value={EligibleToSellFlag}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ flex: 1, marginLeft: 10, marginTop: 30 }}>
          <Text style={styles.productIdTextStyle}>{ItemNumber}</Text>
          <Text style={[styles.productNameTextStyle]}>{Name}</Text>
          <Text style={[styles.productDesTextStyle]}>
            {ProdGroup ? ProdGroup.LongDescription : labels.PRODUCT_DESCRIPTION}
          </Text>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_THEME.APP_BACKGROUND_COLOR,
    padding: 20,
    flexDirection: 'row'
  },

  productImage: {
    marginTop: 30,
    width: Dimensions.get('window').width / 2 - 50,
    height: 300,
    resizeMode: 'contain'
  },
  productIdTextStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '600',
    fontSize: 20,
    color: APP_THEME.APP_FONT_COLOR_REGULAR
  },
  productNameTextStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '700',
    fontSize: 24,
    color: APP_THEME.APP_BASE_COLOR,
    marginTop: 10
  },
  barCodeStyle: {
    height: 50,
    width: 350
  },
  attrbuteContainer: { flexDirection: 'row', marginTop: 30 },
  productDesTextStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    alignItems: 'flex-start',
    marginTop: 10
  }
});
