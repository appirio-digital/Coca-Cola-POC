import React, { PureComponent, Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Platform
} from 'react-native';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import { Card, Button } from '../../../../components/common';
import { APP_FONTS, APP_THEME } from '../../../../constants';
import { labels } from '../../../../stringConstants';
import CreditNotesHeader from './CreditNotesHeader';
import CreditNotesRow from './CreditNotesRow';
import {
  API_END_POINT,
  createNewObject,
  SyncPinPriority,
  API_NAME_POC
} from '../../../../services/omcClient';
import Loader from '../../../../components/common/Loader';
import DateTimePicker from '../../../../components/DateTimePicker';
import {
  randomString,
  getCurrentTimestampInGMT,
  formatAmount,
  roundAmount
} from '../../../../utility';

let randomStringForPayment = `Payment#'${getCurrentTimestampInGMT()}`;
export default class PaymentCollection extends Component {
  state = {
    cashAmount: 0,
    cashPaidNarration: '',
    chequeAmount: 0,
    chequeNo: '',
    chequeDate: '',
    bankName: '',
    branchName: '',
    eMoneyAmount: 0,
    eMoneyPaidDate: '',
    eMoneyTransactonId: '',
    TotalAmountPaid: 0,
    loading: false,
    selectedDateForCheque: '',
    selectedDateForET: '',
    paymentResponse: {},
    paymentHistory: []
  };

  componentDidMount() {
    this.fetchOrder();
  }

  componentWillReceiveProps(newProps) {
    const { paymentHistory, paymentResponse } = newProps;
    if (!isEmpty(paymentHistory)) {
      this.setState({ paymentHistory: paymentHistory });
    }
    if (!isEmpty(paymentResponse)) {
      this.setState({ paymentResponse: paymentResponse });
    }
  }

  fetchOrder = async () => {
    const {
      customersActions,
      navigation: {
        state: { params }
      }
    } = this.props;
    if (params && params.customer) {
      const response = await customersActions.getCustomerOrder();
      const orderList =
        response &&
        response.filter(order => order.Account_Id_c == params.customer.id);
      //customersActions.getCustomerCreditNotes(InvoiceId);
      this.setState({ orderList });
    }
  };

  handleAmountChange = (text, value) => {
    switch (value) {
      case 'ChequeAmount':
        this.setState({ chequeAmount: text });
        break;
      case 'ChequeNo':
        this.setState({ chequeNo: text });
        break;
      case 'ChequeDate':
        this.setState({ chequeDate: text });
        break;
      case 'BankName':
        this.setState({ bankName: text });
        break;
      case 'BranchName':
        this.setState({ branchName: text });
        break;
      case 'EmoneyAmount':
        this.setState({ eMoneyAmount: text });
        break;
      case 'EmoneyDate':
        this.setState({ eMoneyPaidDate: text });
        break;
      case 'EmoneyTranscationId':
        this.setState({ eMoneyTransactonId: text });
        break;
      case 'CashAmount':
        this.setState({ cashAmount: text });
        break;
      case 'CashNarration':
        this.setState({ cashPaidNarration: text });
        break;
      default:
        break;
    }
  };

  validateAmountToBePaid = () => {
    const { invoice } = this.props;
    const {
      paymentResponse,
      cashAmount,
      eMoneyAmount,
      chequeAmount
    } = this.state;
    var totalAmountInvoice = parseFloat(invoice.__ORACO__TotalAmount_c);
    var totalAmountPaid = 0;
    const userEnterAmount =
      parseFloat(cashAmount) +
      parseFloat(eMoneyAmount) +
      parseFloat(chequeAmount);
    if (!isEmpty(paymentResponse)) {
      totalAmountPaid =
        parseFloat(paymentResponse.__ORACO__Amount_c) + userEnterAmount;
    } else {
      totalAmountPaid = userEnterAmount;
    }
    const TotalAmountPaying = totalAmountPaid;
    if (totalAmountInvoice !== totalAmountPaid) {
      if (totalAmountInvoice >= TotalAmountPaying) {
        this.setState({ TotalAmountPaid: TotalAmountPaying }, () => {
          return true;
        });
      } else {
        this.setState({ loading: false }, () => {
          setTimeout(() => {
            Alert.alert('', labels.PAYMENT_ERROR, [{ text: labels.OK }], {
              cancelable: false
            });
          }, 200);
        });

        return false;
      }
    }
    return true;
  };

