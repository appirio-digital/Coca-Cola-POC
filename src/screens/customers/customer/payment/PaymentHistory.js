import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import PaymentHistoryRow from './PaymentHistoryRow';
import PaymentHistoryHeader from './PaymentHistoryHeader';
import { labels } from '../../../../stringConstants';
import { find, isEmpty } from 'lodash';
export default class PaymentHistory extends Component {
  state = {
    paymentHistory: []
  };

  componentDidMount() {
    this.fetchPaymentAndPaymentLine();
  }

  fetchPaymentAndPaymentLine = async () => {
    const {
      navigation: {
        state: { params }
      },
      customersActions
    } = this.props;
    if (params && params.invoice) {
      const paymentResponse = await customersActions.getInvoicePayment();
      if (!isEmpty(paymentResponse)) {
        const paymentLineResponse = await customersActions.getInvoicePaymentLine();
        const paymentLineFiltered =
          paymentLineResponse &&
          paymentLineResponse.filter(
            paymentLine =>
              paymentLine.__ORACO__PayToInvoice_c == params.invoice.RecordName
          );
        const paymentHistory = paymentLineFiltered.map(paymentLine => {
          const paymentMapping = find(paymentResponse, map => {
            return map.Id == paymentLine.__ORACO__Payment_Id_c;
          });
          paymentLine = Object.assign({}, paymentLine, {
            __ORACO__PaymentDate_c:
              paymentMapping && paymentMapping.__ORACO__PaymentDate_c,
            TotalAmount: paymentMapping && paymentMapping.__ORACO__Amount_c
          });
          return paymentLine;
        });
        this.setState({
          paymentHistory
        });
      }
    }
  };

  componentWillReceiveProps(newProps) {}

  renderItem = item => {
    return (
      <PaymentHistoryRow
        onPressed={() => {}}
        onPaymentPress={() => {}}
        item={{ ...item.item, visited: true }}
      />
    );
  };
  _keyExtractor = (item, index) => `${index}`;
  render() {
    const { paymentHistory } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <PaymentHistoryHeader />
        <FlatList
          data={paymentHistory && paymentHistory}
          style={{ flex: 1, marginTop: 10 }}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
