import React, { Component } from 'react';
import { View } from 'react-native';
import { APP_ROUTE, SIDEBAR_ROUTE } from '../constants';

import FilterScreen from '../screens/products/FilterScreen';
import Orders from '../screens/orders';
import Templates from '../screens/templates';
import Products from '../screens/templates/Products';

class SideMenu extends Component {
  onSelectFilter = filters => {
    const { productActions, navigation } = this.props;
    productActions.getSelectedFilter(filters);
    navigation.toggleDrawer();
  };

  render() {
    const {
      dashboard: { screenType, accountId }
    } = this.props;

    let component = null;
    if (screenType && screenType === APP_ROUTE.PRODUCTS)
      component = (
        <FilterScreen {...this.props} onSelectFilter={this.onSelectFilter} />
      );
    if (screenType && screenType === SIDEBAR_ROUTE.ORDERS)
      component = <Orders {...this.props} />;
    if (screenType && screenType === SIDEBAR_ROUTE.PRODUCT_TEMPLATE)
      component = <Products {...this.props} />;

    return <View style={{ flex: 1 }}>{component}</View>;
  }
}
export default SideMenu;
