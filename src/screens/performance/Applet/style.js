import { StyleSheet } from 'react-native'

import { APP_THEME } from '../../../constants'

export default StyleSheet.create({
  container: {
    backgroundColor: APP_THEME.APP_BASE_COLOR_WHITE,
    borderColor: APP_THEME.APP_BASE_COLOR_GREY,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'column',
    margin: 10,
    height: 420,
    width: '46.5%',
  },
  title: {
    fontSize: 20,
    color: APP_THEME.APP_BASE_COLOR,
    margin: 10,
  },
})
