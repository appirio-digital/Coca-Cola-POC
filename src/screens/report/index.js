import React, { PureComponent } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';
import DateTimePicker from '../../components/DateTimePicker';
import { labels } from '../../stringConstants';
import moment from 'moment';
import ReportRow from './ReportRow';
import { groupBy, filter, find, map } from 'lodash';
import { formatApiDate, getCurrentDateInGMT } from '../../utility';
import Loader from '../../components/common/Loader';
import {
  fetchObjectCollection,
  API_END_POINT,
  API_NAME,
  API_NAME_POC,
  API_JTI_CUSTOMER_API
} from '../../services/omcClient';

//Testing
//import paymentList from '../../store/modules/reports/Payment.json';
//import PaymentLineItemList from '../../store/modules/reports/PaymentLine.json';

import {
  TRANSACTION_CASH_SALES_KEY,
  TRANSACTION_CHEQUE_COLLECTION_KEY,
  TRANSACTION_CASH_RETURN_KEY,
  TRANSACTION_CASH_COLLECTION_KEY,
  TRANSACTION_BANK_TRANSFER_KEY,
  TRANSACTION_CASH_SALES_NET_KEY
} from './types';

class Reports extends PureComponent {
  state = {
    selectedDate: moment().format('MM/DD/YYYY'),
    paymentslist: [],
    summaryList: [],
    loading: false,
    NoTransactionMessage: labels.NO_TRANSACTION_MESSAGE,
    isNoTransactions: false,
    customerList: []
  };

  async componentDidMount() {
    this.getPaymentSummaryReport(getCurrentDateInGMT());
  }
  getPaymentSummaryReport = async date => {
    this.setState({ loading: true, isNoTransactions: false });
    const response = await fetchObjectCollection(
      API_JTI_CUSTOMER_API,
      API_END_POINT.CUSTOMERS
    );
    this.setState({ customerList: response });

    const { customersActions } = this.props;
    try {
      const paymentlistResponse = await customersActions.getInvoicePayment();
      //Filter payments based on selected date
      const filteredPayments = paymentlistResponse.filter(payment => {
        return payment.__ORACO__PaymentDate_c == date;
      });
      //Get Payment item if filteredPayments>0
      if (filteredPayments.length > 0) {
        const paymentInlineItemsResponse = await customersActions.getInvoicePaymentLine();
        //Filter Payment items based on paymentId
        const filteredPaymentLineItems = paymentInlineItemsResponse.filter(
          lineItem => {
            return find(filteredPayments, payment => {
              return payment.RecordName === lineItem.ParentMobileUId_c;
            });
          }
        );
        //Append Account name and payment date in paymentItem list
        const filteredPaymentLineItemsWithAccount = filteredPaymentLineItems.map(
          lineItem => {
            const payment = find(filteredPayments, payment => {
              return payment.RecordName === lineItem.ParentMobileUId_c;
            });
            const account = find(
              this.state.customerList,
              customer => customer.id == payment.__ORACO__Account_Id_c
            );
            const newobject = Object.assign({}, lineItem, {
              __ORACO__Account_c: account ? account.name : '',
              __ORACO__PaymentDate_c: payment.__ORACO__PaymentDate_c
            });
            return newobject;
          }
        );

        //Group the filteredPaymentLineItemsWithAccount based on TransactionType - CASH , CHEQUW , E-MONEY
        const groupedData = groupBy(
          filteredPaymentLineItemsWithAccount,
          lineItem => lineItem.__ORACO__Type_c
        );
        //Map Final Response
        const mappedResponse = Object.entries(groupedData).map(
          ([key, value]) => {
            const total = value.reduce((acc, item) => {
              return acc + parseFloat(item.__ORACO__Amount_c);
            }, 0);
            return { key: key, value: total };
          }
        );
        //Update the State
        this.setState({
          summaryList: mappedResponse,
          paymentList: groupedData,
          loading: false,
          isNoTransactions: false
        });
      } else {
        //Show Error as no transaction found for selected date
        this.setState({
          summaryList: [],
          paymentList: [],
          loading: false,
          isNoTransactions: true
        });
      }
    } catch (error) {
      //Show Error Message
      this.setState({
        summaryList: [],
        paymentList: [],
        loading: false,
        isNoTransactions: true,
        NoTransactionMessage: ''
      });
    }
  };

