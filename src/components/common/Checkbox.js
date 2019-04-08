import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { APP_THEME, APP_FONTS } from '../../constants';

const Checkbox = ({ children, onPress, isChecked }) => {
  const { buttonStyle, textStyle, checkBoxStyle } = styles;

  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle}>
      <Text style={checkBoxStyle}>{isChecked === true ? '' : ''}</Text>
      <Text style={textStyle}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  textStyle: {
    textAlign: 'center',
    lineHeight: 23,
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 14
  },
  checkBoxStyle: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 24,
    paddingRight: 5
  },
  buttonStyle: {
    flex: 1,
    flexDirection: 'row'
  }
};

export { Checkbox };
