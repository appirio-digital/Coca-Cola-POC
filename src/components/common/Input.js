import React from 'react';
import { TextInput, View, Text } from 'react-native';
import { APP_THEME, APP_FONTS } from '../../constants';
import { IconButton } from './IconButton';

renderIcon = iconName => {
  if (iconName) {
    const { labelStyle } = styles;
    return <Text style={labelStyle}>{iconName}</Text>;
  }
};

const Input = ({
  label,
  value,
  onChangeText,
  autoCorrect,
  placeholder,
  secureTextEntry,
  autoCapitalize,
  additionalViewStyle,
  rightButtonTitle,
  rightButtonOnPress
}) => {
  const { inputStyle, containerStyle, labelStyle } = styles;

  renderRightButton = () => {
    if (rightButtonTitle && rightButtonOnPress) {
      return (
        <View style={{ paddingRight: 10 }}>
          <IconButton onPress={rightButtonOnPress}>
            {rightButtonTitle}
          </IconButton>
        </View>
      );
    }
  };
  return (
    <View style={[containerStyle, additionalViewStyle]}>
      {this.renderIcon(label)}
      <TextInput
        style={inputStyle}
        underlineColorAndroid="transparent"
        onChangeText={onChangeText}
        value={value}
        autoCorrect={autoCorrect}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize}
      />
      {this.renderRightButton()}
    </View>
  );
};

const styles = {
  inputStyle: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    fontFamily: APP_FONTS.FONT_REGULAR,
    flex: 1
  },
  labelStyle: {
    paddingLeft: 15,
    color: APP_THEME.APP_BASE_COLOR,
    fontSize: 18,
    paddingTop: 10,
    paddingBottom: 10,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN
  },
  containerStyle: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    alignSelf: 'center'
  }
};

export { Input };
