import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { APP_FONTS } from '../../constants';
class Customers extends Component {
  render() {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: APP_FONTS.FONT_REGULAR }}>
          Admin Placeholder Screen
        </Text>
      </View>
    );
  }
}

export default Customers;
