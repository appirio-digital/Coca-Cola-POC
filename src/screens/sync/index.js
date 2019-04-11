import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  NetInfo,
  NativeModules,
  ActivityIndicator,
  AsyncStorage
} from 'react-native';
import moment from 'moment';
import {
  APP_FONTS,
  APP_THEME,
  ASYNC_STORAGE_SYNC_DATE_KEY
} from '../../constants';
import { labels } from '../../stringConstants';
import Loader from '../../components/common/Loader';
import onlineIcon from '../../images/online-lg.png';
import offlineIcon from '../../images/offline-lg.png';

import {
  //New-start
  hasCollectionRecordsToReload,
  //New-end
  syncData,
  eraseDatabase,
  hasLocalDatabaseRecords
} from '../../services/omcClient';

class Customers extends Component {
  state = {
    isDataSyncComplete: false,
    dataSyncStatusMessage: '',
    isOnline: true,
    isPendingRecords: false,
    isPendingTransaction: false,
    isPendingTransactionWithFailedRecords: false,
    isConnected: true,
    isDatabaseErased: false,
    isLoading: false
  };

  checkConnectivity = async () => {
    const ForceOfflineFlag = await AsyncStorage.getItem('ForceOfflineFlag');
    const ForceOfflineFlagBool = ForceOfflineFlag != 'true';

    this.setState({
      isOnline: ForceOfflineFlagBool,
      isConnected: ForceOfflineFlagBool,
      isDataSyncComplete: ForceOfflineFlagBool,
      dataSyncStatusMessage: ForceOfflineFlagBool
        ? ''
        : labels.NO_CONNECTIVITY_ERROR_MESSAGE
    });
  };

  async componentDidMount() {
    this.__isMounted = true;
    this.checkConnectivity();
    //this.updateOnlineStatus(isConnected);

    this.checkForPendingRecords();
  }

  componentWillUnmount() {
    this.__isMounted = false;
    NetInfo.isConnected.removeEventListener(
      labels.CHECK_INTERNET_CONNECTIVITY,
      this.handleConnectivityChange
    );
  }

  componentWillReceiveProps(newProps) {
    this.checkConnectivity();
  }

