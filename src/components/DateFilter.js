import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '../components/DateTimePicker';
import { APP_FONTS, APP_THEME } from '../constants';
import { labels } from '../stringConstants';

export default props => {
  const {
    onFromValueChange,
    onToValueChange,
    valueTo,
    valueFrom,
    maximumFrom,
    minimumFrom,
    maximumTo,
    minimumTo,
  } = props;

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10
      }}
    >
      <Text style={styles.dateLable}>{labels.FROM}:</Text>
      <View style={styles.dateValue}>
        <DateTimePicker
          {...props}
          mode="date"
          placeHolder="MM/DD/YYYY"
          fieldName="fromDate"
          isFormEditable
          onValueChange={date => onFromValueChange(date)}
          value={valueFrom}
          maximumDate={maximumFrom}
          minimumDate={minimumFrom}
        />
      </View>
      <Text style={styles.dateLable}>{labels.To}:</Text>
      <View style={styles.dateValue}>
        <DateTimePicker
          {...props}
          mode="date"
          placeHolder="MM/DD/YYYY"
          fieldName="toDate"
          isFormEditable
          onValueChange={date => onToValueChange(date)}
          value={valueTo}
          maximumDate={maximumTo}
          minimumDate={minimumTo}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 7
  },
  dateLable: {
    color: APP_THEME.APP_FONT_COLOR_REGULAR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 16
  },
  dateIcon: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 22,
    paddingRight: 10
  },
  dateValue: {
    height: 40,
    width: 120,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10
  }
});
