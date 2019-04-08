import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { APP_FONTS } from '../../constants';
import { labels } from '../../stringConstants';
class Customers extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: APP_FONTS.FONT_REGULAR }}>
          {labels.SUMMARY_PLACEHOLDER}
        </Text>
      </View>
    );
  }
}

export default Customers;