  checkForPendingRecords = async () => {
    this.setState({
      isPendingTransactionWithFailedRecords: false,
      isPendingTransaction: false
    });
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
      const { isOnline } = this.state;
      Alert.alert(
        labels.ONLINE_STATUS,
        isOnline
          ? labels.ONLINE_TO_OFFLINE_STATUS_CHANGE_MESSAGE
          : labels.OFFLINE_TO_ONLINE_STATUS_CHANGE_MESSAGE,
        [
          {
            text: labels.YES,
            onPress: () => this.updateOnlineStatus(!isOnline)
          },
          {
            text: labels.NO,
            onPress: () => {},
            style: 'cancel'
          }
        ]
      );
    }
  };

  confirmErasedLocalDatabase = () => {
    Alert.alert(
      labels.ERASED_DATABASE_TITLE,
      labels.ERACED_LOCAL_DATABSED_ALERT_MESSAGE,
      [
        {
          text: labels.YES,
          onPress: () => {
            this.setState({
              isDataSyncComplete: false,
              dataSyncStatusMessage: 'Local data erased!'
            });
          }
        },
        {
          text: labels.NO,
          onPress: () => {},
          style: 'cancel'
        }
      ]
    );
  };

  onEraseLocalDatabaseClick = () => {
    const { customersActions } = this.props;
    const request = async () => {
      try {
        const response = await eraseDatabase();
        customersActions.resetCustomers();
        this.setState({ isDatabaseErased: true });
        AsyncStorage.removeItem(ASYNC_STORAGE_SYNC_DATE_KEY);
      } catch (error) {}
    };
    request();
  };

  onSyncNowClick = () => {
    if (this.state.isOnline) {
      if (this.state.isConnected) {
        Alert.alert(labels.SYNC_NOW_MESSAGE, labels.SYNC_NOW_ALERT_MESSAGE, [
          {
            text: labels.FULL_SYNC,
            onPress: () => this.syncMimic(true)
          },
          {
            text: labels.PARTIAL_SYNC,
            onPress: () => this.syncMimic(false)
          },
          {
            text: labels.NO,
            onPress: () => {},
            style: 'cancel'
          }
        ]);
      } else {
        this.setState({
          isDataSyncComplete: false,
          dataSyncStatusMessage: labels.NO_CONNECTIVITY_ERROR_MESSAGE
        });
      }
    } else {
      this.setState({
        isDataSyncComplete: false,
        dataSyncStatusMessage: labels.SYNC_OFFLINE_MODE_MESSAGE
      });
      this.props.syncActions.updateIsDataSyncing(false);
    }
  };

  onSyncNowClickOLD = () => {
    if (this.state.isOnline) {
      if (this.state.isConnected) {
        Alert.alert(labels.SYNC_NOW_MESSAGE, labels.SYNC_NOW_ALERT_MESSAGE, [
          {
            text: labels.FULL_SYNC,
            onPress: () => this.syncRecordsFromRemoteServer(true)
          },
          {
            text: labels.PARTIAL_SYNC,
            onPress: () => this.syncRecordsFromRemoteServer(false)
          },
          {
            text: labels.NO,
            onPress: () => {},
            style: 'cancel'
          }
        ]);
      } else {
        this.setState({
          isDataSyncComplete: false,
          dataSyncStatusMessage: labels.NO_CONNECTIVITY_ERROR_MESSAGE
        });
      }
    } else {
      this.setState({
        isDataSyncComplete: false,
        dataSyncStatusMessage: labels.SYNC_OFFLINE_MODE_MESSAGE
      });
      this.props.syncActions.updateIsDataSyncing(false);
    }
  };

  syncMimic = async isFullSync => {
    const {
      auth: {
        profile: { __ORACO__DistributionCentre_c }
      },
      syncActions: { updateIsDataSyncing }
    } = this.props;

    this.setState({ dataSyncStatusMessage: '', isLoading: true });
    updateIsDataSyncing(true);
    setTimeout(() => {
      this.updateSuccessState();
    }, 3000);
  };

  syncRecordsFromRemoteServer = async isFullSync => {
    const {
      auth: {
        profile: { __ORACO__DistributionCentre_c }
      },
      syncActions: { updateIsDataSyncing }
    } = this.props;

    if (isFullSync) {
      NativeModules.SyncManager.removeAllStoredCollections();
    }
    this.setState({ dataSyncStatusMessage: '', isLoading: true });
    updateIsDataSyncing(true);

    try {
      const offSyncStatus = await NativeModules.SyncManager.uploadOfflineResourcesToServer();
      this.checkForPendingRecords();
      if (offSyncStatus) {
        const syncResponse = await syncData(
          true,
          __ORACO__DistributionCentre_c
        );
        if (syncResponse) {
          this.updateSuccessState();
        } else {
          this.updateErrorState();
        }
      } else {
        this.updateErrorState();
      }
    } catch (error) {
      this.updateErrorState();
    }
  };

  updateSuccessState = () => {
    this.setState({
      isDataSyncComplete: true,
      dataSyncStatusMessage: labels.SYNC_COMPLETED,
      isLoading: false
    });
    //this.props.syncActions.updateIsDataSyncing(false);
    AsyncStorage.setItem(ASYNC_STORAGE_SYNC_DATE_KEY, moment().toString());
    //this.props.customersActions.getTodaysActivities();
  };

  updateErrorState = () => {
    this.setState({
      isDataSyncComplete: false,
      dataSyncStatusMessage: labels.SOMETHING_WENT_WRONG,
      isLoading: false
    });
    // this.props.syncActions.updateIsDataSyncing(false);
    AsyncStorage.removeItem(ASYNC_STORAGE_SYNC_DATE_KEY);
  };

  renderSyncLabel = () => {
    const { syncPendingIconStyle, syncPendingTextStyle, spaceStyle } = Styles;
    const {
      isPendingTransaction,
      isPendingTransactionWithFailedRecords
    } = this.state;
    if (isPendingTransaction || isPendingTransactionWithFailedRecords) {
      const text = isPendingTransaction
        ? labels.SYNC_PENDING_MESSAGE
        : labels.SYNC_PENDING_FAILED_MESSAGE;
      return (
        <View style={spaceStyle}>
          <Text style={syncPendingIconStyle}></Text>
          <Text style={syncPendingTextStyle}>{text}</Text>
        </View>
      );
    }
  };

  //Render Footer Section - For Sync Fail Success message
  renderFooterSection = () => {
    const { isDataSyncComplete, dataSyncStatusMessage } = this.state;
    const {
      syncFailViewStyle,
      syncFailureIconStyle,
      syncFailureTextStyle,
      syncSuccessTextStyle,
      syncSuccessIconStyle,
      syncSuccessViewStyle
    } = Styles;

    return (
      <View
        style={isDataSyncComplete ? syncSuccessViewStyle : syncFailViewStyle}
      >
        {dataSyncStatusMessage.length > 0 && (
          <Text
            style={
              (isDataSyncComplete && syncSuccessIconStyle) ||
              syncFailureIconStyle
            }
          >
            
          </Text>
        )}
        <Text
          style={
            (isDataSyncComplete && syncSuccessTextStyle) || syncFailureTextStyle
          }
        >
          {dataSyncStatusMessage}
        </Text>
      </View>
    );
  };
  render() {
    const {
      mainContainerStyle,
      statusImageStyle,
      statusOnlineTextStyle,
      statusOfflineTextStyle,
      statusTapToGoStyle,
      erasedDatabaseMessageStyle,
      erasedDatabaseButtonStyle,
      eraseDatabaseButtonStyle,
      databaseErasedIconStyle,
      databaseErasedMessageStyle,
      syncNowViewStyle,
      syncNowImageStyle,
      syncNowTitleStyle,
      syncPendingIconStyle,
      syncPendingTextStyle,
      spaceStyle
    } = Styles;

    const {
      isOnline,
      isDatabaseErased,
      isPendingTransaction,
      isPendingTransactionWithFailedRecords,
      isLoading
    } = this.state;

    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          backgroundColor: '#fff'
        }}
      >
        <View style={{ flex: 1 }}>
          <View style={mainContainerStyle}>
            <TouchableOpacity
              style={{ alignItems: 'center', justifyContent: 'center' }}
              onPress={() => {
                this.confirmStatusChange();
              }}
            >
              <Image
                key={isOnline ? onlineIcon : offlineIcon}
                style={statusImageStyle}
                source={isOnline ? onlineIcon : offlineIcon}
              />

              <View style={{ alignItems: 'center' }}>
                <Text
                  style={
                    (isOnline && statusOnlineTextStyle) ||
                    statusOfflineTextStyle
                  }
                >
                  {(isOnline && labels.SYNC_ONLINE) || labels.SYNC_OFFLINE}
                </Text>

                <View style={spaceStyle}>
                  <Text style={statusTapToGoStyle}>{labels.TAP_TO_GO}</Text>
                  <Text
                    style={{
                      fontFamily: APP_FONTS.FONT_SEMIBOLD,
                      fontSize: 15,
                      paddingLeft: 10,
                      color: isOnline ? '#999999' : APP_THEME.APP_BASE_COLOR
                    }}
                  >
                    {(isOnline && labels.SYNC_OFFLINE) || labels.SYNC_ONLINE}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            <View style={{ padding: 28 }}>
              <TouchableOpacity onPress={this.confirmErasedLocalDatabase}>
                <View style={eraseDatabaseButtonStyle}>
                  <Text
                    style={{
                      fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
                      fontSize: 16,
                      color: APP_THEME.APP_BASE_COLOR
                    }}
                  >
                    
                  </Text>

                  <Text style={erasedDatabaseButtonStyle}>
                    {labels.SYNC_ERASE_LOCAL_DATABASE}
                  </Text>
                </View>
              </TouchableOpacity>
              {isDatabaseErased && (
                <View style={erasedDatabaseMessageStyle}>
                  <Text style={databaseErasedIconStyle}></Text>
                  <Text style={databaseErasedMessageStyle}>
                    {labels.ERASED_SUCCESSFULLY_MESSAGE}
                  </Text>
                </View>
              )}
            </View>
            <View style={{ paddingTop: 80 }}>
              <TouchableOpacity
                onPress={this.onSyncNowClick}
                disabled={isLoading}
              >
                <View style={syncNowViewStyle}>
                  <Image
                    style={syncNowImageStyle}
                    source={require('../../images/sync-icon.png')}
                  />
                  <Text style={syncNowTitleStyle}>
                    {labels.SYNC_NOW_MESSAGE}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 10, margin: 40 }}>
              {this.renderSyncLabel()}
              {this.renderFooterSection()}
            </View>
          </View>
          {isLoading && <Loader message={labels.SYNC_INPROGRESS_MESSAGE} />}
        </View>
      </ScrollView>
    );
  }
}

