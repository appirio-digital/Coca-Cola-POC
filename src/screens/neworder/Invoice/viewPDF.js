import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import PDFView from 'react-native-view-pdf';
import { APP_FONTS, APP_THEME } from '../../../constants';
import isEmpty from 'lodash/isEmpty';

import RNPrint from 'react-native-print';
import {
  createNewFile,
  fetchObjectCollection,
  API_END_POINT,
  API_NAME_POC
} from '../../../services/omcClient';
import { getCurrentTimestampInGMT } from '../../../utility';
import Loader from '../../../components/common/Loader';
import { initPDF } from './invoicer';
export default class ViewPDF extends Component {
  state = {
    loading: false,
    pdf: null
  };
  printSummaryReports = async () => {
    const { pdf } = this.state;
    if (pdf && pdf.filePath) {
      await RNPrint.print({
        filePath: pdf.filePath
      });
    }
  };

  uploadReprt = async () => {
    try {
      const { pdf } = this.state;
      const {
        navigation: {
          state: { params }
        }
      } = this.props;

      if (pdf && pdf.filePath && params.order) {
        this.setState({ loading: true });

        const invoiceHeader = await fetchObjectCollection(
          API_NAME_POC,
          API_END_POINT.INVOICE_HEADER
        );
        const invoice = invoiceHeader.filter(
          item =>
            (item.CustomerOrder_Id_c &&
              item.CustomerOrder_Id_c === params.order.Id) ||
            item.__ORACO__AuxiliaryAttribute01_c == params.order.MobileUId_c
        );
        if (!isEmpty(invoice)) {
          const fileId = invoice[0].Id ? invoice[0].Id : invoice[0].MobileUId_c;

          const routeID = `/${
            API_END_POINT.INVOICE_HEADER
          }/${fileId}/UploadAttachment`;
          const respo = await createNewFile(
            `${getCurrentTimestampInGMT()}.pdf`,
            'application/pdf',
            pdf.filePath,
            API_NAME_POC,
            routeID
          );
        } else {
          this.setState({ loading: false });
        }
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  async componentDidMount() {
    const {
      navigation: {
        state: { params }
      },
      auth: { profile }
    } = this.props;

    if (params && params.order && params.account) {
      this.setState({ loading: true });
      try {
        const pdf = await initPDF(
          params.order,
          params.account,
          params.signature,
          profile
        );
        this.setState({ pdf: pdf, loading: false });
      } catch (error) {
        this.setState({ loading: false });
      }
    }
  }

  render() {
    const { pdf } = this.state;

    return (
      <View style={{ flex: 1 }}>
        <Loader loading={this.state.loading} />
        <View style={styles.containerStyle}>
          {/* <TouchableOpacity onPress={this.uploadReprt}> */}
          <TouchableOpacity onPress={() => {}}>
            <View style={styles.container2Style}>
              <Text style={styles.textStyle}></Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.printSummaryReports}>
            <View style={styles.container2Style}>
              <Text style={styles.textStyle}></Text>
            </View>
          </TouchableOpacity>
        </View>
        {pdf ? (
          <PDFView
            style={{ flex: 1 }}
            onError={error => console.log('onError', error)}
            onLoad={() => console.log('PDF rendered from file')}
            resource={pdf.base64}
            resourceType="base64"
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
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
});
