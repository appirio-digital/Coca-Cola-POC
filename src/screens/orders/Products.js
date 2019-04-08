import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList
} from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';
import { labels } from '../../stringConstants';
import ProductRow from './ProductRow';
import { Checkbox } from '../../components/common';

export default class Products extends Component {
  state = {
    isAllItemChecked: false
  };

  componentDidMount() {
    const { order } = this.props;
    console.log(order);
    const selectedProducts = order.orderItem.filter(item => item.selected);
    this.setState({
      isAllItemChecked: !order.selected
        ? false
        : selectedProducts.length == 0 && order.selected
          ? true
          : order.orderItem.length === selectedProducts.length
            ? true
            : false
    });
  }

  onCheckBoxClick = objId => () => {
    const { onProductSelect, order } = this.props;
    const products = [...order.orderItem].map(item => {
      if (item.Id === objId)
        return Object.assign({}, item, { selected: !item.selected });
      return item;
    });
    const selectedProducts = products.filter(product => product.selected);
    this.setState({
      isAllItemChecked:
        selectedProducts.length === this.props.order.orderItem.length
    });

    onProductSelect({ ...order, orderItem: products });
  };

  _keyExtractor = (item, index) => `${index}`;

  onProductRowClick = productId => {};
  renderItem = item => {
    return (
      <ProductRow
        item={item.item}
        checkAll={this.state.isAllItemChecked}
        onCheckBoxClick={this.onCheckBoxClick}
        onRowClick={this.onProductRowClick}
      />
    );
  };

  onSelectAllBtnPressed = () => () => {
    const { onProductSelect, order } = this.props;
    const products = [...this.props.order.orderItem].map(item => {
      return Object.assign({}, item, { selected: !item.selected });
    });
    onProductSelect({ ...order, orderItem: products });
    this.setState({ isAllItemChecked: !this.state.isAllItemChecked });
  };

  render() {
    const { isAllItemChecked } = this.state;
    const {
      onBackPressed,
      parentItem,
      order,
      moveToOrderDetailScreen
    } = this.props;
    const pageTitle = order.RecordName;
    return (
      <SafeAreaView
        style={{
          flex: 1
        }}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={[styles.buttonStyle, { alignItems: 'flex-start' }]}
              onPress={onBackPressed()}
            >
              <Text style={styles.textStyle}></Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>{pageTitle}</Text>
            <TouchableOpacity
              style={[styles.buttonStyle, { alignItems: 'flex-end' }]}
              onPress={moveToOrderDetailScreen()}
            >
              <Text style={styles.textStyle}></Text>
            </TouchableOpacity>
          </View>
          <View />
          <View
            style={{
              height: 40,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginRight: 15
            }}
          >
            <Checkbox
              isChecked={isAllItemChecked}
              onPress={this.onSelectAllBtnPressed()}
            >
              {labels.SELECT_ALL}
            </Checkbox>
          </View>
          <FlatList
            style={{
              flex: 1
            }}
            data={order.orderItem}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 10,
    height: 40
  },
  headerText: {
    flex: 8,
    color: '#000000',
    fontSize: 20,
    fontFamily: APP_FONTS.FONT_MEDIUM,
    textAlign: 'center'
  },
  textStyle: {
    alignSelf: 'center',
    color: '#479D7C',
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 18
  },
  buttonStyle: {
    borderWidth: 1,
    borderColor: '#479D7C',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 15,
    marginRight: 15
  }
});
