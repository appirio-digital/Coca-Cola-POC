import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../../constants';

export default class AttrbuteRow extends PureComponent {
  render() {
    const { title, value } = this.props;
    return (
      <View style={styles.container}>
        <Text style={styles.attrbuteTitleStyle}>{title}</Text>
        <Text style={styles.attrbuteValueStyle}>{value}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10
  },
  attrbuteTitleStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '500',
    fontSize: 14,
    flexWrap: 'wrap',
    color: APP_THEME.APP_FONT_COLOR_REGULAR
  },
  attrbuteValueStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 13,
    color: APP_THEME.APP_FONT_COLOR_REGULAR,
    fontWeight: '300',
    flexWrap: 'wrap',
    marginLeft: 5
  }
});
