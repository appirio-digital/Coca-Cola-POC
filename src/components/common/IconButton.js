import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import { APP_THEME, APP_FONTS } from '../../constants';

const IconButton = ({ children, onPress, bgColor, disable }) => {
  const { buttonStyle, textStyle } = styles;
  return (
    <View
      style={[
        buttonStyle,
        { backgroundColor: bgColor ? bgColor : 'transparent' }
      ]}
    >
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={onPress}
        disabled={disable && disable}
      >
        <Text
          style={[
            textStyle,
            {
              color: bgColor
                ? APP_THEME.APP_BASE_FONT_COLOR
                : APP_THEME.APP_STEPPER_BUTTON_COLOR
            }
          ]}
        >
          {children}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  textStyle: {
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 20,
    lineHeight: 26,
    alignItems: 'center'
  },
  buttonStyle: {
    flex: 1,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export { IconButton };
