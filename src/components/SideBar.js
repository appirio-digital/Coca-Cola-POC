import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Alert,
  NetInfo,
  AsyncStorage
} from 'react-native';
import { APP_THEME } from '../constants';
import { labels } from '../stringConstants';
import { eraseDatabase, logoutMCSUser } from '../services/omcClient';
import onlineIcon from '../images/online.png';
import offlineIcon from '../images/offline.png';

class SideBar extends Component {
  state = {
    selectedMenu: 0,
    dashboardMenu: [],
    isOnline: true
  };

  componentWillUnmount() { }

  async componentDidMount() {
    const {
      dashboard: { dashboardMenu, selectedMenu }
    } = this.props;
    this.setState({ dashboardMenu, selectedMenu });
    const ForceOfflineFlag = await AsyncStorage.getItem('ForceOfflineFlag');
    console.log('ForceOfflineFlag', ForceOfflineFlag);
    this.setState({ isOnline: ForceOfflineFlag != 'true' });
  }
  nevigateToScreen = async (route, id, label) => {
    const { dashboardActions } = this.props;
    await dashboardActions.setSelectedMenu(id);
    this.props.navigation.navigate(route, { headerTitle: label });
  };
  renderItem = item => {
    const { image, id, route, label } = item.item;
    const color = id == this.state.selectedMenu ? '#cccccc' : '#fff';
    return (
      <TouchableOpacity
        style={[
          {
            flex: 1,
            width: 60,
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            borderColor: APP_THEME.APP_SIDEBAR_SEPERATER_COLOR,
            borderBottomWidth: 1,
            backgroundColor: color
          }
        ]}
        onPress={() => this.nevigateToScreen(route, id, label)}
      >
        <Image style={styles.sideBarImage} source={image} />
      </TouchableOpacity>
    );
  };

  updateOnlineStatus = async status => {
    const { dashboardActions } = this.props;

    await dashboardActions.setUserOnlineStatus(status);
  };

  confirmStatusChange = async () => {
    const ForceOfflineFlag = await AsyncStorage.getItem('ForceOfflineFlag');
    const ForceOfflineFlagBool = ForceOfflineFlag != 'true'; //true

    const isNetworkConnected = await AsyncStorage.getItem(
      'networkConnectivity'
    );

    if (!ForceOfflineFlagBool && isNetworkConnected == 'false') {
      console.log('ALERT');
      Alert.alert(
        labels.NO_CONNECTIVITY_ERROR,
        labels.NO_CONNECTIVITY_ERROR_MESSAGE,
        [
          {
            text: labels.OK
          }
        ]
      );
    } else {
      Alert.alert(
        labels.ONLINE_STATUS,
        ForceOfflineFlagBool
          ? labels.ONLINE_TO_OFFLINE_STATUS_CHANGE_MESSAGE
          : labels.OFFLINE_TO_ONLINE_STATUS_CHANGE_MESSAGE,
        [
          {
            text: labels.YES,
            onPress: () => this.updateOnlineStatus(!ForceOfflineFlagBool)
          },
          {
            text: labels.NO,
            onPress: () => { },
            style: 'cancel'
          }
        ]
      );
    }
  };

  logOutUser = () => async () => {
    Alert.alert(
      '',
      labels.LOGOUT_MESSAGE,
      [
        {
          text: labels.CANCEL,
          onPress: () => { },
          style: 'cancel'
        },
        {
          text: labels.OK,
          onPress: async () => {
            try {
              await eraseDatabase();
              await logoutMCSUser();
              this.props.navigation.navigate('Auth');
              this.props.navigation.navigation.dispatch({
                type: 'USER_LOGOUT'
              });
            } catch (error) { }
          }
        }
      ],
      { cancelable: false }
    );
  };

  componentWillReceiveProps(newProps) {
    const {
      dashboard: { isOnline }
    } = newProps;
    if (this.state.isOnline !== isOnline) this.setState({ isOnline });
  }
  _keyExtractor = (item, index) => `${index}`;
  render() {
    const { dashboardMenu } = this.state;
    const list = dashboardMenu.filter(menu => menu.enabled);
    return (
      <View style={styles.sideBarContainer}>
        <TouchableOpacity
          style={[
            {
              width: 60,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: APP_THEME.APP_SIDEBAR_SEPERATER_COLOR,
              borderBottomWidth: 1
            }
          ]}
          onPress={this.logOutUser()}
        >
          <Image
            style={styles.sideBarImage}
            source={require('../images/logout-sm.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            {
              width: 60,
              height: 60,
              justifyContent: 'center',
              alignItems: 'center',
              borderColor: APP_THEME.APP_SIDEBAR_SEPERATER_COLOR,
              borderBottomWidth: 1
            }
          ]}
          onPress={() => {
            this.confirmStatusChange();
          }}
        >
          <Image
            key={this.state.isOnline ? onlineIcon : offlineIcon}
            style={styles.sideBarImage}
            source={this.state.isOnline ? onlineIcon : offlineIcon}
          />
        </TouchableOpacity>
        <FlatList
          keyExtractor={this._keyExtractor}
          data={list}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}
export default SideBar;

const styles = StyleSheet.create({
  sideBarContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    elevation: 10
  },
  sideBarImage: {
    flex: 1,
    width: 30,
    height: 30,
    resizeMode: 'contain'
  }
});
