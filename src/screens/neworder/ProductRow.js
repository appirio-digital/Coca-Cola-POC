import React, { Component } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';
import { Stepper } from '../../components/common';
import { labels } from '../../stringConstants';
import find from 'lodash/find';
import { formatAmount } from '../../utility';
export default class ProductRow extends Component {
  state = {
    item: null
  };

  renderAttribute = (key, value, style) => (
    <View style={{ flexDirection: 'row' }}>
      <Text style={[styles.attrTitleTextStyle, style]}>{key}</Text>
      <Text style={[styles.attrValueTextStyle]}>{value}</Text>
    </View>
  );

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.item !== prevState.item) prevState.item = nextProps.item;
    return prevState;
  }
  render() {
    const {
      item,
      onQuantityChange,
      onDeleteProductPressed,
      onChangeText,
      inventory,
      isDisable
    } = this.props;
    const {
      CurrencyCode,
      Product_Id_c,
      Product_c,
      UOM_c,
      UnitPrice_c,
      DiscountAmount_c,
      Quantity_c,
      Promotion1_c,
      TaxAmount_c
    } = this.state.item;

    const qty = Number.isNaN(parseFloat(Quantity_c))
      ? 0
      : parseFloat(Quantity_c);

    const discount = Number.isNaN(parseFloat(DiscountAmount_c))
      ? 0
      : parseFloat(DiscountAmount_c);

    const tax = Number.isNaN(parseFloat(TaxAmount_c))
      ? 0
      : parseFloat(TaxAmount_c);
    const unitPrice = Number.isNaN(parseFloat(UnitPrice_c))
      ? 0
      : parseFloat(UnitPrice_c);

    const amount = qty * unitPrice;
    const total = amount + tax - discount;

    const inventoryItem = find(
      [...inventory],
      inventory => inventory.__ORACO__Product_Id_c == Product_Id_c
    );

    let isAvailabel = true;
    if (
      !inventoryItem ||
      (inventoryItem && qty > inventoryItem.__ORACO__SellableQuantity_c)
    ) {
      isAvailabel = false;
    }

    return (
      <View style={styles.container}>
        <Text
          style={[
            styles.attrTitleTextStyle,
            { color: APP_THEME.APP_BASE_COLOR }
          ]}
        >
          {}
        </Text>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 3 }}>
            <Text
              style={[
                styles.attrTitleTextStyle,
                {
                  fontSize: 18,
                  marginBottom: 10,
                  color: isAvailabel
                    ? APP_THEME.APP_COLOR_DARK_BLACK
                    : APP_THEME.APP_FONT_COLOR_ORANGE
                }
              ]}
            >
              {isAvailabel ? Product_c : Product_c + '*'}
            </Text>
            <Stepper
              isDisable={!isDisable}
              onChangeText={text => {
                const qty = Number.isNaN(parseInt(text)) ? 0 : parseInt(text);
                item.Quantity_c = qty;
                onChangeText(item);
              }}
              value={qty}
              addClicked={() => onQuantityChange(item, true)}
              substractClicked={() => onQuantityChange(item, false)}
              style={{ justifyContent: 'flex-start' }}
            />
          </View>
          <View style={{ flex: 3, marginLeft: 5 }}>
            {this.renderAttribute(`${labels.QTY}${':'}`, qty, {
              marginRight: 5
            })}
            {this.renderAttribute(`${labels.UOM}${':'}`, UOM_c, {
              marginRight: 5
            })}
            {this.renderAttribute(
              `${labels.UNIT_PRICE}${':'}`,
              formatAmount(parseFloat(UnitPrice_c), CurrencyCode)
            )}
            {this.renderAttribute(`${labels.PROMO_CODE}${':'}`, Promotion1_c)}
          </View>
          <View style={{ flex: 3 }}>
            {this.renderAttribute(
              `${labels.DISCOUNT}${':'}`,
              formatAmount(parseFloat(discount), '')
            )}
            {this.renderAttribute(
              `${labels.TAX}${':'}`,
              formatAmount(parseFloat(tax), '')
            )}
            {this.renderAttribute(
              `${labels.TOTAL}${':'}`,
              formatAmount(parseFloat(total), '')
            )}
          </View>

          <TouchableOpacity
            style={{ flex: 0.5 }}
            onPress={onDeleteProductPressed(Product_Id_c)}
          >
            <Text style={styles.deleteIconStyle}></Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    borderRadius: 2,
    marginTop: 20,
    padding: 20
  },
  attrTitleTextStyle: {
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    flex: 1
  },
  attrValueTextStyle: {
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 14,
    color: '#86898E',
    flex: 1
  },
  deleteIconStyle: {
    color: '#86898E',
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 30,
    textAlign: 'center'
  }
});
