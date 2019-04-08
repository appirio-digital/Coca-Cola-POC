import React, { Component } from 'react';
import { View, TouchableOpacity, Text, ScrollView } from 'react-native';

import FilterHeader from '../FilterHeader';
import BarChartVertical from '../charts/BarChartVertical';
import BarChartHorizontal from '../charts/BarChartHorizontal';
import Histogram from '../charts/Histogram';
import PieChart from '../charts/PieChart';

import { labels } from '../../../stringConstants';
import styles from './style';
import Applet from '../Applet';
import { getRandomColor } from '../../../utility';

export default class ChartDetails extends Component {
  shouldComponentUpdate(nextProps) {
    const {
      customers: { loading },
      performance: {
        selectedChart,
        filterCriteria,
        isOrdersExecutedChartLoading,
        isProductsSoldChartLoading
      },
      navigation: {
        state: {
          params: { color }
        }
      }
    } = this.props;

    return (
      selectedChart !== nextProps.performance.selectedChart ||
      filterCriteria !== nextProps.performance.filterCriteria ||
      isOrdersExecutedChartLoading !==
        nextProps.performance.isOrdersExecutedChartLoading ||
      isProductsSoldChartLoading !==
        nextProps.performance.isProductsSoldChartLoading ||
      loading !== nextProps.customers.loading ||
      color !== nextProps.navigation.state.params.color
    );
  }

  generateRandomColor = () => {
    const { data } = this.props;

    const colorCode = [];
    if (data) {
      const keys = Object.keys(data);
      keys.map(key => {
        colorCode.push(getRandomColor());
      });
    }

    return colorCode;
  };

  deeplinkToSynopsisBI = () => {};

  renderChart() {
    const { title, type, data, options } = this.props.performance.selectedChart;
    let chart = null;

    const { color } = this.props.navigation.state.params;

    switch (type) {
      case labels.BAR_CHART_VERTICAL:
        chart = (
          <BarChartVertical
            {...this.props}
            title={title}
            data={data}
            color={color}
            options={options}
            large
          />
        );
        break;

      case labels.BAR_CHART_HORIZONTAL:
        chart = (
          <BarChartHorizontal
            {...this.props}
            title={title}
            data={data}
            options={options}
            large
          />
        );
        break;

      case labels.HISTOGRAM:
        chart = (
          <Histogram
            {...this.props}
            title={title}
            data={data}
            options={options}
            large
          />
        );
        break;

      case labels.PIE_CHART:
        chart = (
          <PieChart
            {...this.props}
            title={title}
            data={data}
            options={options}
            large
          />
        );
        break;

      default:
        break;
    }

    return chart;
  }

  render() {
    const {
      deviceInfo: { orientation },
      isDevicePortrait,
      orders,
      customers,
      customersActions,
      performance,
      performanceActions
    } = this.props;

    return (
      <View style={styles.container}>
        <FilterHeader
          {...orders}
          {...customers}
          {...customersActions}
          {...performance}
          {...performanceActions}
          orientation={orientation}
          isDevicePortrait={isDevicePortrait}
        />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.contentWrapper}>
            <View style={styles.deeplinkButtonContainer}>
              <TouchableOpacity onPress={this.deeplinkToSynopsisBI}>
                <View style={styles.deeplinkButton}>
                  <Text style={styles.deeplinkButtonText}>Synopsis BI</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.chartContainer}>{this.renderChart()}</View>
          </View>
        </ScrollView>
      </View>
    );
  }
}