  savePayment = () => {
    if (this.validateAmountToBePaid()) {
      const { paymentResponse } = this.state;
      try {
        if (isEmpty(paymentResponse)) {
          this.postRequestForPayment();
        } else {
          this.putRequestForPayment();
        }
      } catch (error) {
        this.setState({ loading: false });
      }
    }
  };

  postRequestForPayment = async () => {
    const { TotalAmountPaid } = this.state;
    const { RecordName, __ORACO__TotalAmount_c } = this.props.invoice;
    const { id } = this.props.customer;
    const oraco_Amount =
      parseFloat(this.state.cashAmount) +
      parseFloat(this.state.chequeAmount) +
      parseFloat(this.state.eMoneyAmount);
    if (TotalAmountPaid != __ORACO__TotalAmount_c && oraco_Amount > 0) {
      this.setState({ loading: true });
      const request = {
        RecordName: randomStringForPayment,
        __ORACO__Account_Id_c: id,
        __ORACO__Amount_c: roundAmount(oraco_Amount),
        __ORACO__Note_c: 'Record for ' + RecordName,
        __ORACO__PaymentDate_c: moment(new Date()).format('YYYY-MM-DD'),
        __ORACO__ProcessStatus_c: 'ORA_ACO_PROCESS_STATUS_READY',
        MobileUId_c: randomStringForPayment
      };
      console.log('request', request);
      try {
        const result = await createNewObject(
          request,
          API_NAME_POC,
          API_END_POINT.INVOICE_PAYMENT,
          'MobileUId_c',
          SyncPinPriority.Normal
        );
        console.log('Payment response', result);
        if (result.success) {
          this.setState(
            {
              paymentResponse: result.object
            },
            () => {
              if (this.state.cashAmount > 0) {
                this.postRequestForPaymentLine(this.state.cashAmount, 'cash');
              }
              if (this.state.chequeAmount > 0) {
                this.postRequestForPaymentLine(
                  this.state.chequeAmount,
                  'cheque'
                );
              }
              if (this.state.eMoneyAmount > 0) {
                this.postRequestForPaymentLine(
                  this.state.eMoneyAmount,
                  'eMoney'
                );
              } else {
                this.setState({ loading: false });
              }
            }
          );
        }
      } catch (error) {
        console.log('error', error);
        this.setState({ loading: false });
      }
    } else {
      console.log('else');
      this.setState({ loading: false });
    }
  };

