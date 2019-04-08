import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput } from 'react-native';
import { APP_FONTS, APP_THEME, APP_ROUTE } from '../../../constants';

import CustomerListRow from './CustomerListRow';
import { labels } from '../../../stringConstants';
import { Button, IconButton } from '../../../components/common';
import Loader from '../../../components/common/Loader';
import {
  fetchObjectCollection,
  API_END_POINT,
  API_NAME,
  API_NAME_POC
} from '../../../services/omcClient';
import { find } from 'lodash';
class Customer extends Component {
  state = {
    filtered: false,
    searchTxt: '',
    loading: false,
    customersList: []
  };
  customerItemClickHandler = item => {
    const { navigation } = this.props;
    const { OrganizationName } = item;
    navigation.navigate(APP_ROUTE.CUSTOMER_DETAIL, {
      customer: item,
      headerTitle: OrganizationName
    });
  };

  newCustomerClickHandler = () => item => {
    const { navigation } = this.props;
    navigation.navigate(APP_ROUTE.CUSTOMER_EDIT, {
      edit: true,
      headerTitle: labels.NEW_CUSTOMER
    });
  };

  componentDidMount() {
    this.loadCustomer();
  }

  loadCustomer = async () => {
    try {
      this.setState({ loading: true });
      const response = await fetchObjectCollection(
        API_NAME,
        API_END_POINT.ACCOUNT
      );

      const contactResponse = await fetchObjectCollection(
        API_NAME,
        API_END_POINT.CONTACT
      );
      const accounts = [...response].map(account => {
        const contact = find(contactResponse, contact => {
          return (
            `${contact.AccountPartyNumber}` == `${account.PartyNumber}` ||
            (contact.SourceSystemReferenceValue.length > 0 &&
              account.SourceSystem.length > 0 &&
              contact.SourceSystemReferenceValue == account.SourceSystem)
          );
        });
        return {
          ...account,
          contact: contact
        };
      });
      this.setState({ loading: false, customersList: accounts });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  componentWillReceiveProps(newProps) {
    const {
      customers: { isReloadCustomer }
    } = newProps;

    if (isReloadCustomer) {
      this.loadCustomer();
      const { customersActions } = this.props;
      customersActions.reloadCustomer(false);
    }
  }

  renderCustomerItem = item => {
    return (
      <CustomerListRow
        onPressed={this.customerItemClickHandler}
        item={{ ...item.item, visited: true }}
        onNewOrderClick={this.onNewOrderClick}
      />
    );
  };

  _renderHeaderBar = () => (
    <View style={styles.dateContainer}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}
      >
        <View style={styles.searchBarContainer}>
          <View>
            <Text style={styles.iconStyle}></Text>
          </View>
          <TextInput
            underlineColorAndroid="transparent"
            placeholder=""
            style={styles.inputStyle}
            value={this.state.searchTxt}
            onChangeText={searchTxt => {
              this.setState({ searchTxt });
            }}
          />
        </View>
        <View
          style={{ width: 200, paddingTop: 5, paddingBottom: 5, height: 50 }}
        >
          <IconButton
            bgColor={APP_THEME.APP_BASE_COLOR}
            onPress={this.newCustomerClickHandler()}
          >
            <Text
              style={{
                fontSize: 20,
                alignItems: 'center',
                textAlign: 'center',
                fontWeight: '600',
                fontWeight: '600',
                fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN
              }}
            >
              
            </Text>{' '}
            <Text
              style={{
                fontSize: 16,
                alignItems: 'center',
                textAlign: 'center',
                fontWeight: '600',
                fontWeight: '600',
                fontFamily: APP_FONTS.FONT_REGULAR
              }}
            >
              {labels.NEW_CUSTOMER}
            </Text>
          </IconButton>
        </View>
      </View>
    </View>
  );

  _keyExtractor = (item, index) => `${index}`;

  onNewOrderClick = accountId => () => {
    const { openBottomSheets } = this.props;
    openBottomSheets(true, accountId);
  };

  applyFilter = customersList => {
    const { searchTxt } = this.state;
    if (customersList && searchTxt.length > 0) {
      const regex = new RegExp(`${searchTxt.trim()}`, 'i');
      customersList = [...customersList].filter(
        item => item.OrganizationName.search(regex) >= 0
      );
    }
    return customersList;
  };

  render() {
    const { customersList, loading } = this.state;
    const lists = this.applyFilter(customersList);
    return (
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1
        }}
      >
        <Loader loading={loading} />
        {this._renderHeaderBar()}

        <FlatList
          data={lists}
          style={{ flex: 1, paddingLeft: 15, paddingRight: 15 }}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderCustomerItem}
        />
      </View>
    );
  }
}

export default Customer;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20
  },
  dateLable: {
    color: APP_THEME.APP_FONT_COLOR_REGULAR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 20
  },
  dateIcon: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 22,
    paddingRight: 10
  },
  dateValue: {
    height: 40,
    width: 110,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10
  },
  searchBarContainer: {
    flex: 1,
    maxHeight: 40,
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2
  },
  iconStyle: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 22,
    lineHeight: 26,
    alignItems: 'center'
  },
  inputStyle: { padding: 10, fontSize: 14, flex: 1 }
});
