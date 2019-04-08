import { StyleSheet } from 'react-native';

import { APP_THEME, APP_FONTS } from '../../../constants';

export default StyleSheet.create({
  container: {
    flex: 1
  },
  contentContainer: {
    backgroundColor: APP_THEME.APP_BASE_COLOR_WHITE,
    marginBottom: 40,
    marginHorizontal: 20,
    marginTop: 10,
    alignItems: 'center'
  },
  contentWrapper: {
    width: '100%'
  },
  deeplinkButtonContainer: {
    alignSelf: 'flex-end',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10
  },
  deeplinkButton: {
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 150
  },
  deeplinkButtonText: {
    color: APP_THEME.APP_BASE_COLOR_WHITE,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 16
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
