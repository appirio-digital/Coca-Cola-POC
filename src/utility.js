import moment from 'moment';
import { labels } from './stringConstants';

const DATE_FORMAT = 'MMM DD, YYYY';
const DATE_FORMAT_API = 'YYYY-MM-DD';
const DATE_FORMAT_MM_DD = 'MM/DD/YYYY';
const DATE_FORMAT_DD_MM = 'DD/MM/YYYY';
const DATE_FORMAT_DD_MM_YYYY = 'DD-MM-YYYY';
const DATE_FORMAT_WITH_TIME = 'MMM DD YYYY, hh:mm a';
export const UTC_TIME_FORMAT = 'YYYY-MM-DDThh:mm';
//YYYY-MM-DDTHH:MI:SS.sss+hh:mm.

export const isDateValid = date => {
  return moment(date).isValid();
};
export const formatDate = date => {
  return moment(date).format(DATE_FORMAT);
};

export const formatApiDate = date => {
  return moment(date).format(DATE_FORMAT_API);
};

export const formatDateMMDD = date => {
  return moment(date).format(DATE_FORMAT_MM_DD);
};
//New Date Format
export const formatDateDDMM = date => {
  return moment(date).format(DATE_FORMAT_DD_MM);
};
export const formatDateDDMMYYYY = date => {
  return moment(date).format(DATE_FORMAT_DD_MM_YYYY);
};
export const formatDateWithTime = date => {
  return moment(date).format(DATE_FORMAT_WITH_TIME);
};

export const isAfter = (startDate, endDate) => {
  return (
    moment(endDate).isSame(startDate) || moment(endDate).isAfter(startDate)
  );
};

export const randomString = len => {
  const p = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return [...Array(len)].reduce(a => a + p[~~(Math.random() * p.length)], '');
};

export const formatAmount = (amount, CurrencyCode) => {
  return CurrencyCode.length > 0
    ? `${CurrencyCode}${' '}${amount.toFixed(2)}`
    : `${amount.toFixed(2)}`;
};

export const roundAmount = amount => {
  const objAmount = Number.isNaN(amount) ? 0 : parseFloat(amount);
  return `${objAmount.toFixed(2)}`;
};

export const isBefore = (startDate, endDate) => {
  return (
    moment(endDate).isBefore(startDate) || moment(endDate).isSame(startDate)
  );
};

export const getToDateForRegion = noOfdays => {
  return moment(
    new Date(new Date().getTime() + noOfdays * 24 * 60 * 60 * 1000)
  ).format(DATE_FORMAT_MM_DD);
};

export const getCurrentTimeInGMT = () => moment.utc().format(UTC_TIME_FORMAT);

export const getCurrentTimestampInGMT = () => moment.utc().format('X');

export const getCurrentDateInGMT = () => moment.utc().format(DATE_FORMAT_API);

export const getOrderStatus = status => {
  switch (status) {
    case 'ORA_ACO_ORDER_STATUS_BOOKED':
      return labels.ORDER_BOOKED;
    case 'ORA_ACO_ORDER_STATUS_BOOKREJ':
      return 'Booking rejected';
    case 'ORA_ACO_ORDER_STATUS_CANCELED':
      return 'Canceled';
    case 'ORA_ACO_ORDER_STATUS_CANCELREJ':
      return 'Cancellation rejected';
    case 'ORA_ACO_ORDER_STATUS_CANCELREQ':
      return 'Cancellation requested';
    case 'ORA_ACO_ORDER_STATUS_DELIVERED':
      return labels.ORDER_DELIVERED;
    case 'ORA_ACO_ORDER_STATUS_ERROR':
      return 'Error';
    case 'ORA_ACO_ORDER_STATUS_ONHOLD':
      return 'Overdue';
    case 'ORA_ACO_ORDER_STATUS_OPEN':
      return 'Open';
    case 'ORA_ACO_ORDER_STATUS_PARTIAL':
      return 'Partially delivered';
    case 'ORA_ACO_ORDER_STATUS_SUBMITTED':
      return labels.ORDER_SUBMITTED;
    case 'ORA_ACO_ORDER_STATUS_UPDATED':
      return 'Updated';
    case 'ORA_ACO_ORDER_STATUS_UPDATEREJ':
      return 'Update rejected';
    case 'ORA_ACO_ORDER_STATUS_UPDATEREQ':
      return 'Update requested';
    default:
      return 'No Status';
  }
};

export const getPaymentMode = mode => {
  switch (mode) {
    case 'ORA_ACO_PAYMENT_TYPE_CASH':
      return labels.CASH;
    case 'ORA_ACO_PAYMENT_TYPE_CHECK':
      return labels.CHEQUE;
    case 'ORA_ACO_PAYMENT_TYPE_ET':
      return labels.E_MONEY;
    default:
      return 'Cash';
  }
};

export const PaymentModes = {
  cash: 'ORA_ACO_PAYMENT_TYPE_CASH',
  cheque: 'ORA_ACO_PAYMENT_TYPE_CHECK',
  ePayment: 'ORA_ACO_PAYMENT_TYPE_ET'
};

export const ACTIVITY_STATUS_CODE = {
  Canceled: 'CANCELED',
  Complete: 'COMPLETE',
  InProgress: 'IN_PROGRESS',
  NotStarted: 'NOT_STARTED',
  OnHold: 'ON_HOLD',
  WaitingOnSomeoneElse: 'WAITING',
  Approved: 'APPROVED',
  Rejected: 'REJECTED'
};

export const getActivityCodeString = mode => {
  switch (mode) {
    case 'CANCELED':
      return labels.CANCEL;
    case 'COMPLETE':
      return labels.COMPLETE;
    case 'IN_PROGRESS':
      return labels.IN_PROGRESS;
    case 'NOT_STARTED':
      return labels.NOT_STARTED;
    case 'ON_HOLD':
      return labels.ON_HOLD;
    case 'WAITING':
      return labels.WAITING;
    case 'APPROVED':
      return labels.APPROVED;
    case 'REJECTED':
      return labels.REJECTED;
    default:
      return labels.NOT_STARTED;
  }
};

export const getRouteInvTransCode = status => {
  switch (status) {
    case 'Damage':
      return 'ORA_ACO_INVTRANS_DAMAGE';
    case 'Delivery':
      return 'ORA_ACO_INVTRANS_DELIVERY';
    case 'Loss':
      return 'ORA_ACO_INVTRANS_LOSS';
    case 'Recovery':
      return 'ORA_ACO_INVTRANS_RECOVERY';
    case 'Restock for additional inventory':
      return 'ORA_ACO_INVTRANS_RESTOCK_ADD';
    case 'Restock for shipment':
      return 'ORA_ACO_INVTRANS_RESTOCK_SHIP';
    case 'Return':
      return 'ORA_ACO_INVTRANS_RETURN';
    case 'Transfer in':
      return 'ORA_ACO_INVTRANS_TRANSFER_IN';
    case 'Transfer out':
      return 'ORA_ACO_INVTRANS_TRANSFER_OUT';
    case 'Unload':
      return 'ORA_ACO_INVTRANS_UNLOAD';
    case 'Damaged':
      return 'ORA_ACO_RETURN_REASON_DAMAGE';
    case 'Not needed':
      return 'ORA_ACO_RETURN_REASON_NO_NEED';
    case 'Other':
      return 'ORA_ACO_RETURN_REASON_OTHER';
    case 'Unhappy with service':
      return 'ORA_ACO_RETURN_REASON_SERVICE';

    default:
      break;
  }
};

export const getRandomColor = () => {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};