  fromDateChangeHandler = date => {
    const selectedDate = formatApiDate(date);
    this.setState({ selectedDate: date });
    this.getPaymentSummaryReport(selectedDate);
  };

  onGenerateReport = () => {
    if (this.state.isNoTransactions == false) {
      this.props.navigation.navigate('ReportPdf', {
        paymentslist: this.state.paymentList,
        summaryList: this.state.summaryList,
        date: this.state.selectedDate
      });
    }
  };

  renderItem = item => {
    const {
      auth: { profile }
    } = this.props;

    let currenyCode = profile.Currency == 'CAD' ? '$' : '€';
    return <ReportRow item={item.item} currenyCode={currenyCode} />;
  };

  render() {
    const {
      selectedDate,
      summaryList,
      loading,
      isNoTransactions,
      NoTransactionMessage
    } = this.state;
    const {
      mainContainerStyle,
      headerContainerStyle,
      datePickerCOntainerStyle,
      datePickerTitleStyle,
      datepickerComponentStyle,
      transactionContainerViewStyle,
      transactionsHeaderTitleStyle,
      generateButtonStyle,
      generateReportTitleStyle
    } = Styles;

    return (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <View style={headerContainerStyle}>
          <View style={datePickerCOntainerStyle}>
            <Text style={datePickerTitleStyle}>Date:</Text>
            <View style={datepickerComponentStyle}>
              <DateTimePicker
                mode="date"
                placeHolder="MM/DD/YYYY"
                isFormEditable
                onValueChange={this.fromDateChangeHandler}
                value={selectedDate}
              />
            </View>
          </View>

          <TouchableOpacity onPress={this.onGenerateReport}>
            <View style={generateButtonStyle}>
              <Text style={generateReportTitleStyle}>
                {labels.GENERATE_REPORT_BUTTON_TITLE}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={transactionContainerViewStyle}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              flex: 0.7,
              marginTop: 15,
              borderColor: 'gray',
              borderWidth: 0.5,
              borderRadius: 2
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Text style={transactionsHeaderTitleStyle}>
                {labels.REPORT_HEADDING_TITLE}
              </Text>
            </View>

            <Loader loading={loading} />

            {isNoTransactions && (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Text style={transactionsHeaderTitleStyle}>
                  {NoTransactionMessage}
                </Text>
              </View>
            )}

            <FlatList
              style={{
                flex: 1,
                paddingLeft: 114,
                paddingRight: 114,
                paddingTop: 5
              }}
              data={summaryList}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
            />
          </View>
        </View>
      </View>
    );
  }
}

export default Reports;

const Styles = {
  mainContainerStyle: {
    flex: 1,
    backgroundColor: '#fff'
  },
  headerContainerStyle: {
    flexDirection: 'row',
    height: 67,
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20
  },
  datePickerCOntainerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    borderRadius: 30
  },
  datePickerTitleStyle: {
    color: '#86898E',
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 14,
    paddingRight: 10
  },
  datepickerComponentStyle: {
    height: 40,
    width: 150,
    flexDirection: 'row'
  },
  transactionContainerViewStyle: {
    backgroundColor: '#F8F8F8',
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  transactionsHeaderTitleStyle: {
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 18,
    color: APP_THEME.APP_BASE_COLOR,
    paddingTop: 50
  },
  generateButtonStyle: {
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    width: 178,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  },
  generateReportTitleStyle: {
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 16,
    color: '#fff'
  }
};
