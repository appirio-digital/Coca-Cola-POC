import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { IconButton, Stepper } from '../../../components/common';
import { APP_FONTS, APP_THEME } from '../../../constants';
import { labels } from '../../../stringConstants';
import includes from 'lodash/includes';
class StockRequestProductRow extends PureComponent {
  render() {
    const {
      addProductClicked,
      substractProductClicked,
      deleteProductClicked,
      onStepperTextChange,
      editedProducts,
      newlyAddedProduct,
      onStepperTextEditingEnd,
      isEditable
    } = this.props;
    const {
      __ORACO__Product_Id_c,
      ProductNumber,
      __ORACO__Product_c,
      __ORACO__UOM_c,
      __ORACO__TotalQuantity_c
    } = this.props.item;
    if (__ORACO__Product_Id_c) {
      return (
        <View
          style={
            editedProducts[__ORACO__Product_Id_c] === 'changed'
              ? styles.editedContainer
              : styles.container
          }
        >
          <View style={{ flex: 1 }}>
            <View style={styles.topButtonContainer}>
              <View>
                <Text style={styles.textHeaderStyle}>{ProductNumber}</Text>
                <Text
                  style={[styles.textHeaderStyle, styles.textProductNameStyle]}
                >
                  {__ORACO__Product_c}
                </Text>
              </View>
              <View>
                {newlyAddedProduct &&
                  includes(newlyAddedProduct, __ORACO__Product_Id_c) && (
                    <IconButton
                      onPress={() => {
                        deleteProductClicked(this.props.item);
                      }}
                    >
                      
                    </IconButton>
                  )}
              </View>
            </View>

            <View style={styles.bottomContainer}>
              <View
                style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
              >
                <Text style={styles.textTitleStyle}>{labels.UOM} :</Text>
                <Text style={[styles.textTitleStyle, styles.textValueStyle]}>
                  {__ORACO__UOM_c}
                </Text>
              </View>
              <View
                pointerEvents={isEditable ? 'none' : 'auto'}
                style={{ flex: 2 }}
              >
                <Stepper
                  value={__ORACO__TotalQuantity_c}
                  isDisable={true}
                  addClicked={() => {
                    addProductClicked(this.props.item);
                  }}
                  substractClicked={() => {
                    substractProductClicked(this.props.item);
                  }}
                  style={{ justifyContent: 'flex-end' }}
                  onChangeText={text =>
                    onStepperTextChange(text, this.props.item)
                  }
                  onEndEditing={e => {
                    onStepperTextEditingEnd(
                      e.nativeEvent.text,
                      this.props.item
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </View>
      );
    } else {
      return <View style={styles.containerBlank} />;
    }
  }
}

export default StockRequestProductRow;

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
  editedContainer: {
    flex: 1,
    minHeight: 120,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_BASE_COLOR,
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
