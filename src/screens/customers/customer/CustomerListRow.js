import React, { PureComponent } from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image,
  Linking
} from 'react-native';
import { APP_FONTS, APP_THEME } from '../../../constants';
import { labels } from '../../../stringConstants';
import { IconButton } from '../../../components/common';
import { isEmpty, find } from 'lodash';

class CustomerListRow extends PureComponent {
  openOracleRetailApp = async () => {
    let url = 'cg://ehjz.fa.us2.oraclecloud.com';
    try {
      let supported = await Linking.canOpenURL(url);
      if (!supported) {
      } else {
        return Linking.openURL(url);
      }
    } catch (error) {
      console.error('An error occurred', error);
    }
  };

  getContactDetails = contacts => {
    const contact = find(contacts, contacts => contacts.primary == 'true');
    if (contact && Object.keys(contact).length > 0) {
      return contact;
    } else {
      return { phone: 'N/A' };
    }
  };

  getAddressDetail = addresses => {
    const address = find(
      addresses,
      addresses => addresses.primary == 'true' || addresses.primary
    );
    if (address && Object.keys(address).length > 0) {
      return address;
    } else {
      return {
        street: '',
        city: '',
        country: '',
        postalcode: '',
        additional: '',
        state: ''
      };
    }
  };

  render() {
    const {
      onPressed,
      item: { id, name, contacts, address },

      onNewOrderClick
    } = this.props;

    /*const { street, city, country, postalcode, additional, state } = find(
      address,
      address => address.primary == 'true'
    );*/

    const {
      street,
      city,
      country,
      postalcode,
      additional,
      state
    } = this.getAddressDetail(address);
    const { phone = '' } = this.getContactDetails(contacts);

    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => onPressed(this.props.item)}
        >
          <View style={styles.textItemContainer}>
            <View style={styles.headerItemRow}>
              <View style={{ flex: 1, paddingBottom: 5 }}>
                <Text style={styles.itemTextCode}>{id}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTextName}>{name}</Text>
              </View>
            </View>
            <View style={styles.detailItemRow}>
              <View style={styles.detailItemMajor}>
                <Text style={styles.iconStyle}></Text>
                <Text style={styles.itemTextOther}>
                  {additional ? additional + ', ' : ''}
                  {street ? street + ', ' : ''}
                  {city ? city + ', ' : ''}
                  {state ? state + ' ' : ''}
                  {postalcode ? postalcode + ', ' : ''}
                  {country ? country : ''}
                </Text>
              </View>
              <View style={styles.detailItemMinor}>
                <Text style={styles.itemText}>{labels.AREA}: </Text>
                <Text style={styles.itemTextOther}>{labels.NA}</Text>
              </View>
            </View>
            <View style={styles.detailItemRow}>
              <View style={styles.detailItemMajor}>
                <Text style={styles.iconStyle}></Text>
                <Text style={styles.itemTextOther}>{phone}</Text>
              </View>
              <View style={styles.detailItemMinor}>
                <Text style={styles.itemText}>{labels.OUTLET_TYPE}: </Text>
                <Text style={styles.itemTextOther}>{labels.NA}</Text>
              </View>
            </View>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.buttonView}
              onPress={onNewOrderClick(id)}
            >
              <Text
                style={[styles.iconStyle, { color: APP_THEME.APP_BASE_COLOR }]}
              >
                
              </Text>
              <Text style={[styles.itemTextButton]}>{labels.NEW_ORDER}</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
              style={styles.buttonView}
              onPress={this.openOracleRetailApp}
            >
              <Image
                style={styles.buttonImageView}
                source={require('../../../images/oracle-retail.png')}
              />
            </TouchableOpacity> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export default CustomerListRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    // shadowColor: APP_THEME.APP_LIST_BORDER_COLOR,
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.1,
    // shadowRadius: 2,
    // elevation: 1,
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
    marginBottom: 15
  },
  detailItemRow: {
    flex: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingBottom: 10
  },
  detailItemMajor: {
    flex: 6,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    paddingRight: 50
  },
  detailItemMinor: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  iconStyle: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    alignItems: 'center',
    fontSize: 14,
    lineHeight: 18
  },

  buttonContainer: {
    flex: 2,
    paddingLeft: 5,
    paddingRight: 5
  },
  buttonView: {
    borderColor: APP_THEME.APP_BASE_COLOR,
    borderWidth: 1,
    borderRadius: 3,
    padding: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    maxHeight: 32
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
  itemTextName: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_REGULAR,
    margin: 0,
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 19
  },
  itemText: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    margin: 0,
    fontSize: 14,
    lineHeight: 20
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
    fontSize: 12
  },
  itemTextDate: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_REGULAR,
    margin: 0,
    paddingLeft: 5,
    paddingRight: 5,

    fontSize: 20
  },
  iconText: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 14,
    lineHeight: 18
  }
});
