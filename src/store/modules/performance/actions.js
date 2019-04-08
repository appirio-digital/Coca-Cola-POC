import moment from 'moment';
import {
  UPDATE_FILTERED_CHARTS_DATA,
  UPDATE_CURRENT_CHART,
  UPDATE_FILTER_CRITERIA,
  UPDATE_ORDERS_EXECUTED_CHART_LOADING,
  UPDATE_PRODUCTS_SOLD_CHART_LOADING
} from './types';
import {
  fetchObjectCollection,
  API_END_POINT,
  API_NAME_POC,
  API_JTI_CUSTOMER_API
} from '../../../services/omcClient';
import { labels } from '../../../stringConstants';
import { UTC_TIME_FORMAT } from '../../../utility';
import JSONfn from 'json-fn';

export const updateCheckinCheckoutTimesChart = activities => (
  dispatch,
  getState
) => {
  if (!activities) {
    return;
  }

  const newData = [];
  activities.forEach(activity => {
    if (activity.checkintime && activity.checkouttime) {
      newData.push({
        x: activity.name,
        y: parseFloat(
          moment
            .duration(
              moment(activity.checkouttime, UTC_TIME_FORMAT).diff(
                moment(activity.checkintime, UTC_TIME_FORMAT)
              )
            )
            .asHours()
            .toFixed(2),
          10
        )
      });
    }
  });

  updateChartData(
    dispatch,
    getState,
    labels.CHECKIN_CHECKOUT_TIMES,
    labels.HISTOGRAM,
    newData,
    { yAxisLabel: '# of orders' }
  );
};

export const updateProductTypesSoldChart = () => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_PRODUCTS_SOLD_CHART_LOADING,
    payload: true
  });

  const {
    filterCriteria: { from, to }
  } = getState().performance;
  // TODO: to be removed after the getAllOrders() is done
  const pureOrderObjs = await fetchObjectCollection(
    API_NAME_POC,
    API_END_POINT.CUSTOMER_ORDER
  );
  const orderItems = await fetchObjectCollection(
    API_NAME_POC,
    API_END_POINT.ORDER_LINE_ITEM
  );
  const orders = pureOrderObjs.map(order => ({
    ...order,
    items: orderItems.filter(
      item =>
        item.Order_Id_c === order.Id ||
        item.ParentMobileUId_c === order.MobileUId_c
    )
  }));

  const newData = orders.reduce((result, order) => {
    const orderDate = moment(order.OrderDate_c, 'YYYY-MM-DD').toDate();

    if (
      orderDate >= from &&
      orderDate <= to &&
      order.OrderStatus_c === 'ORA_ACO_ORDER_STATUS_DELIVERED'
    ) {
      order.items.map(item => {
        if (result[item.Product_c]) {
          result[item.Product_c] += item.Quantity_c;
        } else {
          result[item.Product_c] = item.Quantity_c;
        }
        return item;
      });
    }

    return result;
  }, {});

  updateChartData(
    dispatch,
    getState,
    labels.PRODUCT_TYPES_SOLD,
    labels.PIE_CHART,
    newData
  );

  dispatch({
    type: UPDATE_PRODUCTS_SOLD_CHART_LOADING,
    payload: false
  });
};

export const updateOrdersExecutedChart = () => async (dispatch, getState) => {
  dispatch({
    type: UPDATE_ORDERS_EXECUTED_CHART_LOADING,
    payload: true
  });
  const {
    filterCriteria: { from, to }
  } = getState().performance;
  // TODO: to be removed after the getAllOrders() is done
  const orders = await fetchObjectCollection(
    API_NAME_POC,
    API_END_POINT.CUSTOMER_ORDER
  );

  const customers = await fetchObjectCollection(
    API_JTI_CUSTOMER_API,
    API_END_POINT.CUSTOMERS
  );

  const newData = orders.reduce((result, order) => {
    const orderDate = moment(order.OrderDate_c, 'YYYY-MM-DD').toDate();

    if (orderDate >= from && orderDate <= to) {
      const customer = customers.filter(obj => obj.id == order.Account_Id_c);

      if (customer.length > 0) {
        const storeName = customer[0].name;
        incrementValueOfKeyInResult(result, storeName);
      } else {
      }
    }

    return result;
  }, {});
  console.log('nwe data vaue ', newData);
  updateChartData(
    dispatch,
    getState,
    labels.ORDERS_EXECUTED,
    labels.BAR_CHART_VERTICAL,
    newData,
    { yAxisLabel: '# of orders' }
  );

  dispatch({
    type: UPDATE_ORDERS_EXECUTED_CHART_LOADING,
    payload: false
  });
};

export const updateCasesPerHourChart = activities => (dispatch, getState) => {
  const { from, to } = getState().performance.filterCriteria;
  const rangeInWeeks = moment.duration(moment(to).diff(from)).asWeeks();

  const newData = activities.reduce((result, item) => {
    if (rangeInWeeks > 6) {
      // months
      const month = moment(item.ActivityStartDate).format('MMMM, YYYY');
      incrementValueOfKeyInResult(result, month);
    } else if (rangeInWeeks < 6 && rangeInWeeks > 1) {
      // weeks
      const week = moment(item.ActivityStartDate)
        .startOf('week')
        .format('[Week of ] MM/DD');
      incrementValueOfKeyInResult(result, week);
    } else {
      const date = moment(item.ActivityStartDate).format('DD/MM/YYYY');
      incrementValueOfKeyInResult(result, date);
    }
    return result;
  }, {});

  const formattedData = Object.keys(newData).map(date => ({
    x: date,
    y: newData[date]
  }));

  updateChartData(
    dispatch,
    getState,
    labels.CASES_PER_HOUR,
    labels.BAR_CHART_HORIZONTAL,
    formattedData
  );
};

const updateChartData = (dispatch, getState, title, type, data, options) => {
  const { filteredCharts, selectedChart } = getState().performance;
  const chart = filteredCharts.find(oldChart => oldChart.title === title);

  if (chart) {
    const chartIndex = filteredCharts.indexOf(chart);
    chart.data = data;
    filteredCharts[chartIndex] = chart;
  } else {
    filteredCharts.push({ title, type, data, options });
  }

  dispatch({
    type: UPDATE_FILTERED_CHARTS_DATA,
    payload: [...filteredCharts]
  });

  if (
    selectedChart &&
    selectedChart.title === chart.title &&
    selectedChart.type === chart.type
  ) {
    dispatch({
      type: UPDATE_CURRENT_CHART,
      payload: chart
    });
  }
};

const incrementValueOfKeyInResult = (result, key) => {
  if (result[key]) {
    result[key]++;
  } else {
    result[key] = 1;
  }
};

export const setSelectedChart = payload => ({
  type: UPDATE_CURRENT_CHART,
  payload
});

export const setFilterCriteria = payload => ({
  type: UPDATE_FILTER_CRITERIA,
  payload
});
