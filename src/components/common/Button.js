import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { APP_THEME, APP_FONTS } from "../../constants";

const Button = ({ children, onPress, fontSize, bgColor, disable }) => {
  const { buttonStyle, textStyle, buttonDisableStyle } = styles;
  var size = 16;
  var backgoundColor = APP_THEME.APP_BUTTON_COLOR;
  if (fontSize) {
    size = fontSize;
  }

  if (bgColor) {
    backgoundColor = bgColor;
  }

  return (
    <TouchableOpacity
      disabled={disable ? disable : false}
      style={[
        disable ? buttonDisableStyle : buttonStyle,
        { backgroundColor: backgoundColor }
      ]}
      onPress={onPress}
    >
      <Text style={[textStyle, { fontSize: size }]}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = {
  iconText: {
    alignSelf: "center",
    justifyContent: "center",
    color: APP_THEME.APP_BASE_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    padding: 5,
    fontSize: 18
  },
  textStyle: {
    alignSelf: "center",
    color: APP_THEME.APP_BASE_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_BOLD,
    fontSize: 16,
    fontWeight: "600",
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    flex: 1,
    alignSelf: "stretch",
    backgroundColor: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    borderRadius: 2
  },
  buttonDisableStyle: {
    flex: 1,
    alignSelf: "stretch",
    borderRadius: 2,
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    opacity: 0.7
  }
};

export { Button };
