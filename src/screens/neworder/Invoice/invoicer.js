import { renderInvoiceDocument } from '../../../services/renderPDF';
import { isEmpty } from 'lodash';
import { createPDF } from '../../../services/createPDF';
import { formatAmount, formatDateDDMMYYYY } from '../../../utility';
import {
  API_NAME_POC,
  API_END_POINT,
  fetchObjectCollection,
  API_TEMPLATE
} from '../../../services/omcClient';

let invoiceItems;
let invoice;
let accountData;
let orderData;
let sign;
let profileDetail;
let invoiceTemplate;

export const initPDF = async (order, account, signature, profile) => {
  //Loggedin market user information
  profileDetail = profile;
  //Render Signture Image in PDF.
  sign = signature;
  try {
    //Get Invoice Header
    const invoiceHeader = await fetchObjectCollection(
      API_NAME_POC,
      API_END_POINT.INVOICE_HEADER
    );
    //Get Invoice Line Items
    const invoiceLineItems = await fetchObjectCollection(
      API_NAME_POC,
      API_END_POINT.INVOICE_LINE
    );

    //Filter InvoiceLineItem based on Invoice header 'CustomerOrder_Id_c or MobileUId_c '
    invoice = invoiceHeader.filter(
      item =>
        (item.CustomerOrder_Id_c && item.CustomerOrder_Id_c === order.Id) ||
        item.__ORACO__AuxiliaryAttribute01_c == order.MobileUId_c
    );

    //Check If Invoice Not empty else will not generate Invoice PDF.
    if (!isEmpty(invoice)) {
      //Get Invoice Template
      invoiceTemplate = await fetchObjectCollection(
        API_TEMPLATE,
        API_END_POINT.INVOICE_TEMPLATE
      );
      //Filter Invoice line items based on InvoiceId.
      const invoiceId = invoice[0].Id;
      const uId = invoice[0].MobileUId_c;
      invoiceItems = invoiceLineItems.filter(
        lineItem =>
          (lineItem.__ORACO__Invoice_Id_c &&
            lineItem.__ORACO__Invoice_Id_c === invoiceId) ||
          lineItem.ParentMobileUId_c == uId
      );
    }
  } catch (error) {}

  //Current Order Customer detail and Order Information.
  accountData = account;
  orderData = order;

  const htmlContent = renderInvoiceHeaderData();

  return createPDF({
    html: renderInvoiceDocument(htmlContent),
    fileName: 'pdfFromHTML',
    directory: 'docs',
    base64: true
  });
};

//new
renderInvoiceHeaderData = () => {
  var headerHtml = invoiceTemplate[0].Invoice;
  //CustomerDetail
  headerHtml = headerHtml.replace(
    '#{CustomerName}',
    accountData.name.toUpperCase()
  );
  headerHtml = headerHtml.replace('#{CustomerSignName}', accountData.name);

  if (profileDetail.PrimaryCountry_c === 'CA') {
    headerHtml = headerHtml.replace(
      '#{CustomerAddress1}',
      accountData.address[0].addressid.toUpperCase() +
        accountData.address[0].street.toUpperCase()
    );
    headerHtml = headerHtml.replace(
      '#{CustomerAddress2}',
      `${accountData.address[0].city}, ${accountData.address[0].country}`
    );
    headerHtml = headerHtml.replace('#{CustomerCity}', '');
    headerHtml = headerHtml.replace('#{CustomerCountry}', '');
  } else {
    headerHtml = headerHtml.replace(
      '#{CustomerAddress1}',
      accountData.address[0].addressid.toUpperCase()
    );
    headerHtml = headerHtml.replace(
      '#{CustomerAddress2}',
      accountData.address[0].street.toUpperCase()
    );
    headerHtml = headerHtml.replace(
      '#{CustomerCity}',
      accountData.address[0].city
    );
    headerHtml = headerHtml.replace(
      '#{CustomerCountry}',
      accountData.address[0].country.toUpperCase()
    );
  }

  console.log('invoice', invoice);
  //Invoice Number and Date
  headerHtml = headerHtml.replace('#{InvoiceNumber}', '456757557');
  headerHtml = headerHtml.replace(
    '#{InvoiceDate}',
    formatDateDDMMYYYY(invoice[0].__ORACO__InvoiceDate_c)
  );

  //PRODUCT LIST AND TOTAL, SUBTOTAL, TAX , DISCOUNT TOTAL
  if (profileDetail.PrimaryCountry_c === 'CA') {
    headerHtml = headerHtml.replace('#{CustomerJTI_Id}', 'JTI_120000000');
    let invoiceTranslist = renderInvoiceTransactions();
    headerHtml = headerHtml.replace('#{invoiceProductlist}', invoiceTranslist);

    headerHtml = headerHtml.replace(
      '#{invoice_net_amount}',
      formatAmount(parseFloat(invoice[0].__ORACO__TotalAmount_c), '')
    );

    //TAX AMOUNT
    headerHtml = headerHtml.replace(
      '#{taxAmount}',
      formatAmount(parseFloat(orderData.TaxAmount_c), '')
    );
  } else {
    let invoiceTranslist = renderInvoiceTransactions();
    headerHtml = headerHtml.replace('#{invoiceProductlist}', invoiceTranslist);
    //NET AMOUNT

    headerHtml = headerHtml.replace(
      '#{invoice_net_amount}',
      formatAmount(parseFloat(invoice[0].__ORACO__SubtotalAmount_c), '')
    );

    //TAX AMOUNT
    headerHtml = headerHtml.replace(
      '#{taxAmount}',
      formatAmount(parseFloat(orderData.TaxAmount_c), '')
    );
  }

  headerHtml = headerHtml.replace(
    '#{netAmount}',
    formatAmount(parseFloat(invoice[0].__ORACO__SubtotalAmount_c), '')
  );
  //DISCOUNT AMOUNT
  headerHtml = headerHtml.replace(
    '#{discountAmount}',
    formatAmount(parseFloat(invoice[0].__ORACO__Discount_c), '')
  );
  //TOTAL AMOUNT
  headerHtml = headerHtml.replace(
    '#{totalAmount}',
    parseFloat(invoice[0].__ORACO__TotalAmount_c)
  );

  //SIGNATURE
  headerHtml = headerHtml.replace('#{sign}', sign);
  return headerHtml;
};

renderInvoiceTransactions = () => {
  var orderlist = '';
  for (let index in invoiceItems) {
    var tempInvoiceTrans = invoiceTemplate[0].Trans;

    tempInvoiceTrans = tempInvoiceTrans.replace(
      '#{order_description}',
      invoiceItems[index].__ORACO__Product_c
    );
    tempInvoiceTrans = tempInvoiceTrans.replace(
      '#{order_quantity}',
      invoiceItems[index].__ORACO__Quantity_c
    );
    tempInvoiceTrans = tempInvoiceTrans.replace(
      '#{order_unit_price}',
      invoiceItems[index].__ORACO__Price_c
    );
    tempInvoiceTrans = tempInvoiceTrans.replace(
      '#{order_PTT_unit}',
      invoiceItems[index].__ORACO__Price_c
    );
    tempInvoiceTrans = tempInvoiceTrans.replace(
      '#{order_amount}',
      invoiceItems[index].__ORACO__Quantity_c *
        invoiceItems[index].__ORACO__Price_c
    );
    orderlist += tempInvoiceTrans;
  }
  return orderlist;
};
