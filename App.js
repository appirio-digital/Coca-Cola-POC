import React, { Component } from 'react';
import {
  NetInfo,
  NativeModules,
  AsyncStorage,
  PushNotificationIOS
} from 'react-native';
import { Provider } from 'react-redux';
import initSubscriber from 'redux-subscriber';
import { createStore } from './src/store';
import Main from './src';
import Router from './Router';
import { labels } from './src/stringConstants';
//import PushNotification from 'react-native-push-notification';
import firebase, { RemoteMessage } from 'react-native-firebase';

const store = createStore();
initSubscriber(store);
/**
 * Root application.
 */

process.nextTick = setImmediate;

export default class App extends Component {
  async componentDidMount() {
    console.disableYellowBox = true;

    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );

    if (!(await firebase.messaging().hasPermission())) {
      try {
        await firebase.messaging().requestPermission();
      } catch (e) {
        alert('Failed to grant permission');
      }
    }

    const fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      // user has a device token
      console.log('Tokan:', fcmToken);
    } else {
      // user doesn't have a device token yet
    }

    this.messageListener = firebase.messaging().onMessage(message => {
      // Process your message as required
      console.log(message);
    });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
    this.messageListener();
  }

  handleConnectivityChange = async isConnected => {
    const ForceOfflineFlag = await AsyncStorage.getItem('ForceOfflineFlag');
    if (ForceOfflineFlag) {
      NativeModules.SyncManager.setOfflineMode({
        connectivity: isConnected && ForceOfflineFlag != 'true'
      });
    } else {
      NativeModules.SyncManager.setOfflineMode({ connectivity: isConnected });
      AsyncStorage.setItem('ForceOfflineFlag', 'false');
    }
    AsyncStorage.setItem('networkConnectivity', `${isConnected}`);
  };

  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}
