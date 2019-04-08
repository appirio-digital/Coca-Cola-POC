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
import { chartColors } from '../../../../constants';
import Svg from 'react-native-svg';

import styles from './style';

export default class Histogram extends Component {
  shouldComponentUpdate(nextProps) {
    const { data, large, orientation } = this.props;

    return (
      data !== nextProps.data ||
      large !== nextProps.large ||
      orientation !== nextProps.orientation
    );
  }

  render() {
    const { data, title, options, large, isDevicePortrait } = this.props;

    //const { title, options, large, isDevicePortrait } = this.props;

    console.log('Route Chart data', data);

    // let data = [
    //   { x: 'Appointment with Derek', y: 0.1 },
    //   { x: 'Appointment with Anil', y: 0.2 },
    //   { x: 'Appointment with Lok', y: 0.4 },
    //   { x: 'Appointment with Jack', y: 0.2 }
    // ];

    if (data.length <= 0) {
      return null;
    }

    const isPortrait = isDevicePortrait();
    const config = chartConfigs(isPortrait);
    const chartSizes = large
      ? config.chartSizes.large
      : config.chartSizes.small;

    const keys = Object.keys(data);
    const values = Object.values(data);
    const dataLength = keys.length <= 0 ? 1 : keys.length;

    // To keep the bars together
    const barRatio = 1.23 - 0.03 * dataLength;
    const paddingLeftBase = large ? 10 : 50;
    const paddingRightBase = large ? 10 : 30;
    const paddingRightBaseAdd = large ? 30 : 20;

    const paddingLeft =
      (paddingLeftBase * paddingRightBaseAdd) / dataLength -
      (dataLength - 7) * paddingRightBaseAdd;
    const paddingRight =
      (paddingRightBase * paddingRightBaseAdd) / dataLength -
      (dataLength - 3.5) * paddingRightBaseAdd;
    const paddingX = [paddingLeft, paddingRight];

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
          <VictoryAxis {...config.yAxis} {...chartSizes.yAxis} />
          {/* X Axis */}
          {/* <VictoryAxis {...config.xAxis} {...chartSizes.xAxis} /> */}
          <VictoryBar
            {...config.bar}
            {...chartSizes.bar}
            data={data}
            barRatio={barRatio}
            domainPadding={{
              x: paddingX
            }}
            labelComponent={<VictoryLabel {...config.bar.label} />}
          />

          {/* <VictoryBar
            {...config.bar}
            {...chartSizes.bar}
            data={keys.map(key => ({
              x: key,
              y: data[key]
            }))}
            barRatio={barRatio}
            domainPadding={{
              x: paddingX
            }}
            labels={item => `${values[item.eventKey]}`}
            labelComponent={<VictoryLabel {...config.bar.label} />}
          /> */}
        </VictoryChart>
        <VictoryLegend
          {...config.legend}
          {...chartSizes.legend}
          data={keys.map((key, index) => ({
            name: data[index].x,
            symbol: {
              fill: chartColors[index % chartColors.length]
            }
          }))}
        />
      </View>
    );
  }
}
