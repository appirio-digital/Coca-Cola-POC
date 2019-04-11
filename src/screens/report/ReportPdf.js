import React, { Component } from 'react';

import {
  Text,
  WebView,
  View,
  TouchableOpacity,
  NativeModules
} from 'react-native';
import { formatDateDDMMYYYY } from '../../utility';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNPrint from 'react-native-print';
import {
  getPaymentMode,
  getCurrentTimestampInGMT,
  roundAmount
} from '../../utility';

import { APP_FONTS, APP_THEME } from '../../constants';
import { labels } from '../../stringConstants';
import {
  fetchObjectCollection,
  createNewFile,
  API_NAME,
  API_TEMPLATE,
  API_END_POINT
} from '../../services/omcClient';
import { isEmpty } from 'lodash';
import Loader from '../../components/common/Loader';

let reportTemplate;

export default class ReportPdf extends Component {
  state = {
    reportContent: '',
    loading: false,
    routeID: null
  };

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      reportTemplate = await fetchObjectCollection(
        API_TEMPLATE,
        API_END_POINT.INVOICE_TEMPLATE
      );

      const routeAllocation = await fetchObjectCollection(
        API_NAME,
        API_END_POINT.ROUTE_ALLOCATION
      );

      if (!isEmpty(routeAllocation)) {
        this.setState({ routeID: routeAllocation[0].__ORACO__Route_Id_c });
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
    this.renderSummryReport();
  }

  renderSummryReport = () => {
    const {
      auth: { profile }
    } = this.props;

    let currenyCode = profile.Currency == 'CAD' ? '&#36' : '&#8364';

    const {
      paymentslist,
      summaryList,
      date
    } = this.props.navigation.state.params;
    //Fetch report header and footer
    var reportHeaderFooterTemplate = reportTemplate[0].DayEndReport;
    var reportTransTemplate = reportTemplate[0].DayEndReportTransHeader;

    reportHeaderFooterTemplate = reportHeaderFooterTemplate.replace(
      '#{report_title}',
      labels.REPORT_SUMMARY
    );
    reportHeaderFooterTemplate = reportHeaderFooterTemplate.replace(
      '#{date}',
      formatDateDDMMYYYY(date)
    );

    //Report Transaction
    var transTabelTemplate = '';
    summaryList.map(p => {
      var transTemplate = reportTransTemplate;
      var filteredPayments = paymentslist[p.key];

      if (filteredPayments.length > 0) {
        transTemplate = transTemplate.replace(
          '#{payment_mode}',
          getPaymentMode(p.key)
        );
        transTemplate = transTemplate.replace(
          '#{total_amount}',
          `Total: ${currenyCode} ${roundAmount(p.value)}`
        );

        var transactionList = '';
        filteredPayments.map(listObj => {
          var transDataTemplate = reportTemplate[0].DayEndReportTrans;
          const {
            __ORACO__Amount_c,
            __ORACO__Account_c,
            __ORACO__PayToInvoice_c
          } = listObj;
          transDataTemplate = transDataTemplate.replace(
            '#{invoice_number}',
            __ORACO__PayToInvoice_c
          );
          transDataTemplate = transDataTemplate.replace(
            '#{customer_name}',
            __ORACO__Account_c
          );
          transDataTemplate = transDataTemplate.replace(
            '#{invoice_amount}',
            `${currenyCode} ${roundAmount(__ORACO__Amount_c)}`
          );
          transactionList += transDataTemplate;
        });

        transTemplate = transTemplate.replace(
          ' #{transactions}',
          transactionList
        );
        transTabelTemplate += transTemplate;
      }
    });

    reportHeaderFooterTemplate = reportHeaderFooterTemplate.replace(
      '#{report_transaction_list}',
      transTabelTemplate
    );
    this.setState({ reportContent: reportHeaderFooterTemplate });
  };

  onGenerateReport = async () => {
    let options = {
      html: this.state.reportContent,
      fileName: 'Daily-Summary-Report',
      directory: 'docs'
    };

    try {
      this.setState({ loading: true });
      let file = await RNHTMLtoPDF.convert(options);

      if (file.filePath) {
        const routeID = `/ORACO__Route_c/${this.state.routeID}/Attachment`;
        const respo = await createNewFile(
          `${getCurrentTimestampInGMT()}.pdf`,
          'application/pdf',
          file.filePath,
          API_NAME,
          routeID
        );
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  printSummaryReports = async () => {
    await RNPrint.print({
      html: this.state.reportContent
    });
  };

  render() {
    const { containerStyle, container2Style, textStyle } = Styles;
    return (
      <View style={{ flex: 1, backgroundColor: '#F8F8F8' }}>
        <Loader loading={this.state.loading} />
        <View style={containerStyle}>
          {/* <TouchableOpacity onPress={() => this.onGenerateReport()}> */}
          <TouchableOpacity onPress={() => {}}>
            <View style={container2Style}>
              <Text style={textStyle}></Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.printSummaryReports}>
            <View style={container2Style}>
              <Text style={textStyle}></Text>
            </View>
          </TouchableOpacity>
        </View>
        {
          <WebView
            style={{ margin: 10 }}
            source={{
              html: this.state.reportContent
            }}
          />
        }
      </View>
    );
  }
}

const Styles = {
  containerStyle: {
    height: 60,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 20,
    backgroundColor: '#fff',
    padding: 20,
    flexDirection: 'row'
  },
  container2Style: {
    width: 38,
    height: 38,
    borderRadius: 38 / 2,
    borderColor: APP_THEME.APP_BASE_COLOR,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 7
  },
  textStyle: {
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    color: APP_THEME.APP_BASE_COLOR,
    fontSize: 20
  }
};
