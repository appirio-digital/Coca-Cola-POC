import React, { Component } from 'react';
import { StyleSheet, View, Text, FlatList, TextInput } from 'react-native';
import { APP_FONTS, APP_THEME, APP_ROUTE } from '../../../constants';

import CustomerListRow from './CustomerListRow';
import { labels } from '../../../stringConstants';
import DataFilter from '../../../components/DateFilter';
import { Button, IconButton } from '../../../components/common';
import {
  isAfter,
  isBefore,
  formatDateMMDD,
  isDateValid,
  getToDateForRegion
} from '../../../utility';
import Loader from '../../../components/common/Loader';

class Customer extends Component {
  state = {
    filtered: false,
    searchTxt: '',
    fromDate: '',
    toDate: '',
    loading: false,
    customersList: []
  };
  customerItemClickHandler = item => {
    const { navigation } = this.props;
    const { name } = item;
    navigation.navigate(APP_ROUTE.CUSTOMER_DETAIL, {
      customer: item,
      headerTitle: name
    });
  };

  newCustomerClickHandler = () => item => {
    const { navigation } = this.props;
    navigation.navigate(APP_ROUTE.CUSTOMER_EDIT, {
      edit: true,
      headerTitle: labels.NEW_CUSTOMER
    });
  };

  renderCustomer = () => {
    const {
      filtered,
      customersActions,
      auth: { profile },
      customers: { customersList, fromDate, toDate }
    } = this.props;

    if (!(fromDate && toDate && isDateValid(fromDate) && isDateValid(toDate))) {
      customersActions.setFilterInitialDate(
        formatDateMMDD(new Date()),
        getToDateForRegion(profile && profile.PrimaryCountry_c == 'CA' ? 9 : 4)
      );
    }

    if (filtered) {
      this.setState({ customersList });
    } else {
      //customersActions.getActivity(fromDate, toDate);
      customersActions.getAllCustomers();
    }
    if (customersList === undefined) {
      customersActions.getAllCustomers();
      //customersActions.getActivity(fromDate, toDate);
    }
    this.setState({
      fromDate: fromDate,
      toDate: toDate,
      filtered: filtered ? true : false
    });
  };
  componentDidMount() {
    this.renderCustomer();
  }

  componentWillReceiveProps(newProps) {
    const {
      customers: { customersList, fromDate, toDate, loading, isReloadCustomer }
    } = newProps;

    if (isReloadCustomer) {
      this.renderCustomer();
      const { customersActions } = this.props;
      customersActions.reloadCustomer(false);
    } else {
      this.setState({
        customersList,
        fromDate: fromDate,
        toDate: toDate,
        loading
      });
    }
  }

  fromDateChangeHandler = date => {
    if (isBefore(this.state.toDate, date)) {
      this.setFilterDate({
        from: date,
        to: this.state.toDate
      });
      this.setState({ fromDate: formatDateMMDD(date) });
    }
  };

  setFilterDate = date => {
    const { customersActions } = this.props;
    customersActions.getActivity(date.from, date.to);
  };

  toDateChangeHandler = date => {
    if (isAfter(this.state.fromDate, date)) {
      this.setFilterDate({
        from: this.state.fromDate,
        to: date
      });
      this.setState({ toDate: formatDateMMDD(date) });
    }
  };

  renderCustomerItem = item => {
    return (
      <CustomerListRow
        onPressed={this.customerItemClickHandler}
        item={{ ...item.item, visited: true }}
        onNewOrderClick={this.onNewOrderClick}
      />
    );
  };

  applyFilter = customersList => {
    let { searchTxt } = this.state;
    if (customersList && searchTxt.length > 0) {
      searchTxt = searchTxt.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
      const regex = new RegExp(`${searchTxt.trim()}`, 'i');
      customersList = [...customersList].filter(
        item => item.name.search(regex) >= 0
      );
    }
    return customersList;
  };

  _renderHeaderBar = () => (
    <View style={styles.dateContainer}>
      {this.state.filtered ? (
        <DataFilter
          valueFrom={this.state.fromDate}
          valueTo={this.state.toDate}
          onFromValueChange={this.fromDateChangeHandler}
          onToValueChange={this.toDateChangeHandler}
        />
      ) : (
        <View
          style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}
        >
          <View style={styles.searchBarContainer}>
            <View>
              <Text style={styles.iconStyle}></Text>
            </View>
            <TextInput
              placeholder=""
              underlineColorAndroid="transparent"
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
      )}
    </View>
  );

  _keyExtractor = (item, index) => `${index}`;

  onNewOrderClick = accountId => () => {
    const { openBottomSheets } = this.props;
    openBottomSheets(true, accountId);
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