  putRequestForPayment = async () => {
    this.setState({ loading: true });
    var paymentResponse =
      (!isEmpty(this.state.paymentResponse) && this.state.paymentResponse) ||
      (!isEmpty(this.props.paymentResponse) && this.props.paymentResponse);
    paymentResponse.__ORACO__Amount_c = roundAmount(
      parseFloat(paymentResponse.__ORACO__Amount_c) +
        parseFloat(this.state.cashAmount) +
        parseFloat(this.state.chequeAmount) +
        parseFloat(this.state.eMoneyAmount)
    );
    try {
      const result = await createNewObject(
        paymentResponse,
        API_NAME_POC,
        API_END_POINT.INVOICE_PAYMENT,
        'MobileUId_c',
        SyncPinPriority.Normal
      );
      if (result.success) {
        this.setState(
          {
            paymentResponse: result.object
          },
          () => {
            if (this.state.cashAmount > 0) {
              this.postRequestForPaymentLine(this.state.cashAmount, 'cash');
            }
            if (this.state.chequeAmount > 0) {
              this.postRequestForPaymentLine(this.state.chequeAmount, 'cheque');
            }
            if (this.state.eMoneyAmount > 0) {
              this.postRequestForPaymentLine(this.state.eMoneyAmount, 'eMoney');
            } else {
              this.setState({ loading: false });
            }
          }
        );
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  postRequestForPaymentLine = async (amount, type) => {
    const { invoice } = this.props;
    const { paymentResponse } = this.state;
    const order = this.state.orderList.filter(
      order =>
        order.Id == invoice.CustomerOrder_Id_c ||
        order.MobileUId_c == invoice.__ORACO__AuxiliaryAttribute01_c
    );
    let request = {
      RecordName: `${'Payment'}${'_'}${type}${'_'}${getCurrentTimestampInGMT()}`,
      __ORACO__Payment_Id_c:
        (!isEmpty(paymentResponse) && paymentResponse.Id) ||
        (!isEmpty(this.state.paymentResponse) && this.state.paymentResponse.Id),
      __ORACO__Amount_c: roundAmount(amount),
      __ORACO__PayToInvoice_c: invoice.RecordName,
      __ORACO__BankName_c: '',
      __ORACO__BankAccountNumber_c: '0',
      __ORACO__ProofOfPurchaseNumber_c: '',
      __ORACO__PurchaseOrderNumber_c:
        order && order.length > 0 && order[0].RecordName,
      __ORACO__Note_c: '',
      __ORACO__CheckNumber_c: '',
      __ORACO__PayFor_c: 'ORA_ACO_PAYMENT_LINE_FOR_INV',
      __ORACO__ETransferTxnNo_c: '',
      MobileUId_c: `${'PaymentLine'}${'#'}${randomString(20)}`,
      ParentMobileUId_c:
        (!isEmpty(paymentResponse) && paymentResponse.MobileUId_c) ||
        randomStringForPayment
    };
    if (type === 'cash') {
      request['__ORACO__Type_c'] = 'ORA_ACO_PAYMENT_TYPE_CASH';
      request['__ORACO__Note_c'] = this.state.cashPaidNarration;
    }
    if (type === 'cheque') {
      request['__ORACO__Type_c'] = 'ORA_ACO_PAYMENT_TYPE_CHECK';
      request['__ORACO__BankName_c'] = this.state.bankName;
      request['__ORACO__CheckNumber_c'] = this.state.chequeNo;
    }
    if (type === 'eMoney') {
      request['__ORACO__Type_c'] = 'ORA_ACO_PAYMENT_TYPE_ET';
      request['__ORACO__ETransferTxnNo_c'] = this.state.eMoneyTransactonId;
    }
    try {
      const result = await createNewObject(
        request,
        API_NAME_POC,
        API_END_POINT.INVOICE_PAYMENT_LINE,
        'MobileUId_c',
        SyncPinPriority.Normal
      );
      this.setState(
        {
          loading: false,
          TotalAmountPaid: roundAmount(paymentResponse.__ORACO__Amount_c)
        },
        () => {
          setTimeout(() => {
            if (result.success) {
              if (type === 'cash') {
                this.setState({ cashPaidNarration: '', cashAmount: 0 });
              }
              if (type === 'cheque') {
                this.setState({
                  chequeAmount: 0,
                  chequeDate: '',
                  chequeNo: '',
                  bankName: '',
                  branchName: ''
                });
              }
              if (type === 'eMoney') {
                this.setState({ eMoneyAmount: 0, eMoneyTransactonId: '' });
              }
            }
          }, 200);
        }
      );
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  payFullByEmoney = () => {
    const { paymentResponse, invoice } = this.props;
    const TotalAmount =
      parseFloat(invoice.__ORACO__TotalAmount_c) -
      (!isEmpty(paymentResponse)
        ? parseFloat(paymentResponse.__ORACO__Amount_c)
        : 0);
    let totalAmount = TotalAmount ? TotalAmount : 0;
    const TotalAmountPaid = roundAmount(totalAmount);
    this.setState({
      //TotalAmountPaid,
      cashAmount: 0,
      chequeAmount: 0,
      eMoneyAmount: parseFloat(TotalAmountPaid).toFixed(2)
    });
  };

  payFullByCash = () => {
    const { paymentResponse, invoice } = this.props;
    const TotalAmount =
      parseFloat(invoice.__ORACO__TotalAmount_c) -
      (!isEmpty(paymentResponse)
        ? parseFloat(paymentResponse.__ORACO__Amount_c)
        : 0);
    let totalAmount = TotalAmount ? TotalAmount : 0;
    const TotalAmountPaid = roundAmount(totalAmount);
    this.setState({
      //TotalAmountPaid,
      eMoneyAmount: 0,
      chequeAmount: 0,
      cashAmount: parseFloat(TotalAmountPaid).toFixed(2)
    });
  };

  payFullByCheque = () => {
    const { paymentResponse, invoice } = this.props;
    const TotalAmount =
      parseFloat(invoice.__ORACO__TotalAmount_c) -
      (!isEmpty(paymentResponse)
        ? parseFloat(paymentResponse.__ORACO__Amount_c)
        : 0);
    let totalAmount = TotalAmount ? TotalAmount : 0;
    const TotalAmountPaid = roundAmount(totalAmount);
    this.setState({
      //TotalAmountPaid,
      eMoneyAmount: 0,
      cashAmount: 0,
      chequeAmount: parseFloat(TotalAmountPaid).toFixed(2)
    });
  };

  chequeDateChangeHandler = date => {
    this.setState({ selectedDateForCheque: date });
  };

  eMoneyDateChangeHandler = date => {
    this.setState({ selectedDateForET: date });
  };

  goBack = () => {
    Alert.alert(
      '',
      'Payment is done successfully',
      [
        {
          text: 'OK',
          onPress: () => {
            const { navigation } = this.props;
            navigation.goBack();
          }
        }
      ],
      { cancelable: false }
    );
  };

  _renderChequePaymentMode = disableButtons => (
    <View style={styles.itemContainer}>
      <View style={styles.detailItemRow}>
        <Text style={styles.itemTextCode}>{labels.CHEQUE_DETAILS}</Text>
        <TouchableOpacity
          style={
            disableButtons ? styles.headerButtonDisable : styles.headerButton
          }
          onPress={this.payFullByCheque}
          disabled={disableButtons}
        >
          <Text style={styles.headerButtonText}> {labels.PAY_FULL}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailItemRow}>
        <View style={styles.detailItemColumn}>
          <Text style={styles.itemTextColumn}>{labels.CHEQUE_AMOUNT}:</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textValue}
            value={`${this.state.chequeAmount}`}
            onChangeText={text => this.handleAmountChange(text, 'ChequeAmount')}
          />
        </View>
        <View style={styles.blankView} />
        <View style={styles.detailItemColumn}>
          <Text style={styles.itemTextColumn}>{labels.CHEQUE_NO}:</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textValue}
            value={`${this.state.chequeNo}`}
            onChangeText={text => this.handleAmountChange(text, 'ChequeNo')}
          />
        </View>
        <View style={styles.blankView} />
        {/* <View style={styles.detailItemColumn}>
          <Text style={styles.itemTextColumn}>{labels.CHEQUE_DATE}:</Text>
          <View style={styles.datepickerComponentStyle}>
            <DateTimePicker
              mode="date"
              placeHolder="MM/DD/YYYY"
              isFormEditable
              onValueChange={this.chequeDateChangeHandler}
              value={this.state.selectedDateForCheque}
            />
          </View>
        </View> */}
      </View>
      <View style={styles.detailItemRow}>
        <View style={styles.detailItemColumn}>
          <Text style={styles.itemTextColumn}>{labels.BANK_NAME}:</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textValue}
            value={`${this.state.bankName}`}
            onChangeText={text => this.handleAmountChange(text, 'BankName')}
          />
        </View>
        <View style={styles.blankView} />
        <View style={styles.detailItemColumn}>
          <Text style={styles.itemTextColumn}>{labels.BRANCH_NAME}:</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textValue}
            value={`${this.state.branchName}`}
            onChangeText={text => this.handleAmountChange(text, 'BranchName')}
          />
        </View>
      </View>
    </View>
  );
  _renderEmoneyPaymentMode = disableButtons => (
    <View style={styles.itemContainer}>
      <View style={styles.detailItemRow}>
        <Text style={styles.itemTextCode}>{labels.E_MONEY_DETAILS}</Text>
        <TouchableOpacity
          style={
            disableButtons ? styles.headerButtonDisable : styles.headerButton
          }
          onPress={this.payFullByEmoney}
          disabled={disableButtons}
        >
          <Text style={styles.headerButtonText}> {labels.PAY_FULL}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailItemRow}>
        <View style={styles.detailItemColumn}>
          <Text style={styles.itemTextColumn}>{labels.AMOUNT}:</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textValue}
            value={`${this.state.eMoneyAmount}`}
            onChangeText={text => this.handleAmountChange(text, 'EmoneyAmount')}
          />
        </View>
        <View style={styles.blankView} />
        {/* <View style={styles.detailItemColumn}>
          <Text style={styles.itemTextColumn}>{labels.DATE}:</Text>
          <View style={styles.datepickerComponentStyle}>
            <DateTimePicker
              mode="date"
              placeHolder="MM/DD/YYYY"
              isFormEditable
              onValueChange={this.eMoneyDateChangeHandler}
              value={this.state.selectedDateForET}
            />
          </View>
        </View> */}
        <View style={styles.blankView} />
        <View style={styles.detailItemColumn}>
          <Text style={styles.itemTextColumn}>{labels.TRANSACTION_ID}:</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textValue}
            value={this.state.eMoneyTransactonId}
            onChangeText={text =>
              this.handleAmountChange(text, 'EmoneyTranscationId')
            }
          />
        </View>
      </View>
    </View>
  );
  _renderCashPaymentMode = disableButtons => (
    <View style={styles.itemContainer}>
      <View style={styles.detailItemRow}>
        <Text style={styles.itemTextCode}>{labels.CASH_PAYMENT}</Text>
        <TouchableOpacity
          style={
            disableButtons ? styles.headerButtonDisable : styles.headerButton
          }
          onPress={this.payFullByCash}
          disabled={disableButtons}
        >
          <Text style={styles.headerButtonText}> {labels.PAY_FULL}</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.detailItemRow}>
        <View style={[styles.detailItemColumn, { flex: 0.3 }]}>
          <Text style={styles.itemTextColumn}>{labels.AMOUNT}:</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textValue}
            value={`${this.state.cashAmount}`}
            onChangeText={text => this.handleAmountChange(text, 'CashAmount')}
          />
        </View>
        <View style={styles.blankView} />
        <View style={[styles.detailItemColumn, , { flex: 0.7 }]}>
          <Text style={styles.itemTextColumn}>{labels.REMARK}:</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textValue}
            value={this.state.cashPaidNarration}
            onChangeText={text =>
              this.handleAmountChange(text, 'CashNarration')
            }
          />
        </View>
      </View>
    </View>
  );
  _renderCreditNotesPaymentMode = creditNotes =>
    creditNotes ? (
      <View style={styles.creditNotesContainer}>
        <View style={styles.creditHeaderRow}>
          <Text style={styles.itemTextCode}>{labels.CREDIT_NOTES}</Text>
          <TouchableOpacity style={styles.headerButton} onPress={() => {}}>
            <Text style={styles.headerButtonText}> {labels.PAY_FULL}</Text>
          </TouchableOpacity>
        </View>
        <CreditNotesHeader />
        {creditNotes.map((notes, index) => (
          <CreditNotesRow {...notes} key={index} />
        ))}
      </View>
    ) : null;
  render() {
    const {
      invoice: { RecordName, __ORACO__TotalAmount_c, CurrencyCode },
      customer: { OrganizationName, PartyNumber },
      paymentResponse
    } = this.props;
    disableButtons =
      __ORACO__TotalAmount_c ==
        (!isEmpty(paymentResponse) && paymentResponse.__ORACO__Amount_c) ||
      __ORACO__TotalAmount_c == this.state.TotalAmountPaid;
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        enabled={Platform.OS === 'ios' ? true : false}
      >
        <Loader loading={this.state.loading} />
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.itemContainer}>
            <View style={styles.detailItem}>
              <View style={[styles.headerItemRow, { flex: 1 }]}>
                <Text style={styles.itemTextCode}>{PartyNumber}</Text>
                <Text style={styles.itemTextInvoice}>{OrganizationName}</Text>
              </View>
              <TouchableOpacity
                style={
                  disableButtons
                    ? styles.headerButtonDisable
                    : styles.headerButton
                }
                onPress={this.savePayment}
                disabled={disableButtons}
              >
                <Text style={styles.headerButtonIcon}></Text>
                <Text style={styles.headerButtonText}>
                  {labels.SAVE_PAYMENT}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.detailItemRow}>
              <View style={styles.detailItem}>
                <Text style={styles.itemText}>{labels.TOTAL_AMOUNT}: </Text>
                <Text style={styles.itemTextOther}>
                  {formatAmount(
                    parseFloat(__ORACO__TotalAmount_c),
                    CurrencyCode
                  )}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.itemText}>{labels.AMOUNT_PAID}: </Text>
                <Text style={styles.itemTextOther}>
                  {formatAmount(
                    parseFloat(
                      !isEmpty(paymentResponse)
                        ? paymentResponse.__ORACO__Amount_c
                        : this.state.TotalAmountPaid
                    ),
                    CurrencyCode
                  )}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.itemText}>{labels.INVOICE_NUMBER}: </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemTextOther}>{RecordName}</Text>
                </View>
              </View>
            </View>
            {/* <View style={styles.detailItemRow}>
            <View style={styles.detailItem}>
              <Text style={styles.itemText}>{labels.DUE_DATE}: </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTextOther}>{DueDate}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.itemText}>{labels.DUE_AMOUNT}: </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTextOther}>{DueAmount}</Text>
              </View>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.itemText}>{labels.CUSTOMER_TYPE}: </Text>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemTextOther}>
                  {labels.CUSTOMER_TYPE_VALUE}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.detailItemRow}>
            <Text style={styles.itemText}>{labels.PAYMENT_MODE}: </Text>
          </View> */}
          </View>
          {this._renderCashPaymentMode(disableButtons)}
          {this._renderChequePaymentMode(disableButtons)}
          {this._renderEmoneyPaymentMode(disableButtons)}
          {/* {this._renderCreditNotesPaymentMode(creditNotes)} */}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_THEME.APP_BACKGROUND_COLOR
  },

  headerItemRow: {
    flexDirection: 'column',
    marginBottom: 20
  },
  headerRow: {
    flexDirection: 'column',
    marginBottom: 10
  },
  detailItemRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10
  },
  creditHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10
  },
  detailItem: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 3,
    paddingRight: 3
  },
  detailItemColumn: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
    paddingRight: 5
  },
  iconStyle: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 14,
    lineHeight: 18,
    alignItems: 'center'
  },

  itemContainer: {
    marginTop: 20,
    marginBottom: 20,
    padding: 15,
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    backgroundColor: APP_THEME.APP_BASE_COLOR_WHITE,
    shadowColor: APP_THEME.APP_COLOR_DARK_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  creditNotesContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    backgroundColor: APP_THEME.APP_BASE_COLOR_WHITE,
    shadowColor: APP_THEME.APP_COLOR_DARK_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  itemTextCode: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    flex: 1,
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
  itemTextColumn: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    marginBottom: 5,
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
  itemTextDate: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_REGULAR,
    margin: 0,
    paddingLeft: 5,
    paddingRight: 5,

    fontSize: 14,
    lineHeight: 18
  },
  button: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 14,
    lineHeight: 18,
    height: 40
  },
  textValue: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    lineHeight: 19,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    fontFamily: APP_FONTS.FONT_REGULAR,
    borderWidth: 1,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    borderRadius: 2
  },
  headerButton: {
    flex: 0.4,
    maxWidth: 140,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    flexDirection: 'row'
  },
  headerButtonDisable: {
    flex: 0.4,
    maxWidth: 140,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    flexDirection: 'row',
    opacity: 0.7
  },
  headerButtonText: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    color: APP_THEME.APP_BASE_COLOR_WHITE
  },
  headerButtonIcon: {
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    marginRight: 5,
    color: APP_THEME.APP_BASE_COLOR_WHITE
  },
  blankView: {
    width: 15
  },
  datepickerComponentStyle: {
    height: 40,
    width: 150,
    flexDirection: 'row'
  }
});
