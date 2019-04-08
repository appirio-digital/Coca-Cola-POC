import React, { Component } from 'react';
import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  NetInfo,
  AsyncStorage,
  PushNotificationIOS
} from 'react-native';
import { APP_FONTS, APP_ROUTE } from '../../constants';
import DashboardItem from './DashboardItem';

import Loader from '../../components/common/Loader';
import { formatDateMMDD, getToDateForRegion } from '../../utility';
import { find } from 'lodash';
import { labels } from '../../stringConstants';

class Dashboard extends Component {
  state = {
    numOfColumn: 4,
    dashboardMenu: [],
    allMenuItem: [
      {
        id: 0,
        image: require('../../images/map.png'),
        label: labels.ROUTE,
        route: APP_ROUTE.ROUTE
      },
      {
        id: 1,
        image: require('../../images/customer-icon.png'),
        label: labels.CUSTOMERS,
        route: APP_ROUTE.CUSTOMERS_ALL
      },
      {
        id: 2,
        image: require('../../images/products-icon.png'),
        label: labels.PRODUCTS,
        route: APP_ROUTE.PRODUCTS
      },
      {
        id: 3,
        image: require('../../images/report-icon.png'),
        label: labels.REPORT,
        route: APP_ROUTE.REPORT
      },
      {
        id: 4,
        image: require('../../images/summary-icon.png'),
        label: labels.SUMMARY,
        route: APP_ROUTE.SUMMARY
      },
      {
        id: 5,
        image: require('../../images/stock-icon.png'),
        label: labels.INVENTORY,
        route: APP_ROUTE.INVENTORY
      },
      {
        id: 6,
        image: require('../../images/performance-icon.png'),
        label: labels.PERFORMANCE,
        route: APP_ROUTE.PERFORMANCE
      },
      {
        id: 7,
        image: require('../../images/sync-icon.png'),
        label: labels.SYNC,
        route: APP_ROUTE.SYNC
      },
      {
        id: 8,
        image: require('../../images/admin-icon.png'),
        label: labels.ADMIN,
        route: APP_ROUTE.ADMIN
      },
      {
        id: 9,
        image: require('../../images/messaging-icon.png'),
        label: labels.MESSAGING,
        route: APP_ROUTE.MESSAGING
      }
    ]
  };

  componentWillUnmount() {
    this.__isMounted = false;
    PushNotificationIOS.removeEventListener('notification');
  }

  async componentDidMount() {
    this.__isMounted = true;
    PushNotificationIOS.addEventListener('notification', notification =>
      this.receivedNotification(notification)
    );
    PushNotificationIOS.addEventListener('registrationError', (key, error) => {
      //console.log('Error Notification', key, error);
    });
    const {
      dashboardActions,
      auth: { profile },
      customersActions
    } = this.props;

    customersActions.setFilterInitialDate(
      formatDateMMDD(new Date()),
      getToDateForRegion(profile && profile.PrimaryCountry_c == 'CA' ? 9 : 4)
    );
    const { allMenuItem } = this.state;

    try {
      const menu = JSON.parse(profile.module);

      const modules = [...allMenuItem].map(dashboard => {
        const module = find(menu, item => item.id == dashboard.id);
        return {
          ...dashboard,
          priority: module.priority,
          enabled: module.enabled == 'true'
        };
      });

      this.updateState({ dashboardMenu: modules });
      dashboardActions.setDashBoardMenu({ dashboardMenu: modules });
    } catch (error) {}
  }

  receivedNotification = notification => {
    PushNotificationIOS.setApplicationIconBadgeNumber(0);
    const { navigation } = this.props;
    navigation.navigate('Sync', { headerTitle: labels.SYNC });
  };

  updateState(state) {
    this.setState(state);
  }

  onGridItemPressHandler = async (route, id, label) => {
    const { dashboardActions } = this.props;
    await dashboardActions.setSelectedMenu(id);
    this.props.navigation.navigate(route, { headerTitle: label });
  };

  renderItem = item => {
    return (
      <DashboardItem onPressed={this.onGridItemPressHandler} item={item.item} />
    );
  };

  getGridData = (data, column) => {
    const gridData = [...data];
    var count = gridData.length % column;

    for (let i = 0; i < column - count; i++) {
      gridData.push({});
    }
    return gridData;
  };
  _keyExtractor = (item, index) => `${index}`;
  render() {
    const { dashboardMenu, numOfColumn } = this.state;
    const list = dashboardMenu.filter(menu => menu.enabled);
    return (
      <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
        {dashboardMenu ? (
          <FlatList
            keyExtractor={this._keyExtractor}
            horizontal={false}
            numColumns={numOfColumn}
            data={this.getGridData(list, numOfColumn)}
            renderItem={this.renderItem}
          />
        ) : (
          <Loader />
        )}
      </SafeAreaView>
    );
  }
}

export default Dashboard;
