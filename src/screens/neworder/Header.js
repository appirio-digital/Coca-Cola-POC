import React, { PureComponent } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';
import { labels } from '../../stringConstants';

export default class Header extends PureComponent {
  render() {
    const {
      onSaveClick,
      onSubmitClick,
      isSubmitted,
      isBooked,
      onInvoiceClick,
      onPromotionsClick
    } = this.props;
    return (
      <View style={styles.headerContainer}>
        <TouchableOpacity
          disabled={isSubmitted}
          style={
            isSubmitted
              ? styles.headerButtonDisbaleStyle
              : styles.headerButtonStyle
          }
          onPress={() => onPromotionsClick()}
        >
          <Text
            style={[
              styles.btnTextStyle,
              { color: APP_THEME.APP_BASE_FONT_COLOR }
            ]}
          >
            {labels.PROMOTIONS}
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity style={styles.headerButtonStyle}>
          <Text
            style={[
              styles.btnTextStyle,
              { color: APP_THEME.APP_BASE_FONT_COLOR }
            ]}
          >
            {labels.TAXATION}
          </Text>
        </TouchableOpacity> */}
        <TouchableOpacity
          disabled={!isSubmitted}
          style={
            !isSubmitted
              ? styles.headerButtonDisbaleStyle
              : styles.headerButtonStyle
          }
          onPress={() => onInvoiceClick()}
        >
          <Text
            style={[
              styles.btnTextStyle,
              { color: APP_THEME.APP_BASE_FONT_COLOR }
            ]}
          >
            {labels.INVOICE}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSubmitClick()}
          disabled={isSubmitted || !isBooked}
          style={
            isSubmitted || !isBooked
              ? styles.headerButtonDisbaleStyle
              : styles.headerButtonStyle
          }
        >
          <Text
            style={[
              styles.btnTextStyle,
              { color: APP_THEME.APP_BASE_FONT_COLOR }
            ]}
          >
            {/* <Text style={styles.headerButtonIcon}>  </Text> */}
            {labels.SAVE_PAYMENT}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          disabled={isSubmitted}
          onPress={() => onSaveClick()}
          style={
            isSubmitted
              ? styles.headerButtonDisbaleStyle
              : styles.headerButtonStyle
          }
        >
          <Text
            style={[
              styles.btnTextStyle,
              { color: APP_THEME.APP_BASE_FONT_COLOR }
            ]}
          >
            <Text style={styles.headerButtonIcon}>  </Text>
            {labels.SAVE}
          </Text>
        </TouchableOpacity>

        {/* <View
          style={{
            flex: 1,
            justifyContent: 'center',
            paddingTop: 5,
            paddingBottom: 5
          }}
        >
          <TouchableOpacity
            style={styles.headerButton}
            onPress={this.onEditHandler}
          >
            <Text style={styles.headerButtonIcon}>  </Text>
            <Text style={styles.headerButtonText}> {labels.EDIT}</Text>
          </TouchableOpacity>
        </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    padding: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end'
  },
  headerText: {
    flex: 8,
    color: '#000000',
    fontSize: 20,
    fontFamily: APP_FONTS.FONT_MEDIUM,
    textAlign: 'center'
  },
  headerButtonStyle: {
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 2,
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    marginLeft: 8
  },
  headerButtonDisbaleStyle: {
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 12,
    paddingBottom: 12,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 2,
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    marginLeft: 8,
    opacity: 0.7
  },
  btnTextStyle: {
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 16,
    alignItems: 'center',
    fontWeight: '600'
  },
  headerButtonIcon: {
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    color: APP_THEME.APP_BASE_COLOR_WHITE
  }
});
