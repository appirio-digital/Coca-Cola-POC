import React from 'react';
import {
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';

const DashboardItem = props => {
  const { label, image, id, route } = props.item;
  const view = props.item.image ? (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.itemContainer}
        onPress={() => props.onPressed(route, id, label)}
      >
        <Image source={image} style={styles.itemImage} />
        <Text style={styles.itemText}>{label}</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <View style={styles.containerBlank} />
  );
  return view;
};

export default DashboardItem;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    justifyContent: 'center',
    alignItems: 'center',

    borderRightWidth: 1,
    borderBottomWidth: 1,
    marginRight: 1,

    borderColor: '#ccc'
  },
  containerBlank: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,

    borderColor: 'transparent'
  },
  itemContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  itemText: {
    flex: 1,
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_BOLD,
    justifyContent: 'flex-end',
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 10,
    fontSize: 14,
    lineHeight: 18,
    marginTop: 24,
    marginBottom: 24
  },
  itemImage: {
    flex: 1,
    width: 77,
    height: 71,
    marginTop: 45,
    resizeMode: 'contain'
  }
});
