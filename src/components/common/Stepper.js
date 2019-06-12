import React from 'react';
import { TouchableOpacity, Text, View, TextInput } from 'react-native';
import { APP_THEME, APP_FONTS } from '../../constants';
import { IconButton } from '../common';
import { labels } from '../../stringConstants';

const Stepper = props => {
  const { buttonStyle, textStyle } = styles;
  const {
    addClicked,
    substractClicked,
    value,
    onChangeText,
    style,
    onEndEditing,
    isDisable
  } = props;
  return (
    <View
      style={[
        {
          flex: 1,
          flexDirection: 'row',
          alignItems: 'center'
        },
        style
      ]}
    >
      <View style={{ alignItems: 'center' }}>
        <Text style={styles.textTitleStyle}>{`${labels.QTY}${':'}`}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <IconButton
          onPress={substractClicked}
          bgColor={APP_THEME.APP_BUTTON_COLOR}
        >
          
        </IconButton>
      </View>
      <View style={styles.valueContainer}>
        <TextInput
          underlineColorAndroid="transparent"
          editable={isDisable ? isDisable : false}
          selectTextOnFocus={isDisable ? isDisable : false}
          onChangeText={onChangeText}
          style={styles.textValueStyle}
          onEndEditing={onEndEditing}
        >
          {value}
        </TextInput>
      </View>
      <View style={styles.buttonContainer}>
        <IconButton
          onPress={addClicked}
          bgColor={APP_THEME.APP_BUTTON_COLOR}
        >
          
        </IconButton>
      </View>
    </View>
  );
};

const styles = {
  textLabelStyle: {
    alignSelf: 'center',
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 12,
    fontWeight: 'normal'
  },
  textTitleStyle: {
    fontFamily: APP_FONTS.APP_FONT_COLOR_REGULAR,
    color: APP_THEME.APP_FONT_COLOR_DARK,
    lineHeight: 20,
    fontSize: 12,
    fontWeight: 'normal'
  },
  textValueStyle: {
    fontFamily: APP_FONTS.APP_FONT_COLOR_REGULAR,
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    lineHeight: 22,
    fontSize: 18,
    fontWeight: 'normal'
  },
  buttonContainer: {
    height: 40,
    width: 40,
    margin: 5
  },
  valueContainer: {
    minHeight: 40,
    width: 40,
    backgroundColor: APP_THEME.APP_BASE_COLOR_OFFWHITE,
    margin: 5,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export { Stepper };
