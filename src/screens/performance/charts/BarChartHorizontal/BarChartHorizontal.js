import React, { Component } from 'react';
import { View } from 'react-native';
import {
  VictoryChart,
  VictoryBar,
  VictoryLabel,
  VictoryAxis
} from 'victory-native';

import chartConfigs from './chart.config';
import styles from './style';

export default class BarChartHorizontal extends Component {
  shouldComponentUpdate(nextProps) {
    const { data, large, orientation } = this.props;

    return (
      data !== nextProps.data ||
      large !== nextProps.large ||
      orientation !== nextProps.orientation
    );
  }

  render() {
    const { title, data, large, isDevicePortrait } = this.props;


    if (data.length <= 0) {
      return null;
    }
    const config = chartConfigs(isDevicePortrait());
    const chartSizes = large
      ? config.chartSizes.large
      : config.chartSizes.small;

    return (
      <View style={styles.container} pointerEvents="none">
        <VictoryChart {...config.chart} {...chartSizes.chart}>
          {/* Title */}
          <VictoryLabel
            {...config.title}
            {...chartSizes.title}
            text={large && title ? title : ''}
          />

          {/* X Axis */}
          <VictoryAxis {...config.xAxis} />

          {/* Y Axis */}
          <VictoryAxis
            {...config.yAxis}
            {...chartSizes.yAxis}
            tickLabelComponent={<VictoryLabel {...config.yAxis.tickLabel} />}
          />

          <VictoryBar
            {...config.bar}
            {...chartSizes.bar}
            data={data}
            labels={item => item.y}
            labelComponent={
              <VictoryLabel
                {...config.chart.label}
                {...chartSizes.chart.label}
              />
            }
          />
        </VictoryChart>
      </View>
    );
  }
}