export default Customers;

const Styles = {
  mainContainerStyle: {
    paddingTop: 35,
    paddingBottom: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    marginRight: 10,
    marginLeft: 80
  },
  erasedDatabaseButtonStyle: {
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 16,
    paddingLeft: 10,
    color: APP_THEME.APP_BASE_COLOR
  },
  erasedDatabaseMessageStyle: {
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  syncFailViewStyle: {
    paddingTop: 50,
    flexDirection: 'row'
  },
  syncSuccessViewStyle: {
    paddingTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  mainContainerStyleFlex2: {
    flex: 2,
    justifyContent: 'flex-end'
  },
  spaceStyle: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  statusImageStyle: {
    width: 175,
    height: 175,
    resizeMode: 'contain',
    paddingTop: 36
  },
  statusOnlineTextStyle: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 36,
    paddingTop: 10,
    alignItems: 'center'
  },
  statusOfflineTextStyle: {
    color: '#999999',
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 36,
    paddingTop: 10,
    alignItems: 'center'
  },
  statusTapToGoStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 15
  },
  eraseDatabaseButtonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    height: 40,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: APP_THEME.APP_BASE_COLOR
  },
  databaseErasedIconStyle: {
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 20,
    color: APP_THEME.APP_BASE_COLOR
  },
  databaseErasedMessageStyle: {
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 20,
    color: APP_THEME.APP_BASE_COLOR,
    paddingLeft: 10
  },
  syncNowContainerView: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center'
  },
  syncNowViewStyle: {
    borderWidth: 1,
    borderColor: APP_THEME.APP_BASE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    width: 170,
    height: 170,
    borderRadius: 10,
    paddingBottom: 15,
    paddingTop: 15
  },
  syncNowImageStyle: {
    width: 82,
    height: 82
  },
  syncNowTitleStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 20,
    color: APP_THEME.APP_BASE_COLOR,
    textAlign: 'center'
  },
  syncPendingTextStyle: {
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 20,
    color: '#F5A623',
    paddingLeft: 10,
    paddingTop: 30
  },
  syncPendingIconStyle: {
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 20,
    color: '#F5A623',
    paddingTop: 30
  },
  syncFailureTextStyle: {
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 20,
    color: '#D0021B',
    paddingLeft: 10
  },
  syncSuccessTextStyle: {
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 20,
    color: APP_THEME.APP_BASE_COLOR,
    paddingLeft: 10
  },
  syncFailureIconStyle: {
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 20,
    color: '#D0021B',
    paddingTop: 2
  },
  syncSuccessIconStyle: {
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 20,
    color: APP_THEME.APP_BASE_COLOR
  }
};
