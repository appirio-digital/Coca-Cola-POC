import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';
import { Checkbox } from '../../components/common';
export default class OrderRow extends PureComponent {
  render() {
    const { item, onRowClick, onCheckBoxClick, checkAll } = this.props;
    const {
      Id,
      CurrencyCode,
      Product_c,
      Product_Id_c,
      TotalPrice1_c,
      Quantity_c,
      TaxAmount_c,
      DiscountAmount_c,
      UnitPrice_c,
      selected
    } = item;

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

    return (
      <View style={styles.container}>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Checkbox
            isChecked={checkAll ? checkAll : selected}
            onPress={onCheckBoxClick(Id)}
          />
        </View>
        <TouchableOpacity
          style={styles.dataContainer}
          onPress={onRowClick(item)}
        >
          <Text style={styles.productIdTextStyle}>{Product_c}</Text>
        </TouchableOpacity>

        <View style={styles.dataContainer}>
          <Text style={[styles.fadetextStyle]}>{Quantity_c}</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.fadetextStyle]}>
            {CurrencyCode + ' ' + (amount + tax - discount)}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 15,
    marginRight: 15
  },
  productIdTextStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '600',
    fontSize: 14,
    color: APP_THEME.APP_FONT_COLOR_REGULAR,
    textDecorationLine: 'underline'
  },
  fadetextStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: 'normal',
    fontSize: 14,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    lineHeight: 18
  },
  textStatusStyle: {
    fontFamily: APP_FONTS.FONT_BOLD,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center'
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dataContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  amountContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  }
});
