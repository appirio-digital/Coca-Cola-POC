import React, { Component } from 'react';
import { View, FlatList } from 'react-native';

import InvoiceListRow from './InvoiceRow';
import { APP_ROUTE } from '../../../../constants';
import { labels } from '../../../../stringConstants';
import {
  fetchObjectCollection,
  API_END_POINT,
  API_NAME_POC
} from '../../../../services/omcClient';

class Invoice extends Component {
  state = {
    invoiceList: []
  };
  invoiceItemClickHandler = (item, isHistory) => {
    const { RecordName } = item;
    const {
      navigation,
      navigation: {
        state: { params }
      }
    } = this.props;

    navigation.navigate(APP_ROUTE.CUSTOMER_PAYMENT, {
      headerTitle: isHistory
        ? labels.PAYMENT_HISTORY + ' ( ' + RecordName + ' )'
        : labels.PAYMENT_COLLECTION + '- ' + RecordName,
      isHistory,
      invoice: item,
      customer: params.customer
    });
  };
  async componentDidMount() {
    this.fetchOrder();
  }

  fetchOrder = async () => {
    try {
      const {
        customersActions,
        navigation: {
          state: { params }
        }
      } = this.props;
      const response = await customersActions.getCustomerOrder();
      const orderList =
        response &&
        response.filter(order => order.Account_Id_c == params.customer.id);
      this.setState(
        {
          orderList,
          accountId: params.customer.id,
          accountName: params.customer.PartyName
        },
        () => {
          this.fetchInvoice();
        }
      );
    } catch (error) {}
  };

  fetchInvoice = async () => {
    try {
      const {
        customersActions,
        navigation: {
          state: { params }
        }
      } = this.props;
      if (params && params.customer) {
        const response = await customersActions.getCustomerInvoice();
        if (response) {
          const result = response.filter(invoice =>
            this.state.orderList.find(order => {
              return (
                invoice.CustomerOrder_Id_c == order.Id ||
                invoice.__ORACO__AuxiliaryAttribute01_c == order.MobileUId_c
              );
            })
          );
          this.setState({ invoiceList: result });
        }
      }
    } catch (error) {}
  };

  renderCustomerItem = item => {
    const {
      auth: { profile }
    } = this.props;
    return (
      <InvoiceListRow
        onPressed={() => {}}
        country="Singapore"
        onPaymentPress={this.invoiceItemClickHandler}
        item={{ ...item.item, visited: true }}
      />
    );
  };
  _keyExtractor = (item, index) => `${index}`;
  render() {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15
        }}
      >
        <FlatList
          data={this.state.invoiceList}
          style={{ flex: 1, marginTop: 10 }}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderCustomerItem}
        />
      </View>
    );
  }
}

export default Invoice;
