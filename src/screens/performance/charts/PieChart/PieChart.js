import React, { Component } from 'react';
import { View } from 'react-native';
import Svg from 'react-native-svg';
import {
  VictoryPie,
  VictoryLegend,
  VictoryLabel,
  VictoryContainer
} from 'victory-native';

import chartConfigs from './chart.config';
import { chartColors } from '../../../../constants';
import styles from './style';
import victoryContainer from 'victory-native/lib/components/victory-container';

export default class PieChart extends Component {
  shouldComponentUpdate(nextProps) {
    const { data, large, orientation } = this.props;

    return (
      data !== nextProps.data ||
      large !== nextProps.large ||
      orientation !== nextProps.orientation
    );
  }

  render() {
    const { data, title, large, isDevicePortrait } = this.props;

    const keys = Object.keys(data);
    const values = Object.values(data);

    if (values.length < 0) {
      return null;
    }

    if (values.length === 0) {
      // Add a empty value filler to work around
      // this legendary VictoryPie animation bug
      values.push({ x: 1, y: 1, label: ' ' });
    }

    const config = chartConfigs(isDevicePortrait());
    const chartSizes = large
      ? config.chartSizes.large
      : config.chartSizes.small;

    return (
      <View style={styles.container} pointerEvents="none">
        <Svg width={chartSizes.chart.width} height={chartSizes.chart.height}>
          <VictoryLabel
            {...config.title}
            {...chartSizes.title}
            text={large && title ? title : ''}
          />
        </Svg>
        <VictoryPie
          {...config.pie}
          {...chartSizes.pie}
          data={values}
          labels={item => `${values[item.eventKey]}`}
        />

        <VictoryLegend
          {...config.legend}
          {...chartSizes.legend}
          data={keys.map((key, index) => ({
            name: key,
            symbol: {
              fill: chartColors[index % chartColors.length]
            }
          }))}
        />
      </View>
    );
  }
}
