import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';
import { Checkbox } from '../../components/common';
import { roundAmount } from '../../utility';
export default class OrderRow extends PureComponent {
  render() {
    const { item, onRowClick, onCheckBoxClick } = this.props;
    const {
      Account_Id_c,
      Account_c,
      Amount_c,
      CurrencyCode,
      Id,
      MobileUId_c,
      OrderDate_c,
      OrderStatus_c,
      PaymentMode_c,
      PaymentStatus_c,
      RecordName,
      TaxAmount_c,
      Type_c,
      selected
    } = item;

    return (
      <View style={styles.container}>
        <View style={{ flex: 0.5, flexDirection: 'row' }}>
          <Checkbox isChecked={selected} onPress={onCheckBoxClick(Id)} />
        </View>
        <TouchableOpacity
          style={styles.dataContainer}
          onPress={onRowClick(item)}
        >
          <Text style={styles.productIdTextStyle}>{RecordName}</Text>
        </TouchableOpacity>

        <View style={styles.amountContainer}>
          <Text style={[styles.fadetextStyle]}>{OrderDate_c}</Text>
        </View>

        <View style={styles.amountContainer}>
          <Text style={[styles.fadetextStyle]}>
            {CurrencyCode + ' ' + roundAmount(Amount_c)}
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
    alignItems: 'flex-start',
    justifyContent: 'flex-start'
  },
  amountContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  }
});
