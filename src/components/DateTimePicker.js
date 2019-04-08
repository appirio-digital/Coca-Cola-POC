import React from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  DatePickerIOS,
  View
} from 'react-native';
import DatePicker from 'react-native-date-picker';

import moment from 'moment';

import { Popover, PopoverController } from 'react-native-modal-popover';
import { APP_FONTS, APP_THEME } from '../constants';

const initialState = { chosenDate: '', pickerSelectedDate: '' }; // TODO: Update these naming conventions, they are confusing
export default class Datepicker1 extends React.Component {
  state = initialState;

  reset = () => {
    const { defaultValue, fieldName, onValueChange } = this.props;
    this.setState(
      Object.assign({}, initialState, {
        selectedValue: defaultValue
      })
    );
    if (onValueChange) {
      onValueChange(fieldName)(null);
    }
  };

  setDate = newDate => {
    this.setState({ chosenDate: newDate });
  };

  onCancelPress = closePopover => () => {
    closePopover();
  };

  onDonePress = closePopover => () => {
    const { onValueChange, fieldName, onSelect } = this.props;
    let selectedDt = this.state.chosenDate
      ? moment(this.state.chosenDate)
      : moment()
          .hour(8)
          .minute(0)
          .second(0)
          .toDate();

    this.setState({ pickerSelectedDate: selectedDt });
    if (onValueChange) {
      onValueChange(moment(selectedDt).format('MM/DD/YYYY'));
    }
    closePopover();

    // Do something after a date is selected -- scenario: modify other form fields dependent on this field
    if (onSelect) {
      onSelect(moment(selectedDt));
    }
  };

  componentWillReceiveProps(nextProps) {
    const { value } = nextProps;
    if (!value) {
      this.setState(initialState);
    }
  }

  render() {
    const { chosenDate, pickerSelectedDate } = this.state;
    const {
      options,
      defaultValue,
      mode,
      isFormEditable,
      startDate,
      endDate,
      placeHolder,
      surgeryDate,
      fieldName,
      value,
      maximumDate,
      minimumDate
    } = this.props;

    let currentDate =
      mode === 'date'
        ? new Date()
        : moment()
            .hour(8)
            .minute(0)
            .toDate();
    const currentDtMode = mode === 'date' ? 'MM/DD/YYYY' : 'h:mm a';
    if (defaultValue) {
      currentDate = moment(defaultValue, 'MM/DD/YYYY').toDate();
    }

    let showDate;
    let selectedDate = chosenDate === '' ? currentDate : chosenDate;
    if (value) {
      const date = moment(value, 'MM/DD/YYYY');
      showDate = date.isValid()
        ? moment(value).format(currentDtMode)
        : moment(value.label).format(currentDtMode);
    } else {
      // TODO: Cleanup the logic below
      if (startDate) {
        showDate = moment(startDate).format(currentDtMode);
      } else if (endDate) {
        showDate = moment(endDate).format(currentDtMode);
      } else {
        showDate =
          chosenDate === ''
            ? pickerSelectedDate
              ? moment(pickerSelectedDate).format(currentDtMode)
              : ''
            : moment(chosenDate).format(currentDtMode);
      }
      if (chosenDate === '' && defaultValue) {
        showDate = moment(currentDate).format(currentDtMode);
        selectedDate = moment(defaultValue, 'MM/DD/YYYY').toDate();
      }
    }

    return (
      <View style={[styles.popoverController]}>
        <PopoverController>
          {({
            openPopover,
            closePopover,
            popoverVisible,
            setPopoverAnchor,
            popoverAnchorRect
          }) => (
            <React.Fragment>
              <TouchableOpacity
                style={[
                  styles.pickerView,
                  !isFormEditable ? styles.disableInput : {}
                ]}
                onPress={isFormEditable ? openPopover : null}
              >
                <Text
                  style={[!isFormEditable ? styles.disableText : {}]}
                  ref={setPopoverAnchor}
                >
                  {showDate.length > 0 ? showDate : placeHolder}
                </Text>
                <Text
                  style={[
                    styles.pickerIcon,
                    {
                      color: isFormEditable
                        ? APP_THEME.APP_BASE_COLOR
                        : '#ADADAD'
                    }
                  ]}
                >
                  
                </Text>
              </TouchableOpacity>

              <Popover
                contentStyle={styles.content}
                arrowStyle={styles.arrow}
                backgroundStyle={styles.background}
                visible={popoverVisible}
                onClose={closePopover}
                fromRect={popoverAnchorRect}
                supportedOrientations={['portrait', 'landscape']}
              >
                <View style={styles.container}>
                  <DatePicker
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                    date={selectedDate}
                    onDateChange={this.setDate}
                    mode={this.props.mode}
                  />
                  <View style={styles.btnContainer}>
                    <Button
                      title="Done"
                      onPress={this.onDonePress(closePopover)}
                    />
                    <View style={{ width: 10, height: 1 }} />
                    <Button
                      title="Cancel"
                      onPress={this.onCancelPress(closePopover)}
                    />
                  </View>
                </View>
              </Popover>
            </React.Fragment>
          )}
        </PopoverController>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  popoverController: {
    flex: 1
  },
  content: {
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8
  },
  arrow: {
    borderTopColor: 'white'
  },
  background: {},
  container: {
    flex: 1,
    justifyContent: 'center',
    width: 250
  },
  btnContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  pickerView: {
    flexDirection: 'row',
    height: 36,
    borderColor: '#B2B4AE',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    marginTop: 2,
    borderRadius: 2,
    padding: 5,
    alignItems: 'center'
  },
  pickerLblText: {
    color: '#BFBFBF',
    fontSize: 16
  },
  pickerActiveLblText: {
    color: '#000000',
    fontSize: 16,
    fontFamily: APP_FONTS.FONT_REGULAR
  },
  pickerIcon: {
    position: 'absolute',
    right: 0,
    top: 2,
    alignSelf: 'center',
    margin: 5,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 20
  },
  disableText: {
    color: '#ADADAD',
    fontFamily: APP_FONTS.FONT_REGULAR
  },
  disableInput: {
    borderColor: '#E2E2E2',
    backgroundColor: '#FAFAFA',
    fontFamily: APP_FONTS.FONT_REGULAR
  }
});
