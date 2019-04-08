import React, { PureComponent } from 'react';
import { IconButton } from '../../../components/common';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../../constants';
import { labels } from '../../../stringConstants';
import { getActivityCodeString, formatDateDDMMYYYY } from '../../../utility';
class StockRequestRow extends PureComponent {
  getStatusColor = () => {
    switch (this.props.stockRequest.item.status) {
      case 'Draft':
        return '#86898E';
      case 'Approved':
        return '#05A079';
      case 'Submitted':
        return '#F5A623';
      default:
        return '#86898E';
    }
  };

  render() {
    const { subject, duedate, statuscode } = this.props.stockRequest.item;
    return (
      <View style={styles.container}>
        <View style={styles.stockRequestContainerStyle}>
          <Text style={styles.stockRequestTextStyle}>{subject}</Text>
        </View>
        <View style={{ flex: 2, flexDirection: 'row' }}>
          <View
            style={{
              flex: 2,
              justifyContent: 'center',
              alignItems: 'flex-end'
            }}
          >
            <Text style={[styles.textHeaderStyle]}>{labels.DUE_DATE}: </Text>
          </View>
          <View
            style={{
              flex: 2,
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            <Text style={[styles.textBaseStyle]}>
              {formatDateDDMMYYYY(duedate)}
            </Text>
          </View>
        </View>
        <View style={{ flex: 1.5, alignItems: 'center' }}>
          <Text style={[styles.textBaseStyle]}>
            {getActivityCodeString(statuscode)}
          </Text>
        </View>
        <View style={styles.buttonWrapperStyle}>
          {statuscode !== 'APPROVED' ? (
            <IconButton
              onPress={() => {
                this.props.onEditClicked(this.props.stockRequest.item);
              }}
            >
              
            </IconButton>
          ) : (
            <IconButton
              onPress={() => {
                this.props.onEditClicked(this.props.stockRequest.item);
              }}
            >
              
            </IconButton>
          )}
        </View>
      </View>
    );
  }
}

export default StockRequestRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center'
  },
  stockRequestTextStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '600',
    fontSize: 14,
    color: APP_THEME.APP_FONT_COLOR_DARK
  },
  stockRequestContainerStyle: {
    flex: 2.2,
    marginLeft: 10,
    marginRight: 5
  },
  textBaseStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: 'normal',
    fontSize: 14,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    lineHeight: 18
  },
  textHeaderStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '600',
    fontSize: 14,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    lineHeight: 18
  },
  buttonWrapperStyle: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginRight: 20
  }
});
