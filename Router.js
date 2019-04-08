import React from 'react';
import { Text, StyleSheet, Dimensions, Alert } from 'react-native';
import {
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator
} from 'react-navigation';

import LoginForm from './src/screens/auth/LoginForm';
import Dashboard from './src/screens/dashboard';
import Main from './src';
import Route from './src/screens/customers';
import Customer from './src/screens/customers/customer';
import SideMenu from './src/components/SideMenu';
import withSideBar from './src/hoc/withSideBar';
import ButtonRound from './src/components/common/ButtonRound';
import Inventory from './src/screens/inventory';
import NewStockRequest from './src/screens/inventory/stockRequest/NewStockRequest';
import Admin from './src/screens/admin';
import Messaging from './src/screens/messaging';
import Performance from './src/screens/performance';
import ChartDetails from './src/screens/performance/ChartDetails';
import Products from './src/screens/products';
import ProductDetail from './src/screens/products/product-details';
import Report from './src/screens/report';
import ReportPdf from './src/screens/report/ReportPdf';
import Summary from './src/screens/summary';
import Sync from './src/screens/sync';
import CustomerDetails from './src/screens/customers/customer/detail';
import CustomerEdit from './src/screens/customers/customer/detail/Info';
import CustomerPyment from './src/screens/customers/customer/payment';
import Neworder from './src/screens/neworder';
import Promotions from './src/screens/customers/customer/promotions';
import mapStateAndProps from './src/hoc/mapStateAndProps';
import globalConnector from './src/store/connector/globalConnector';
import deviceOrientationAndInfo from './src/hoc/deviceOrientationAndInfo';
import deviceCurrentLocationListener from './src/hoc/deviceCurrentLocationListener';
import withInAppNotification from './src/hoc/withInAppNotification';
import { NavigationActions, StackActions } from 'react-navigation';
import ViewPDF from './src/screens/neworder/Invoice/viewPDF';
import { compose } from 'recompose';

import { APP_FONTS, APP_THEME, APP_ROUTE } from './src/constants';
import { labels } from './src/stringConstants';

import { logoutMCSUser, eraseDatabase } from './src/services/omcClient';
import CustomerAll from './src/screens/customers/customer/CustomerAll';

const styles = StyleSheet.create({
  //If need title start from left the put alginSelf:'flex-start', marginLeft:-30, textAlign: 'left'
  headerTitle: {
    alignSelf: 'center',
    fontSize: 15,
    fontWeight: 'bold',
    width: Dimensions.width,
    alignItems: 'center',
    color: APP_THEME.APP_BASE_FONT_COLOR,
    padding: 5,
    fontFamily: APP_FONTS.FONT_REGULAR
  }
});
const stackNavigaterOptions = (title, leftButton, rightButton) => {
  return {
    headerTitle: title.toUpperCase(),
    headerStyle: {
      backgroundColor: APP_THEME.APP_BASE_COLOR
    },
    headerTintColor: APP_THEME.APP_BASE_FONT_COLOR,
    headerTitleStyle: {
      fontWeight: 'bold',
      fontFamily: APP_FONTS.FONT_BOLD
    },
    headerLeft: leftButton,
    headerRight: rightButton
  };
};

let enhance = compose(
  globalConnector,
  withSideBar,
  withInAppNotification,
  deviceOrientationAndInfo
);

const enhanceSideBar = compose(
  globalConnector,
  deviceOrientationAndInfo
);

let EnhancedSideMenu = enhanceSideBar(SideMenu);

const getRouteScreen = (component, title, rightButton) => {
  return {
    screen: props => {
      const EnhancedScreen = enhance(component);
      return <EnhancedScreen {...props} />;
    },
    navigationOptions: ({ navigation }) =>
      stackNavigaterOptions(
        (navigation.state.params && navigation.state.params.headerTitle) ||
          title,
        <ButtonRound onPress={() => navigation.pop()}></ButtonRound>,
        rightButton
      )
  };
};

const logOutUser = navigation => async () => {
  Alert.alert(
    '',
    labels.LOGOUT_MESSAGE,
    [
      {
        text: labels.CANCEL,
        onPress: () => {},
        style: 'cancel'
      },
      {
        text: labels.OK,
        onPress: async () => {
          try {
            await eraseDatabase();
            await logoutMCSUser();
            navigation.navigate('Auth');
            navigation.dispatch({
              type: 'USER_LOGOUT'
            });
          } catch (error) {}
        }
      }
    ],
    { cancelable: false }
  );
};

const AppDrawer = createDrawerNavigator(
  {
    Dashboard: createStackNavigator({
      Dashboard: {
        screen: props => {
          let enhance = compose(
            globalConnector,
            withInAppNotification
          );
          let EnhancedDashboard = enhance(Dashboard);
          return <EnhancedDashboard {...props} />;
        },
        headerMode: 'float',
        navigationOptions: ({ navigation }) =>
          stackNavigaterOptions(
            labels.DASHBOARD,
            null,
            <ButtonRound onPress={logOutUser(navigation)}></ButtonRound>
          )
      },
      Route: getRouteScreen(Route, labels.ROUTE),
      Customer: getRouteScreen(Customer, labels.CUSTOMERS),
      Products: getRouteScreen(Products, labels.PRODUCTS),
      Products: getRouteScreen(Products, labels.PRODUCTS),
      Sync: getRouteScreen(Sync, labels.SYNC),
      Messaging: getRouteScreen(Messaging, labels.MESSAGING),
      Report: getRouteScreen(Report, labels.REPORT),
      ReportPdf: getRouteScreen(ReportPdf, labels.REPORT_SUMMARY),
      Summary: getRouteScreen(Summary, labels.SUMMARY),
      Inventory: getRouteScreen(Inventory, labels.INVENTORY),
      NewStockRequest: getRouteScreen(
        NewStockRequest,
        '',
        <ButtonRound onPress={() => {}}></ButtonRound>
      ),
      Performance: getRouteScreen(Performance, labels.PERFORMANCE),
      ChartDetails: getRouteScreen(ChartDetails, ''),
      Admin: getRouteScreen(Admin, labels.ADMIN),
      ProductDetail: getRouteScreen(ProductDetail, labels.PRODUCT_DETAIL),
      CustomerDetail: getRouteScreen(CustomerDetails),

      CustomerEdit: getRouteScreen(CustomerEdit),
      CustomerPayment: getRouteScreen(CustomerPyment),
      Promotions: getRouteScreen(Promotions, labels.PROMOTIONS),
      CustomerPayment: getRouteScreen(CustomerPyment),
      Neworder: getRouteScreen(Neworder, labels.NEW_ORDER),
      ViewPDF: getRouteScreen(ViewPDF),
      CustomerAll: getRouteScreen(Customer, labels.CUSTOMERS)
    })
  },
  {
    initialRouteName: APP_ROUTE.DASHBOARD,
    drawerPosition: 'right',
    drawerLockMode: 'locked-closed',
    contentComponent: props => <EnhancedSideMenu {...props} />,
    drawerWidth: 550
  }
);

const AuthStack = createStackNavigator({
  SignIn: {
    screen: props => {
      let enhance = compose(globalConnector);
      let EnhancedLogin = enhance(LoginForm);
      return <EnhancedLogin {...props} />;
    },
    navigationOptions: {
      header: null
    }
  }
});

export default createSwitchNavigator(
  {
    App: AppDrawer,
    AuthLoading: Main,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading',
    navigationOptions: {
      drawerLockMode: 'locked-closed'
    }
  }
);
