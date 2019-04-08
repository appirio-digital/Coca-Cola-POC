import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { APP_THEME, APP_FONTS } from '../../constants';

const TextButton = ({ children, onPress }) => {
  const { buttonStyle, textStyle } = styles;

  return (
    <TouchableOpacity style={buttonStyle} onPress={onPress}>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    alignSelf: 'center',
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 14,
    lineHeight: 16
  },
  buttonStyle: {
    //flex: 1,
    alignSelf: 'stretch'
  }
};

export { TextButton };
