import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { APP_THEME, APP_FONTS } from '../../constants';

const ButtonRound = ({ children, onPress }) => {
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
    color: APP_THEME.APP_BASE_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 16
  },
  buttonStyle: {
    flex: 1,
    borderWidth: 1,
    borderColor: APP_THEME.APP_BASE_FONT_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 50,
    marginLeft: 15,
    marginRight: 10
  }
};

export default ButtonRound;
