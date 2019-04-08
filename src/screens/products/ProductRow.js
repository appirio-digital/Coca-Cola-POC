import React, { PureComponent } from 'react';
import { TouchableOpacity, StyleSheet, View, Text } from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';

export default class ProductRow extends PureComponent {
  getStatusColor = status => {
    switch (status) {
      case 'In stock':
        return '#4EA384';
      case 'Out of stock':
        return '#E9AA47';
      case 'Submitted':
        return '#F5A623';
      default:
        return '#86898E';
    }
  };

  render() {
    const { item, onRowClick } = this.props;
    const {
      ProdGroupItemsId,
      ProdGroupId,
      InventoryItemId,
      InvOrgId,
      DisplayOrderNum,
      ActiveFlag,
      Description,
      LongDescription,
      ItemNumber,
      Name,
      category
    } = item;
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={{ flex: 1, flexDirection: 'row' }}
          onPress={onRowClick(item)}
        >
          <Text style={styles.productIdTextStyle}>{ItemNumber}</Text>
        </TouchableOpacity>

        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            marginLeft: 10,
            marginRight: 10
          }}
        >
          <Text style={[styles.fadetextStyle]}>{Name}</Text>
        </View>

        <View style={{ flex: 1, flexDirection: 'row' }}>
          <Text style={[styles.fadetextStyle]}>
            {category ? category.ProdGroupName : ''}
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  productIdTextStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '600',
    fontSize: 14,
    color: APP_THEME.APP_FONT_COLOR_REGULAR,
    textDecorationLine: 'underline'
  },
  fadetextStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: 'normal',
    fontSize: 14,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    lineHeight: 18
  },
  textStatusStyle: {
    fontFamily: APP_FONTS.FONT_BOLD,
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 18,
    textAlign: 'center'
  },
  priceContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
