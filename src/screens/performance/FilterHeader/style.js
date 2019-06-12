import { StyleSheet } from 'react-native';

import { APP_THEME, APP_FONTS } from '../../../constants';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR_WHITE,
    marginBottom: 10
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    height: 60
  },
  contentPortraitWidth: {
    width: '96.5%'
  },
  contentLandscapeWidth: {
    width: '96%'
  },
  baseButton: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: APP_THEME.APP_BASE_COLOR,
    borderRadius: 3,
    margin: 5
  },
  baseButtonText: {
    color: APP_THEME.APP_BASE_COLOR,
    fontSize: 16
  },
  todayButton: {
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  filterButtonText: {
    paddingHorizontal: 10,
    paddingVertical: 7
  },
  dropdownContainer: {
    justifyContent: 'center',
    paddingEnd: 15
  },
  dropdown: {
    borderColor: APP_THEME.APP_BASE_COLOR_DARK_GREY,
    height: 485,
    margin: 0
  },
  dropdownQty: {
    height: 165
  },
  dropdownIcon: {
    position: 'absolute',
    color: APP_THEME.APP_BASE_COLOR,
    right: 10,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN
  },
  dropdownItemText: {
    color: APP_THEME.APP_BASE_COLOR_DARK_GREY,
    marginHorizontal: 10
  },
  dropdownItemHighlight: {
    color: APP_THEME.APP_BASE_COLOR
  },
  dropdownItemTextQty: {
    marginHorizontal: 14
  },
  dateFilterContainer: {
    marginStart: 5
  },
  applyButton: {
    backgroundColor: APP_THEME.APP_BUTTON_COLOR
  },
  floatRight: {
    position: 'absolute',
    right: 0
  },
  applyButtonText: {
    color: APP_THEME.APP_BASE_COLOR_WHITE,
    fontFamily: APP_FONTS.FONT_MEDIUM,
    paddingVertical: 7,
    paddingHorizontal: 10
  },
  loadingContainer: {
    paddingVertical: 7.5,
    paddingHorizontal: 10
  }
});
