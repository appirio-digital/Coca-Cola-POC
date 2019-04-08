import React, { Component, PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import isEmpty from 'lodash/isEmpty';
import PaymentHistory from './PaymentHistory';
import PaymentCollection from './PaymentCollection';
import { APP_THEME } from '../../../../constants';
import TabBar from '../../../../components/TabBar';
import { labels } from '../../../../stringConstants';
import { find } from 'lodash';
export default class Payment extends PureComponent {
  state = {
    paymentHistory: [],
    paymentResponse: {}
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
        var filteredPaymentResponse = [];
        if (!isEmpty(paymentHistory)) {
          filteredPaymentResponse = paymentResponse.filter(payment => {
            return paymentHistory.find(
              pay =>
                payment.Id == pay.__ORACO__Payment_Id_c ||
                payment.MobileUId_c == pay.ParentMobileUId_c
            );
          });
        }
        this.setState({
          paymentHistory,
          paymentResponse: filteredPaymentResponse[0]
        });
      }
    }
  };

  render() {
    const {
      navigation: {
        state: { params }
      }
    } = this.props;

    return (
      <View style={styles.container}>
        <TabBar activeTab={params && params.isHistory ? 1 : 0}>
          <View
            style={styles.tabContainer}
            title={labels.PAYMENT_COLLECTION.toUpperCase()}
          >
            <PaymentCollection
              invoice={params && params.invoice ? params.invoice : {}}
              customer={params && params.customer ? params.customer : {}}
              paymentResponse={this.state && this.state.paymentResponse}
              paymentHistory={this.state && this.state.paymentHistory}
              {...this.props}
            />
          </View>
          <View
            style={styles.tabContainer}
            title={labels.PAYMENT_HISTORY.toUpperCase()}
          >
            <PaymentHistory {...this.props} />
          </View>
        </TabBar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_THEME.APP_BACKGROUND_COLOR,
    padding: 20
  },
  tabContainer: {
    flex: 1,
    flexDirection: 'column'
  }
});
