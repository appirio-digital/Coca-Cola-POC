import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';
import { labels } from '../../stringConstants';
import isEmpty from 'lodash/isEmpty';
class SlotItemRow extends PureComponent {
  render() {
    const {
      onPaymentPress,
      item: {
        ProductName,
        ProductNumber,
        CurrentTally,
        TallyUpdateDate,
        PreviousTally
      }
    } = this.props;

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.itemContainer}
        >
          <View style={styles.textItemContainer}>
            <View style={styles.headerItemRow}>
              <Text
                style={styles.itemTextCode}
              >{`Product Number:${ProductNumber}`}</Text>
              <Text style={styles.itemTextInvoice}>{ProductName}</Text>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonView}
              onPress={() => onPaymentPress(this.props.item)}
            >
              <Text style={styles.itemTextButton}>{labels.BALANCE}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default SlotItemRow;

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
