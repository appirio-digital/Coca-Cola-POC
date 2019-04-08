import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../../../constants';
import { labels } from '../../../../stringConstants';
import isEmpty from 'lodash/isEmpty';
import { formatAmount, roundAmount } from '../../../../utility';
class InvoiceListRow extends PureComponent {
  calculateTaxes = () => {
    const {
      item: { __ORACO__Tax1_c, __ORACO__Tax2_c, CurrencyCode }
    } = this.props;
    const tax1 = __ORACO__Tax1_c ? parseInt(__ORACO__Tax1_c) : 0;
    const tax2 = __ORACO__Tax2_c ? parseInt(__ORACO__Tax2_c) : 0;
    const finalTaxes = tax1 + tax2;
    return formatAmount(parseFloat(finalTaxes), CurrencyCode);
  };

  render() {
    const {
      onPressed,
      onPaymentPress,
      country,
      item: {
        __ORACO__Discount_c,
        __ORACO__SubtotalAmount_c,
        __ORACO__Tax1_c,
        __ORACO__Tax1Code_c,
        __ORACO__Tax2_c,
        __ORACO__Tax2Code_c,
        __ORACO__TotalAmount_c,
        CustomerOrder_Id_c,
        __ORACO__AuxiliaryAttribute01_c,
        MobileUId_c,
        RecordName,
        CurrencyCode
      }
    } = this.props;

    const finalTaxes = this.calculateTaxes();
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => onPressed(this.props.item)}
        >
          <View style={styles.textItemContainer}>
            <View style={styles.headerItemRow}>
              <Text style={styles.itemTextCode}>
                {labels.ORDER}:{' '}
                {isEmpty(CustomerOrder_Id_c)
                  ? __ORACO__AuxiliaryAttribute01_c
                  : CustomerOrder_Id_c}
              </Text>
              <Text style={styles.itemTextInvoice}>{RecordName}</Text>
            </View>
            <View style={styles.detailItemRow}>
              <View style={styles.detailItemMajor}>
                <Text style={styles.itemText}>{labels.DISCOUNT}: </Text>
                <Text style={styles.itemTextOther}>
                  {__ORACO__Discount_c &&
                    formatAmount(parseFloat(__ORACO__Discount_c), CurrencyCode)}
                </Text>
              </View>
              <View style={styles.detailItemMinor}>
                <Text style={styles.itemText}>{labels.SUB_AMOUNT}: </Text>
                <Text style={styles.itemTextOther}>
                  {__ORACO__SubtotalAmount_c &&
                    formatAmount(
                      parseFloat(__ORACO__SubtotalAmount_c),
                      CurrencyCode
                    )}
                </Text>
              </View>
            </View>
            <View style={styles.detailItemRow}>
              <View style={styles.detailItemMajor}>
                <Text style={styles.itemText}>{labels.TAX}: </Text>
                <Text style={styles.itemTextOther}>{finalTaxes}</Text>
              </View>
              <View style={styles.detailItemMinor}>
                <Text style={styles.itemText}>{labels.TOTAL_AMOUNT}: </Text>
                <Text style={styles.itemTextOther}>
                  {__ORACO__TotalAmount_c &&
                    formatAmount(
                      parseFloat(__ORACO__TotalAmount_c),
                      CurrencyCode
                    )}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={
                country === 'CA' ? styles.buttonDisableView : styles.buttonView
              }
              disabled={country === 'CA' ? true : false}
              onPress={() => onPaymentPress(this.props.item, false)}
            >
              <Text
                style={
                  country === 'CA'
                    ? styles.itemDisableTextButton
                    : styles.itemTextButton
                }
              >
                {labels.COLLECT_PAYMENT}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={
                country === 'CA' ? styles.buttonDisableView : styles.buttonView
              }
              disabled={country === 'CA' ? true : false}
              onPress={() => onPaymentPress(this.props.item, true)}
            >
              <Text
                style={
                  country === 'CA'
                    ? styles.itemDisableTextButton
                    : styles.itemTextButton
                }
              >
                {labels.PAYMENT_HISTORY}
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default InvoiceListRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    shadowColor: APP_THEME.APP_LIST_BORDER_COLOR,
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    padding: 10
  },
  itemContainer: {
    flex: 10,
    flexDirection: 'row'
  },
  headerItemRow: {
    flex: 1,
    flexDirection: 'column',
    marginBottom: 20
  },
  detailItemRow: {
    flex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  detailItemMajor: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 3,
    paddingRight: 3
  },
  detailItemMinor: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  iconStyle: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 14,
    lineHeight: 18,
    alignItems: 'center'
  },

  buttonContainer: {
    flex: 2.2,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonView: {
    borderColor: APP_THEME.APP_BASE_COLOR,
    borderWidth: 1,
    borderRadius: 3,
    width: 130,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 5
  },
  buttonImageView: {
    padding: 5
  },
  textItemContainer: {
    flex: 8,
    paddingLeft: 5,
    paddingRight: 5
  },
  itemTextCode: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 14,
    lineHeight: 18
  },
  itemText: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    margin: 0,
    fontSize: 14,
    lineHeight: 18
  },
  itemTextInvoice: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    margin: 0,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600'
  },
  itemTextOther: {
    color: APP_THEME.APP_LIST_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_REGULAR,
    margin: 0,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 14,
    lineHeight: 18
  },
  itemTextButton: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    margin: 0,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 14,
    lineHeight: 18
  },
  itemTextDate: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_REGULAR,
    margin: 0,
    paddingLeft: 5,
    paddingRight: 5,

    fontSize: 14,
    lineHeight: 18
  },
  iconText: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 14,
    lineHeight: 18
  },
  buttonDisableView: {
    borderColor: APP_THEME.APP_BASE_COLOR_GREY,
    borderWidth: 1,
    borderRadius: 3,
    width: 130,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 5
  },
  itemDisableTextButton: {
    color: APP_THEME.APP_BASE_COLOR_GREY,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    margin: 0,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 14,
    lineHeight: 18
  }
});
