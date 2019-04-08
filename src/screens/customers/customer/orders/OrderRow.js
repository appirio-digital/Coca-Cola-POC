import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../../../constants';
import { labels } from '../../../../stringConstants';
import { IconButton } from '../../../../components/common';
import {
  getOrderStatus,
  formatAmount,
  formatDateDDMMYYYY
} from '../../../../utility';
class OrderListRow extends PureComponent {
  getStatusColor = status => {
    switch (status) {
      case 'ORA_ACO_ORDER_STATUS_BOOKED':
        return '#86898E';
      case 'ORA_ACO_ORDER_STATUS_DELIVERED':
        return '#05A079';
      case 'ORA_ACO_ORDER_STATUS_SUBMITTED':
        return '#F5A623';
      default:
        return '#86898E';
    }
  };

  renderEditDeleteIcon = status => {
    if (status === 'ORA_ACO_ORDER_STATUS_BOOKED') {
      return (
        <View style={styles.buttonWrapperStyle}>
          <IconButton onPress={() => {}}></IconButton>
          <IconButton onPress={() => {}}></IconButton>
        </View>
      );
    }
  };
  render() {
    const {
      onPressed,
      item: {
        OrderId,
        OrderNumber,
        TotalAmount,
        Status,
        AccountName,
        OrderDate,
        AccountId,
        RecordName,
        CurrencyCode,
        MobileUId_c,
        Account_Id_c,
        Account_c,
        OrderDate_c,
        Amount_c,
        OrderStatus_c,
        PaymentMode_c,
        PaymentStatus_c,
        Type_c,
        TaxAmount_c
      }
    } = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.stockRequestContainerStyle}
          onPress={() => onPressed(this.props.item)}
        >
          <Text style={styles.stockRequestTextStyle}>{RecordName}</Text>
        </TouchableOpacity>

        <View style={{ flex: 0.8, flexDirection: 'row' }}>
          <Text style={[styles.textBaseStyle]}>
            {formatDateDDMMYYYY(OrderDate_c)}
          </Text>
        </View>

        <View
          style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}
        >
          <Text style={[styles.textBaseStyle]}>
            {formatAmount(parseFloat(Amount_c), CurrencyCode)}
          </Text>
        </View>

        <Text
          style={[
            styles.textHeaderStyle,
            { flex: 1.5, color: this.getStatusColor(OrderStatus_c) }
          ]}
        >
          {getOrderStatus(OrderStatus_c)}
        </Text>

        {/* <View style={styles.buttonWrapperStyle}>
          {this.renderEditDeleteIcon(PaymentStatus_c)}
        </View> */}
      </View>
    );
  }
}

export default OrderListRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  stockRequestTextStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    color: APP_THEME.APP_FONT_COLOR_DARK,
    textDecorationLine: 'underline'
  },
  stockRequestContainerStyle: {
    flex: 1.7,
    marginLeft: 10
  },
  textBaseStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: 'normal',
    fontSize: 14,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    lineHeight: 18
  },
  textHeaderStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '600',
    fontSize: 14,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    lineHeight: 18,
    justifyContent: 'center'
  },
  buttonWrapperStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginRight: 20
  }
});
