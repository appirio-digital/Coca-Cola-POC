import React, {
  Component,
} from 'react'
import { subscribe } from 'redux-subscriber'
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import Dropdown from 'react-native-modal-dropdown'
import moment from 'moment'

import DateFilter from '../../../components/DateFilter'
import { formatDateMMDD } from '../../../utility'

import { labels } from '../../../stringConstants'
import {
  APP_THEME,
  PERFORMANCE_DATE_FILTER_ALLOWED_MONTHS_RANGE,
} from '../../../constants'
import styles from './style'

const onMTDDropdownSelect = (index, callback) => {
  const startDate = moment([moment().year(), index]).toDate()
  const endDate = moment(startDate).endOf('month').toDate()

  return callback(startDate, endDate, labels.MTD, index)
}

const onQTYDropdownSelect = (index, callback) => {
  const indexInt = parseInt(index, 10) + 1
  const startDate = moment().quarter(indexInt).startOf('quarter').toDate()
  const endDate = moment().quarter(indexInt).endOf('quarter').toDate()

  return callback(startDate, endDate, labels.QTY, index)
}

class FilterHeader extends Component {
  monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

  quarterLabels = ['Q1', 'Q2', 'Q3', 'Q4']

  today = moment().endOf('day').toDate()

  mtdDropdown = null

  qtyDropdown = null

  reduxSubscriber = null

  state = {
    dateFilterMax: this.today,
  }

  componentDidMount() {
    this.onFilterChange(this.props.filterCriteria)
    this.reduxSubscriber = subscribe('performance.filterCriteria', state => this.onFilterChange(state.performance.filterCriteria))
  }

  componentWillUnmount() {
    // Unsubscribe to redux
    // subscribe() returns the unsubscribe function
    // Weird but simple syntax
    this.reduxSubscriber()
  }

  onFilterChange = (filterCriteria) => {
    if (filterCriteria.filter.type) {
      switch (filterCriteria.filter.type) {
        case labels.TODAY:
          this.mtdDropdown.select(-1)
          this.qtyDropdown.select(-1)
          break

        case labels.MTD:
          this.mtdDropdown.select(filterCriteria.filter.value)
          this.qtyDropdown.select(-1)
          break

        case labels.QTY:
          this.qtyDropdown.select(filterCriteria.filter.value)
          this.mtdDropdown.select(-1)
          break

        case labels.CALENDAR:
          this.qtyDropdown.select(-1)
          this.mtdDropdown.select(-1)
          break

        default:
          break
      }
    }
  }

  onTodayPressed = () => {
    if (this.qtyDropdown) {
      this.qtyDropdown.select(-1)
    }

    if (this.mtdDropdown) {
      this.mtdDropdown.select(-1)
    }

    this.props.setFilterCriteria({
      from: moment().startOf('day').toDate(),
      to: moment().endOf('day').toDate(),
      filter: {
        type: labels.TODAY,
        value: null,
      },
    })
  }

  filterDatesWithRange = (startDate, endDate, type, index) => {
    if (startDate < this.today) {
      this.props.setFilterCriteria({
        from: startDate,
        to: endDate < this.today ? endDate : this.today,
        filter: {
          type,
          value: index,
        },
      })
      return true
    } else {
      return false
    }
  }

  onFromDateSelect = (date) => {
    const { to } = this.props.filterCriteria
    const fromDate = moment(date, this.fromDateFormat).startOf('day').toDate()
    let maximumToDate = moment(fromDate)
      .add(PERFORMANCE_DATE_FILTER_ALLOWED_MONTHS_RANGE, 'months')
      .endOf('day')
      .toDate()
    let toDate

    if (maximumToDate > this.today) {
      maximumToDate = this.today
    }

    if (to < fromDate) {
      toDate = moment(fromDate).endOf('day').toDate()
    } else if (to > maximumToDate) {
      toDate = maximumToDate
    } else {
      toDate = to
    }

    this.props.setFilterCriteria({
      from: fromDate,
      to: toDate,
      filter: {
        type: labels.CALENDAR,
        value: null,
      },
    })

    this.setState({ dateFilterMax: maximumToDate })
  }

