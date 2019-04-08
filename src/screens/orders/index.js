import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';

import { APP_FONTS, APP_THEME } from '../../constants';
import { labels } from '../../stringConstants';
import OrderRow from './OrderRow';
import Products from './Products';
import { Spinner } from '../../components/common/Spinner';
import { isEmpty, union, uniqBy, find } from 'lodash';

const initialState = {
  isShowProducts: false,
  selectedOrderId: '',
  products: [],
  orders: [],
  accountId: null,
  allOrder: [],
  loading: false,
  isSelected: false
};

class Orders extends Component {
  state = initialState;

  async componentDidMount() {
    this.setState({ loading: true });
    try {
      const { customersActions } = this.props;
      await customersActions.getCustomerOrder();
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ loading: false });
    }
  }
  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      dashboard: { accountId },
      customers: { orderList }
    } = nextProps;

    if (accountId !== prevState.accountId && orderList) {
      const accountsOrderList = [...orderList].filter(
        order => order.Account_Id_c == accountId && !isEmpty(order.orderItem)
      );
      return {
        allOrder: orderList,
        orders: accountsOrderList,
        isShowProducts: false,
        selectedOrderId: '',
        products: [],
        accountId: accountId
      };
    }
    return prevState;
  }

  moveToOrderDetailScreen = () => () => {
    const selectedOrders = [...this.state.orders].filter(
      order => order.selected
    );
    if (selectedOrders.length > 0) {
      const products = selectedOrders.map(item => {
        return item.orderItem.filter(product => product.selected);
      });
      let allSelectedProducts = uniqBy(
        union(...products),
        product => product.Product_Id_c
      );

      allSelectedProducts = [...allSelectedProducts].map(orderItem => {
        delete orderItem['selected'];
        delete orderItem['Id'];
        return { ...orderItem, Order_Id_c: '', Order_c: '' };
      });
      this.props.navigation.toggleDrawer();
      this.props.navigation.navigate('Neworder', {
        orderItems: allSelectedProducts,
        headerTitle: labels.NEW_ORDER,
        accountId: this.state.accountId
      });
    } else {
      Alert.alert('', labels.ORDER_NOT_SELECTED, [
        {
          text: labels.OK
        }
      ]);
    }
  };

  onProductSelect = products => {
    const { selectedOrderId } = this.state;
    const orders = [...this.state.orders].map(item => {
      if (item.Id === selectedOrderId) return products;
      return item;
    });
    this.setState({ orders });
  };
  onBackBtnPresed = () => {
    this.props.navigation.toggleDrawer();
  };

  onProductBackBtnPressed = () => () => {
    this.setState({ isShowProducts: false, selectedOrderId: '' });
  };

  onCheckBoxClick = objId => () => {
    const orders = [...this.state.orders].map(item => {
      if (item.Id === objId) {
        const orderItem = item.orderItem.map(item => {
          return { ...item, selected: true };
        });
        return Object.assign({}, item, {
          selected: !item.selected,
          orderItem: orderItem
        });
      }

      return item;
    });
    this.setState({ orders });
  };

  _keyExtractor = (item, index) => `${index}`;

  renderItem = item => {
    return (
      <OrderRow
        item={item.item}
        onCheckBoxClick={this.onCheckBoxClick}
        onRowClick={this.onProductRowClick}
      />
    );
  };

  onProductRowClick = order => () => {
    this.setState({
      isShowProducts: true,
      selectedOrderId: order.Id,
      products: order.orderItem
    });
  };

  render() {
    const { orders, isShowProducts, selectedOrderId } = this.state;

    if (isShowProducts) {
      const order = find(orders, item => item.Id === selectedOrderId);
      return (
        <Products
          onBackPressed={this.onProductBackBtnPressed}
          order={order}
          // parentItem={selectedOrderId}
          // products={this.state.products}
          onProductSelect={this.onProductSelect}
          moveToOrderDetailScreen={this.moveToOrderDetailScreen}
        />
      );
    }

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
              onPress={this.onBackBtnPresed}
            >
              <Text style={styles.textStyle}></Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>{labels.PREVIOUS_ORDERS}</Text>
            <TouchableOpacity
              style={[styles.buttonStyle, { alignItems: 'flex-end' }]}
              onPress={this.moveToOrderDetailScreen()}
            >
              <Text style={styles.textStyle}></Text>
            </TouchableOpacity>
          </View>
          <View />
          {this.state.loading ? (
            <Spinner />
          ) : isEmpty(this.state.orders) ? (
            <Text style={styles.errorTextStyle}>{labels.ORDER_NOT_FOUND}</Text>
          ) : (
            <FlatList
              style={{
                flex: 1
              }}
              data={orders}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

export default Orders;
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
  },
  errorTextStyle: {
    padding: 10,
    marginTop: 20,
    alignSelf: 'center',
    color: APP_THEME.APP_COLOR_DARK_BLACK,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 16,
    lineHeight: 18
  }
});
