import React, { PureComponent } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';
import { getPaymentMode, roundAmount } from '../../utility';

export default class ReportRow extends PureComponent {
  render() {
    const { item, currenyCode } = this.props;
    const { key, value } = item;

    return (
      <View style={styles.container}>
        <Text
          style={{
            fontFamily: APP_FONTS.FONT_SEMIBOLD,
            fontSize: 16,
            color: '#122632'
          }}
        >
          {`${getPaymentMode(key)}${':'}`}
        </Text>
        <Text
          style={{
            fontFamily: APP_FONTS.FONT_REGULAR,
            fontSize: 16,
            fontWeight: '600',
            color: '#86898E'
          }}
        >
          {`${currenyCode}${roundAmount(value)}`}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 50,
    borderTopWidth: 0.7,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    justifyContent: 'space-between'
  }
});
