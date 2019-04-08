import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';

export default class FilterBarRow extends PureComponent {
  render() {
    const { data, removeSelectedFilter } = this.props;
    const { ProdGroupId, ProdGroupName, id } = data;
    return (
      <View style={styles.container} key={id}>
        <Text>{ProdGroupName}</Text>
        <TouchableOpacity onPress={removeSelectedFilter(ProdGroupId)}>
          <Text style={styles.closeIconStyle}></Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    borderRadius: 15,
    paddingLeft: 15,
    paddingRight: 10,
    paddingTop: 7,
    paddingBottom: 3,
    flexDirection: 'row',
    margin: 5
  },
  closeIconStyle: {
    color: '#E9AA47',
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 20,
    marginLeft: 7,
    alignItems: 'center'
  }
});
