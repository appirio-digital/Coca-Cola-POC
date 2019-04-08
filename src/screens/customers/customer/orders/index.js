import React, { Component } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';

import OrderListRow from './OrderRow';
import { APP_FONTS, APP_THEME, APP_ROUTE } from '../../../../constants';
import { labels } from '../../../../stringConstants';
import {
  fetchObjectCollection,
  API_END_POINT,
  API_NAME_POC
} from '../../../../services/omcClient';
export default class Orders extends Component {
  state = {
    orderList: [],
    accountId: null
  };
  orderItemClickHandler = order => {
    this.props.navigation.navigate(APP_ROUTE.NEW_ORDER, {
      headerTitle: order.RecordName,
      accountId: this.state.accountId,
      order: order
    });
  };
  async componentDidMount() {
    const {
      customersActions,
      navigation: {
        state: { params }
      }
    } = this.props;
    if (params && params.customer) {
      const response = await customersActions.getCustomerOrder();
      const orderList =
        response &&
        response.filter(order => order.Account_Id_c == params.customer.id);
      this.setState({ orderList, accountId: params.customer.id });
    }
  }

  onNewOrderClick = () => {
    const { openBottomSheets } = this.props;
    openBottomSheets(true, this.state.accountId);
  };

  async componentWillReceiveProps(newProps) {
    const {
      customers: { isReloadOrders },
      customersActions
    } = newProps;

    if (isReloadOrders && isReloadOrders) {
      customersActions.reloadOrder(false);
      const response = await customersActions.getCustomerOrder();
     // customersActions.getAllCustomers();
      const orderList =
        response &&
        response.filter(order => order.Account_Id_c == this.state.accountId);
      this.setState({ orderList });
    }
  }

  renderCustomerItem = item => {
    return (
      <OrderListRow
        onPressed={this.orderItemClickHandler}
        item={{ ...item.item }}
      />
    );
  };
  _keyExtractor = (item, index) => `${index}`;
  render() {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <View style={styles.header}>
          <Text style={styles.headerText}>{}</Text>

          <TouchableOpacity
            style={styles.headerButton}
            onPress={this.onNewOrderClick}
          >
            <Text style={styles.headerButtonIcon}> </Text>
            <Text style={styles.headerButtonText}> {labels.NEW_ORDER}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={this.state.orderList}
          style={{ flex: 1, marginTop: 10 }}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderCustomerItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginTop: 20,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    flex: 1,
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_BOLD,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600',
    flexDirection: 'row',
    justifyContent: 'center'
  },
  headerButton: {
    flex: 0.4,

    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    flexDirection: 'row'
  },
  headerButtonText: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    color: APP_THEME.APP_BASE_COLOR_WHITE
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
