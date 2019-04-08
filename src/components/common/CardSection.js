import React from 'react';
import { View } from 'react-native';

const CardSection = ({ children, style }) => (
  <View style={[styles.container, style]}>{children}</View>
);

const styles = {
  container: {
    padding: 5,
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex:999
  }
};

export { CardSection };
