import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Text, Image } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../../../constants';
import { labels } from '../../../../stringConstants';
import { IconButton, TextButton } from '../../../../components/common';

class PaymentHistoryRow extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.stockRequestContainerStyle}
          onPress={() => onPressed()}
        >
          <Text style={styles.textBaseStyle}>#</Text>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            paddingRight: 5,
            paddingLeft: 5
          }}
        >
          <Text style={[styles.textBaseStyle]}>{labels.DATE}</Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={[styles.textBaseStyle]}>{labels.AMOUNT}</Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={[styles.textBaseStyle]}>{labels.MODE}</Text>
        </View>

        {/* <Text style={[styles.textBaseStyle, { flex: 1.5 }]}>
          {labels.FULL_PARTIAL}
        </Text> */}

        {/* <View style={styles.buttonWrapperStyle} /> */}
      </View>
    );
  }
}

export default PaymentHistoryRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  stockRequestContainerStyle: {
    flex: 2,
    marginLeft: 10
  },
  textBaseStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: 'normal',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    color: APP_THEME.APP_FONT_COLOR_REGULAR
  },
  textHeaderStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '600',
    fontSize: 14,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    lineHeight: 18
  },
  buttonWrapperStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginRight: 20
  }
});
