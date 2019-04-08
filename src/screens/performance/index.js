import React, { Component } from 'react'

import { formatDateMMDD } from '../../utility'
import Dashboard from './Dashboard'

export default class Performance extends Component {
  componentWillMount() {
    const {
      customersActions: {
        getActivity,
      },
      performance: {
        filterCriteria: {
          from,
          to
        }
      },
      performanceActions: {
        updateProductTypesSoldChart,
        updateOrdersExecutedChart,
      },
    } = this.props

    getActivity(formatDateMMDD(from), formatDateMMDD(to))
    updateProductTypesSoldChart()
    updateOrdersExecutedChart()
  }

  componentDidUpdate(prevProps) {
    const {
      customers,
      performanceActions: {
        updateCheckinCheckoutTimesChart,
        updateCasesPerHourChart,
      },
    } = this.props

    if (customers.activityList && customers.activityList !== prevProps.customers.activityList) {
      updateCheckinCheckoutTimesChart(customers.activityList)
      updateCasesPerHourChart(customers.activityList)
    }
  }

  render() {
    const {
      deviceInfo: {
        orientation
      },
      isDevicePortrait,
      orders,
      customers,
      customersActions,
      performance,
      performanceActions,
    } = this.props

    return (
      <Dashboard
        {...orders}
        {...customers}
        {...customersActions}
        {...performance}
        {...performanceActions}
        orientation={orientation}
        isDevicePortrait={isDevicePortrait}
      />
    )
  }
}
