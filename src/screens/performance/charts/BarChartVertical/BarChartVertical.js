import React, { Component } from 'react';
import { View } from 'react-native';
import {
  VictoryChart,
  VictoryBar,
  VictoryLabel,
  VictoryAxis,
  VictoryLegend
} from 'victory-native';

import chartConfigs from './chart.config';
import styles from './style';

export default class BarChartVertical extends Component {
  shouldComponentUpdate(nextProps) {
    const { data, large, orientation, color } = this.props;

    return (
      data !== nextProps.data ||
      large !== nextProps.large ||
      orientation !== nextProps.orientation ||
      color !== nextProps.color
    );
  }

  render() {
    const { title, data, options, large, isDevicePortrait, color } = this.props;

    if (data.length <= 0 || !isDevicePortrait) {
      return null;
    }

    const config = chartConfigs(isDevicePortrait());
    const chartSizes = large
      ? config.chartSizes.large
      : config.chartSizes.small;

    const keys = Object.keys(data);
    const values = Object.values(data);

    return (
      <View style={styles.container} pointerEvents="none">
        <VictoryChart {...config.chart} {...chartSizes.chart}>
          {/* Title */}
          <VictoryLabel
            {...config.title}
            {...chartSizes.title}
            text={large && title ? title : ''}
          />
          {/* Y Axis */}
          <VictoryAxis
            {...config.yAxis}
            {...chartSizes.yAxis}
            label={options.yAxisLabel}
            axisLabelComponent={<VictoryLabel {...config.yAxis.label} />}
          />
          {/* X Axis */}
          {/* <VictoryAxis
            {...config.xAxis}
            {...chartSizes.xAxis}
            tickValues={keys}
            tickLabelComponent={
              <VictoryLabel
                {...config.xAxis.tickLabel}
                {...chartSizes.xAxis.tickLabel}
              />
            }
          /> */}

          <VictoryBar
            {...config.bar}
            {...chartSizes.bar}
            data={keys.map((key, index) => ({
              x: key,
              y: data[key],
              index
            }))}
            style={{
              data: {
                fill: data => {
                  return color ? color[data.index] : '#000000';
                }
              }
            }}
            labels={item => `${values[item.eventKey]}`}
            labelComponent={
              <VictoryLabel {...config.bar.label} {...chartSizes.bar.label} />
            }
          />
        </VictoryChart>
        <VictoryLegend
          {...config.legend}
          {...chartSizes.legend}
          data={keys.map((key, index) => ({
            name: key,
            symbol: {
              fill: color ? color[index] : '#000000'
            }
          }))}
        />
      </View>
    );
  }
}