  onToDateSelect = (date) => {
    this.props.setFilterCriteria({
      ...this.props.filterCriteria,
      to: moment(date, this.toDateFormat).toDate(),
      filter: {
        type: labels.CALENDAR,
        value: null,
      },
    })
  }

  onApplyPressed = () => {
    const {
      filterCriteria: {
        from,
        to,
      },
      getActivity,
      updateProductTypesSoldChart,
      updateOrdersExecutedChart,
    } = this.props

    getActivity(formatDateMMDD(from), formatDateMMDD(to))
    updateProductTypesSoldChart()
    updateOrdersExecutedChart()
  }

  bindMtdDropdownRef = (ref) => {
    this.mtdDropdown = ref
  }

  bindQtyDropdownRef = (ref) => {
    this.qtyDropdown = ref
  }

  render() {
    const {
      filterCriteria,
      orientation,
      loading,
      isOrdersExecutedChartLoading,
      isProductsSoldChartLoading,
     } = this.props
    const { dateFilterMax } = this.state
    const areChartsLoading = loading && isOrdersExecutedChartLoading && isProductsSoldChartLoading
    
    return (
      <View style={styles.container}>
        <View style={[
          styles.content,
          orientation === 'Portrait'
            ? styles.contentPortraitWidth
            : styles.contentLandscapeWidth,
        ]}
        >
          <TouchableOpacity onPress={this.onTodayPressed}>
            <View style={[styles.baseButton, styles.todayButton]}>
              <Text style={styles.baseButtonText}>{labels.TODAY}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.mtdDropdown.show()}>
            <View style={[
              styles.baseButton,
              styles.dropdownContainer,
            ]}>
              <Dropdown
                ref={this.bindMtdDropdownRef}
                options={this.monthLabels}
                defaultValue={labels.MTD}
                showsVerticalScrollIndicator={false}
                textStyle={[
                  styles.baseButtonText,
                  styles.filterButtonText,
                ]}
                dropdownStyle={[styles.baseButton, styles.dropdown]}
                dropdownTextStyle={[styles.baseButtonText, styles.dropdownItemText]}
                dropdownTextHighlightStyle={styles.dropdownItemHighlight}
                onSelect={index => onMTDDropdownSelect(index, this.filterDatesWithRange)}
              />
              <Text style={styles.dropdownIcon}>
                
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => this.qtyDropdown.show()}>
            <View style={[
              styles.baseButton,
              styles.dropdownContainer,
            ]}>
              <Dropdown
                ref={this.bindQtyDropdownRef}
                options={this.quarterLabels}
                defaultValue={labels.QTY}
                showsVerticalScrollIndicator={false}
                textStyle={[
                  styles.baseButtonText,
                  styles.filterButtonText,
                ]}
                dropdownStyle={[
                  styles.baseButton,
                  styles.dropdown,
                  styles.dropdownQty,
                ]}
                dropdownTextStyle={[
                  styles.baseButtonText,
                  styles.dropdownItemText,
                  styles.dropdownItemTextQty,
                ]}
                dropdownTextHighlightStyle={styles.dropdownItemHighlight}
                onSelect={index => onQTYDropdownSelect(index, this.filterDatesWithRange)}
              />
              <Text style={styles.dropdownIcon}>
                
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.dateFilterContainer}>
            <DateFilter
              valueFrom={filterCriteria.from}
              valueTo={filterCriteria.to}
              maximumFrom={this.today}
              minimumTo={filterCriteria.from}
              maximumTo={dateFilterMax}
              onFromValueChange={this.onFromDateSelect}
              onToValueChange={this.onToDateSelect}
            />
          </View>

          <TouchableOpacity
            onPress={this.onApplyPressed}
            disabled={areChartsLoading}
            style={styles.floatRight}
          >
            <View style={[styles.baseButton, styles.applyButton]}>
              {
                areChartsLoading
                  ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator
                        animating={areChartsLoading}
                        hidesWhenStopped
                        color={APP_THEME.APP_BASE_COLOR_WHITE}
                      />
                    </View>
                  )
                  : (
                    <Text style={[styles.baseButtonText, styles.applyButtonText]}>Apply</Text>
                  )
              }
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default FilterHeader
