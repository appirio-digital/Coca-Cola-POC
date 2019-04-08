import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../../../constants';
import { labels } from '../../../../stringConstants';
import { IconButton, TextButton } from '../../../../components/common';
import {
  getPaymentMode,
  formatAmount,
  formatDateDDMMYYYY
} from '../../../../utility';

class PaymentHistoryRow extends PureComponent {
  getPaymentStatus = (TotalAmount, __ORACO__Amount_c) => {
    if (TotalAmount <= __ORACO__Amount_c) {
      return labels.FULL;
    } else if (TotalAmount > __ORACO__Amount_c) {
      return labels.PARTIAL;
    }
  };

  render() {
    const {
      onPressed,
      item: {
        PaymentId,
        PaymentNumber,
        PaymentAmount,
        PaymentMode,
        AccountName,
        PaymentDate,
        PaymentInvoice,
        PaymentStatus,
        RecordName,
        __ORACO__Amount_c,
        __ORACO__BankAccountNumber_c,
        __ORACO__BankName_c,
        __ORACO__CheckNumber_c,
        __ORACO__Note_c,
        __ORACO__PayFor_c,
        __ORACO__PayToInvoice_c,
        __ORACO__Payment_Id_c,
        __ORACO__ProofOfPurchaseNumber_c,
        __ORACO__PurchaseOrderNumber_c,
        __ORACO__Type_c,
        CurrencyCode,
        __ORACO__PaymentDate_c,
        TotalAmount
      }
    } = this.props;
    //console.log(this.props.item);
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.stockRequestContainerStyle}
          onPress={() => onPressed()}
        >
          <Text style={styles.textHeaderStyle}>{RecordName}</Text>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingRight: 5,
            paddingLeft: 5
          }}
        >
          <Text style={[styles.textBaseStyle]}>
            {formatDateDDMMYYYY(__ORACO__PaymentDate_c)}
          </Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={[styles.textBaseStyle]}>
            {formatAmount(parseFloat(__ORACO__Amount_c), CurrencyCode)}
          </Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={[styles.textBaseStyle]}>
            {getPaymentMode(__ORACO__Type_c)}
          </Text>
        </View>

        {/* <Text style={[styles.textBaseStyle, { flex: 1.5 }]}>
          {this.getPaymentStatus(TotalAmount, __ORACO__Amount_c)}
        </Text> */}

        {/* <View style={styles.buttonWrapperStyle}>
          <TouchableOpacity>
            <Text style={styles.stockRequestTextStyle}>{labels.VIEW}</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}

export default PaymentHistoryRow;

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
    color: APP_THEME.APP_FONT_COLOR_ORANGE,
    textDecorationLine: 'underline'
  },
  stockRequestContainerStyle: {
    flex: 2,
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
    color: APP_THEME.APP_FONT_COLOR_REGULAR,
    lineHeight: 18
  },
  buttonWrapperStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginRight: 20
  }
});
