import React, { PureComponent } from 'react';
import { View, Text, TouchableWithoutFeedback } from 'react-native';
import { withNavigation } from 'react-navigation';

import BarChartVertical from '../charts/BarChartVertical';
import BarChartHorizontal from '../charts/BarChartHorizontal';
import Histogram from '../charts/Histogram';
import PieChart from '../charts/PieChart';

import { labels } from '../../../stringConstants';
import styles from './style';

import { getRandomColor } from '../../../utility';
class Applet extends PureComponent {
  onAppletPress = () => {
    const {
      title,
      type,
      data,
      options,
      setSelectedChart,
      navigation,
      color
    } = this.props;

    setSelectedChart({
      title,
      type,
      data,
      options,
      color
    });

    navigation.navigate('ChartDetails', {
      headerTitle: title,
      color: this.generateRandomColor()
    });
  };

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

  renderChart() {
    const { type, data, options } = this.props;
    let chart = null;

    switch (type) {
      case labels.BAR_CHART_VERTICAL:
        chart = (
          <BarChartVertical
            {...this.props}
            color={this.generateRandomColor()}
            data={data}
            options={options}
          />
        );
        break;

      case labels.BAR_CHART_HORIZONTAL:
        chart = (
          <BarChartHorizontal {...this.props} data={data} options={options} />
        );
        break;

      case labels.HISTOGRAM:
        chart = <Histogram {...this.props} data={data} options={options} />;
        break;

      case labels.PIE_CHART:
        chart = <PieChart {...this.props} data={data} options={options} />;
        break;

      default:
        break;
    }

    return chart;
  }

  render() {
    const { title } = this.props;
    return (
      <TouchableWithoutFeedback onPress={this.onAppletPress}>
        <View style={styles.container}>
          <Text style={styles.title}>{title}</Text>
          {this.renderChart()}
        </View>
      </TouchableWithoutFeedback>
    );
  }
}

export default withNavigation(Applet);
