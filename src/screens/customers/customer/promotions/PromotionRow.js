import React, { Component } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../../../constants';
import { labels } from '../../../../stringConstants';
import {
  fetchFile,
  API_NAME,
  API_END_POINT
} from '../../../../services/omcClient';
import { isEmpty } from 'lodash';

class PromotionRow extends Component {
  state = {
    item: {},
    imageSource: require('../../../../images/cigarette-product.jpg'),
    filePath: null
  };

  componentDidMount() {
    this.setState({ item: this.props.item ? this.props.item : [] });
    if (this.props.item)
      this.loadProductImage(this.props.item.__ORACO__Item_Id1_c);
  }
  loadProductImage = async product => {
    try {
      const filePaths = await fetchFile(
        API_NAME,
        `${API_END_POINT.PRODUCT}/${product}/ImageDetails`
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
  componentWillReceiveProps(props) {
    this.setState({ item: props.item });
    if (this.props.item)
      this.loadProductImage(this.props.item.__ORACO__Item_Id1_c);
  }

  render() {
    const { onSelectPromotion } = this.props;
    const { imageSource, filePath } = this.state;
    const {
      Id,
      Name,
      RecordNumber,
      StratDate,
      EndDate,
      __ORACO__RequiredQty_c,
      __ORACO__ItemNumber_c,
      __ORACO__UOM_c,
      __ORACO__Item_Id1_c,
      currentQty,
      selected
    } = this.state.item;

    const isPromoNotApplicable = __ORACO__RequiredQty_c
      ? currentQty < __ORACO__RequiredQty_c
      : false;

    return (
      <TouchableOpacity
        disabled={isPromoNotApplicable}
        onPress={() => onSelectPromotion(Id, __ORACO__Item_Id1_c)}
      >
        <View
          style={[
            styles.container,
            isPromoNotApplicable
              ? { borderColor: APP_THEME.APP_LIST_BORDER_COLOR }
              : selected
                ? { borderColor: APP_THEME.APP_FONT_COLOR_ORANGE }
                : { borderColor: APP_THEME.APP_BASE_COLOR }
          ]}
        >
          <View style={styles.topButtonContainer}>
            <Image
              source={
                this.state.filePath
                  ? {
                      uri: this.state.filePath,
                      scale: 1
                    }
                  : imageSource
              }
              style={styles.productImage}
            />
            <Text
              style={[
                styles.textHeaderStyle,
                selected
                  ? { color: APP_THEME.APP_FONT_COLOR_ORANGE, padding: 10 }
                  : { padding: 10 }
              ]}
            >
              {__ORACO__ItemNumber_c}
            </Text>
            <View />
          </View>
          <View
            style={[
              styles.bottomContainer,
              isPromoNotApplicable
                ? { backgroundColor: APP_THEME.APP_LIST_BORDER_COLOR }
                : selected
                  ? { backgroundColor: APP_THEME.APP_FONT_COLOR_ORANGE }
                  : { backgroundColor: APP_THEME.APP_BASE_COLOR }
            ]}
          >
            <View style={{ paddingTop: 10 }}>
              <Text style={styles.textStyleLarge}>{Name}</Text>
            </View>
            <View style={styles.containerCode}>
              <Text
                style={[
                  styles.textStyle,
                  {
                    padding: 10,
                    backgroundColor: '#F8F8F8',
                    color: APP_THEME.APP_COLOR_DARK_BLACK
                  }
                ]}
              >
                {labels.PROMO_CODE}
              </Text>
              <Text
                style={[
                  styles.textStyle,
                  {
                    padding: 10,
                    flex: 1,
                    justifyContent: 'center',
                    textAlign: 'center',
                    color: APP_THEME.APP_BASE_COLOR
                  }
                ]}
              >
                {RecordNumber}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                paddingTop: 10
              }}
            >
              <Text
                style={[
                  styles.textTitleStyle,
                  {
                    alignSelf: 'flex-end',
                    marginRight: 10
                  }
                ]}
              >
                {labels.REQUIRED_QUANTITY}:{' '}
                {__ORACO__RequiredQty_c ? __ORACO__RequiredQty_c : 0}
                {' ' + __ORACO__UOM_c}
              </Text>

              <Text
                style={[
                  styles.textTitleStyle,
                  {
                    alignSelf: 'flex-end',
                    marginLeft: 10
                  }
                ]}
              >
                {labels.PERIOD}: {EndDate}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  }
}

export default PromotionRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 175,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_BASE_COLOR,
    flexDirection: 'row',
    borderRadius: 3,
    borderWidth: 3,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10
  },
  containerBlank: {
    flex: 1,
    minHeight: 175,
    backgroundColor: 'transparent',
    margin: 5,
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 15
  },
  topButtonContainer: {
    flex: 0.3,
    justifyContent: 'center',
    alignItems: 'center'
  },
  bottomContainer: {
    flex: 0.7,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  textHeaderStyle: {
    fontFamily: APP_FONTS.FONT_BOLD,
    fontWeight: 'bold',
    fontSize: 18,
    color: APP_THEME.APP_BASE_COLOR
  },
  textStyle: {
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontWeight: '600',
    fontSize: 18,
    color: APP_THEME.APP_BASE_COLOR_WHITE
  },
  textStyleLarge: {
    fontFamily: APP_FONTS.FONT_BOLD,
    fontWeight: '600',
    fontSize: 26,
    color: APP_THEME.APP_BASE_COLOR_WHITE
  },
  textTitleStyle: {
    fontFamily: APP_FONTS.FONT_MEDIUM,
    color: APP_THEME.APP_BASE_COLOR_WHITE,
    fontSize: 14,

    justifyContent: 'center',
    fontWeight: 'normal',
    padding: 10
  },
  buttonStyle: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 29,
    alignItems: 'center'
  },
  buttonDisableStyle: {
    color: APP_THEME.APP_LIST_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 29,
    alignItems: 'center'
  },
  productImage: {
    width: 100,
    height: 100,
    resizeMode: 'contain'
  },
  containerCode: {
    marginTop: 5,
    marginBottom: 5,
    width: 200,
    maxHeight: 50,
    backgroundColor: APP_THEME.APP_BASE_COLOR_WHITE,
    borderWidth: 1,
    borderColor: APP_THEME.APP_BASE_COLOR_WHITE,
    flexDirection: 'row',
    borderRadius: 5,
    borderWidth: 2,
    alignItems: 'center'
  }
});
