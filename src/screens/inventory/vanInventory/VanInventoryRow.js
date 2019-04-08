import React, { PureComponent } from 'react';
import { IconButton, Stepper } from '../../../components/common';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../../constants';
import { labels } from '../../../stringConstants';

export default class VanInventoryRow extends PureComponent {
  _keyExtractor = (item, index) => `${index}`;

  render() {
    const {
      addProductClicked,
      substractProductClicked,
      item,
      deviceInfo,
      onStepperTextChange
    } = this.props;
    const {
      __ORACO__Product_Id_c,
      ProductNumber,
      __ORACO__Product_c,
      __ORACO__UOM_c,
      __ORACO__TotalQuantity_c,
      TotalPhysicalQuantity
    } = item;
    if (__ORACO__Product_Id_c) {
      return (
        <View style={styles.container}>
          <View style={{ flex: 1 }}>
            <View style={styles.topButtonContainer}>
              <View>
                {/* <Text style={styles.textHeaderStyle}>
                  {__ORACO__Product_Id_c}
                </Text> */}
                <Text
                  style={[styles.textHeaderStyle, styles.textProductNameStyle]}
                >
                  {__ORACO__Product_c}
                </Text>
              </View>
            </View>

            <View style={styles.bottomContainer}>
              <View
                style={
                  deviceInfo.orientation === 'Portrait'
                    ? { flex: 1, alignItems: 'flex-start' }
                    : { flexDirection: 'row', flex: 1, alignItems: 'center' }
                }
              >
                {deviceInfo.orientation === 'Portrait' ? (
                  <Text style={styles.textTitleStyle}>{labels.UOM}</Text>
                ) : (
                  <Text style={styles.textTitleStyle}>{labels.UOM} :</Text>
                )}

                <Text style={[styles.textTitleStyle, styles.textValueStyle]}>
                  {__ORACO__UOM_c}
                </Text>
              </View>
              <View
                style={
                  deviceInfo.orientation === 'Portrait'
                    ? { flex: 2, alignItems: 'flex-start' }
                    : { flexDirection: 'row', flex: 1, alignItems: 'center' }
                }
              >
                {deviceInfo.orientation === 'Portrait' ? (
                  <Text style={styles.textTitleStyle}>{labels.SYS_QTY}</Text>
                ) : (
                  <Text style={styles.textTitleStyle}>{labels.SYS_QTY} :</Text>
                )}

                <Text style={[styles.textTitleStyle, styles.textValueStyle]}>
                  {__ORACO__TotalQuantity_c}
                </Text>
              </View>
              <View
                style={
                  deviceInfo.orientation === 'Portrait'
                    ? { flex: 4 }
                    : { flex: 2 }
                }
              >
                <Stepper
                  value={TotalPhysicalQuantity}
                  addClicked={() => {
                    addProductClicked(item);
                  }}
                  substractClicked={() => {
                    substractProductClicked(item);
                  }}
                  style={{ justifyContent: 'flex-end' }}
                  onChangeText={text => onStepperTextChange(text, item)}
                />
              </View>
            </View>
          </View>
        </View>
      );
    }
    return <View style={styles.containerBlank} />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 120,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    flexDirection: 'column',
    borderRadius: 3,
    margin: 5,
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 15
  },
  containerBlank: {
    backgroundColor: 'transparent',
    flex: 1,
    minHeight: 120,
    margin: 5,
    paddingTop: 15,
    paddingRight: 15,
    paddingLeft: 15
  },
  topButtonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center'
  },
  textHeaderStyle: {
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontWeight: '600',
    fontSize: 14,
    color: APP_THEME.APP_BASE_COLOR,
    lineHeight: 18
  },
  textStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '600',
    fontSize: 14,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    lineHeight: 18
  },
  textProductNameStyle: {
    color: APP_THEME.APP_FONT_COLOR_DARK
  },
  textTitleStyle: {
    fontFamily: APP_FONTS.APP_FONT_COLOR_REGULAR,
    color: APP_THEME.APP_FONT_COLOR_DARK,
    lineHeight: 20,
    fontSize: 12,
    fontWeight: 'normal'
  },
  textValueStyle: {
    color: APP_THEME.APP_BASE_COLOR
  }
});
