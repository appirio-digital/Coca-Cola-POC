import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  AsyncStorage
} from 'react-native';
import isEmpty from 'lodash/isEmpty';
import findKey from 'lodash/findKey';
import { APP_FONTS, APP_THEME, ACTIVITY_STATUS_LOV } from '../../../constants';
import RouteListRow from './RouteListRow';
import { labels } from '../../../stringConstants';
import DataFilter from '../../../components/DateFilter';
import { Button, IconButton } from '../../../components/common';
import Map from './Map';
import {
  isAfter,
  isBefore,
  formatDateMMDD,
  getToDateForRegion,
  getCurrentTimeInGMT,
  getCurrentDateInGMT,
  getCurrentTimestampInGMT,
  isDateValid
} from '../../../utility';
import Loader from '../../../components/common/Loader';
import {
  createNewObject,
  API_NAME,
  API_END_POINT,
  SyncPinPriority,
  API_NAME_POC,
  fetchObjectCollection,
  JTI_API
} from '../../../services/omcClient';

import find from 'lodash/find';

class Route extends Component {
  state = {
    fromDate: '',
    toDate: '',
    activityList: [],
    customersList: [],
    loading: false,
    renderedMap: false,
    coordinate: '',
    routeId: '',
    plate: '',
    routeHistory: null,
    routeName: '',
    isCheckoutForDay: false,
    isEndingDay: false,
    checkInId: '',
    isStartingDay: false,
    noVisitInprogress: true,
    refresh: true,
    inRoute: false
  };

  activityItemClickHandler = async activity => {
    

  alert('Checkin success!')

    const {
      id,
      activitynumber,
      statuscode,
      checkinlatitude,
      checkinlongitude
    } = activity;
    if (statuscode == ACTIVITY_STATUS_LOV.COMPLETE) {
      return;
    }
    this.setState({
      loading: true
    });

    const { latitude, longitude } = this.state.coordinate;
    const isCheckIn =
      !isEmpty(statuscode) && statuscode !== ACTIVITY_STATUS_LOV.IN_PROGRESS
        ? true
        : isEmpty(statuscode)
        ? true
        : false;
    const trimmedLatitude = `${
      isNaN(Math.round(latitude * 100) / 100)
        ? 0
        : Math.round(latitude * 100) / 100
    }`;
    const trimmedLongitude = `${
      isNaN(Math.round(longitude * 100) / 100)
        ? 0
        : Math.round(longitude * 100) / 100
    }`;

    var checkInLatitude = '';
    var checkInLongitude = '';
    if (checkinlatitude) {
      checkInLatitude = `${
        isNaN(Math.round(checkinlatitude * 100) / 100)
          ? 0
          : Math.round(checkinlatitude * 100) / 100
      }`;
    }
    if (checkinlongitude) {
      checkInLongitude = `${
        isNaN(Math.round(checkinlongitude * 100) / 100)
          ? 0
          : Math.round(checkinlongitude * 100) / 100
      }`;
    }

    try {
      const request = isCheckIn
        ? {
            id: id,
            activitynumber: activitynumber,
            checkinlongitude: trimmedLongitude,
            checkinlatitude: trimmedLatitude,
            checkintime: getCurrentTimeInGMT(),
            statuscode: ACTIVITY_STATUS_LOV.IN_PROGRESS
          }
        : {
            id: id,
            activitynumber: activitynumber,
            checkouttime: getCurrentTimeInGMT(),
            checkoutlongitude: trimmedLongitude,
            checkoutlatitude: trimmedLatitude,
            checkinlongitude: checkInLongitude,
            checkinlatitude: checkInLatitude,
            statuscode: ACTIVITY_STATUS_LOV.COMPLETE
          };

      this.setState({ loading: true });
      const response = await createNewObject(
        request,
        JTI_API,
        API_END_POINT.ACTIVITY,
        'activitynumber',
        SyncPinPriority.Normal
      );
      const selectedId = '';
      if (
        response.success &&
        !isEmpty(response.object) &&
        response.object.statuscode == ACTIVITY_STATUS_LOV.IN_PROGRESS
      ) {
        selectedId = id;
      }
      const {
        locationsActions: { resetMap }
      } = this.props;
      resetMap();
      this.setFilterDate({
        from: this.state.fromDate,
        to: this.state.toDate
      });
      const completedActivity = this.state.activityList.filter(
        activity => activity.statuscode == ACTIVITY_STATUS_LOV.COMPLETE
      );
      const inProgressActivity = this.state.activityList.filter(
        activity => activity.statuscode == ACTIVITY_STATUS_LOV.IN_PROGRESS
      );
      this.setState({
        loading: false,
        renderedMap: false,
        checkInId: selectedId,
        isCheckoutForDay:
          !isEmpty(completedActivity) &&
          completedActivity.length === this.state.activityList.length,
        noVisitInprogress: isEmpty(inProgressActivity),
        refresh: true
      });
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  checkNetworkConnectivity = async () => {
    const isConnected = await AsyncStorage.getItem('networkConnectivity');
    this.setState({ isNetConnected: isConnected == 'true' });
  };

  async componentDidMount() {
    const {
      locationsActions: { resetMap, getDeviceLocation },
      customers: { fromDate, toDate },
      auth: { profile },
      stockActions: { getRouteAllocation }
    } = this.props;

    this.checkNetworkConnectivity();

    if (!(fromDate && toDate && isDateValid(fromDate) && isDateValid(toDate))) {
      this.setState({
        fromDate: formatDateMMDD(new Date()),
        toDate: getToDateForRegion(
          profile && profile.PrimaryCountry_c == 'CA' ? 9 : 4
        )
      });
      this.setFilterDate({
        from: fromDate,
        to: toDate
      });
    } else {
      this.setState({ fromDate, toDate });
      this.setFilterDate({
        from: fromDate,
        to: toDate
      });
    }

    getDeviceLocation();
    resetMap();
    this.setState({ renderedMap: false, loading: true });
    try {
      const routeAllocation = await fetchObjectCollection(
        API_NAME,
        API_END_POINT.ROUTE_ALLOCATION
      );

      const route = await fetchObjectCollection(API_NAME, API_END_POINT.ROUTE);

      const routeHistory = await fetchObjectCollection(
        API_NAME_POC,
        API_END_POINT.ROUTE_CHIECKIN
      );

      const routeId = '';
      const routeName = '';
      const plate = '';
      if (!isEmpty(routeAllocation)) {
        routeId = routeAllocation[0].__ORACO__Route_Id_c;
        routeName = routeAllocation[0].__ORACO__Route_c;
      }

      if (!isEmpty(route)) {
        plate = routeAllocation[0].__ORACO__Plate_c;
      }

      if (!isEmpty(routeHistory)) {
        const today = getCurrentDateInGMT();
        const history = find(
          routeHistory,
          item => item.__ORACO__Date_c == today
        );
        if (history) {
          const isStartingDay =
            !isEmpty(history.__ORACO__CheckInTime_c) &&
            isEmpty(history.__ORACO__CheckOutTime_c)
              ? true
              : false;
          this.setState({ routeHistory: history, isStartingDay });
        }
      }

      this.setState({ routeId, plate, routeName, loading: false });
    } catch (error) {
      console.log('Error', error);
      this.setState({ loading: false });
    }
  }

  configureMap = async () => {
    const isConnected = await AsyncStorage.getItem('networkConnectivity');
    this.setState({ isNetConnected: isConnected == 'true' }, () => {
      if (this.state.isNetConnected) {
        const {
          locationsActions: {
            setOrigin,
            setDestination,
            setWaypointsArray,
            fetchRoute
          },
          customers: { activityList, loading, customersList, fromDate, toDate },
          locations: {
            origin: { coordinate }
          }
        } = this.props;
        if (!isEmpty(activityList)) {
          setOrigin(activityList[0]);
          setDestination(activityList[activityList.length - 1]);
          setWaypointsArray(activityList.slice(1, activityList.length - 1));
        }

        this.setState({
          renderedMap: true
        });
        fetchRoute();
      }
    });
  };

  componentWillReceiveProps(newProps) {
    const {
      customers: { activityList, loading, customersList, fromDate, toDate },
      locations: {
        origin: { coordinate }
      }
    } = newProps;

    this.setState({
      activityList,
      customersList,
      fromDate: fromDate,
      toDate: toDate,
      loading,
      coordinate: coordinate ? coordinate : ''
    });

    if (this.state.renderedMap === false && !isEmpty(activityList)) {
      this.configureMap();
      const checkInActivity = activityList.filter(
        activity => activity.statuscode == ACTIVITY_STATUS_LOV.IN_PROGRESS
      );
      const completedActivity =
        activityList &&
        activityList.filter(
          activity => activity.statuscode == ACTIVITY_STATUS_LOV.COMPLETE
        );
      let checkInID = '';
      if (this.state.checkInId) {
        checkInID = this.state.checkInId;
      } else {
        checkInID = !isEmpty(checkInActivity) ? checkInActivity[0].id : '';
      }
      this.setState({
        checkInId: checkInID,
        isCheckoutForDay:
          !isEmpty(completedActivity) &&
          completedActivity.length === activityList.length,
        noVisitInprogress: isEmpty(checkInActivity),
        refresh: true
      });
    }
  }

  fromDateChangeHandler = date => {
    this.setState({ loading: false });
    if (isBefore(this.state.toDate, date)) {
      this.setState({ loading: true });
      this.setFilterDate({
        from: date,
        to: this.state.toDate
      });
      this.setState({ fromDate: formatDateMMDD(date), loading: true });
    }
  };

  setFilterDate = date => {
    const {
      customersActions,
      locationsActions: { resetMap }
    } = this.props;
    customersActions.getActivity(date.from, date.to);
    resetMap();
    this.setState({ renderedMap: false });
  };

  toDateChangeHandler = date => {
    this.setState({ loading: false });
    if (isAfter(this.state.fromDate, date)) {
      this.setState({ loading: true });
      this.setFilterDate({
        from: this.state.fromDate,
        to: date
      });
      this.setState({ toDate: formatDateMMDD(date), loading: false });
    }
  };

  renderActivityItem = item => {
    const { noVisitInprogress, checkInId, isStartingDay } = this.state;
    return (
      <RouteListRow
        onPressed={this.activityItemClickHandler}
        item={{ ...item.item }}
        checkInId={checkInId}
        isStartingDay={isStartingDay}
        noVisitInprogress={noVisitInprogress}
        coordinate={this.state.coordinate}
      />
    );
  };

  onRouteCheckIn = async (routeEnd, inRoute) => {
    // if (routeEnd) {
    //   return;
    // }
    const { isStartingDay } = this.state;

    this.setState({ inRoute: !inRoute, isStartingDay: !isStartingDay });

    return;

    const {
      routeName,
      routeId,
      plate,
      coordinate: { longitude, latitude },
      routeHistory
    } = this.state;

    const {
      auth: { profile }
    } = this.props;
    try {
      const request = routeHistory
        ? {
            ...routeHistory,
            __ORACO__CheckOutTime_c: '' + getCurrentTimeInGMT(),
            __ORACO__CheckOutSalesRep_c: '' + profile.PartyName,
            __ORACO__CheckOutSalesRep_Id_c: '' + profile.ResourceProfileId,
            __ORACO__CheckOutLongitude_c: '' + longitude,
            __ORACO__CheckOutLatitude_c: '' + latitude
          }
        : {
            __ORACO__Route_Id_c: routeId,
            RecordName: routeName + ' ' + getCurrentTimestampInGMT(),
            __ORACO__Plate_c: plate,
            __ORACO__Route_c: routeName,
            __ORACO__Date_c: '' + getCurrentDateInGMT(),
            __ORACO__CheckInTime_c: '' + getCurrentTimeInGMT(),
            __ORACO__CheckInSalesRep_c: profile.PartyName,
            __ORACO__CheckInSalesRep_Id_c: '' + profile.ResourceProfileId,
            __ORACO__CheckInLatitude_c: '' + latitude,
            __ORACO__CheckInLongitude_c: '' + longitude
          };

      this.setState({ loading: true });
      const response = await createNewObject(
        request,
        API_NAME_POC,
        API_END_POINT.ROUTE_CHIECKIN,
        'Id'
      );
      if (response.success) {
        this.setState({
          routeHistory: response.object,
          loading: false,
          renderedMap: false,
          isStartingDay:
            findKey(response.object, '__ORACO__CheckOutTime_c') &&
            !isEmpty(response.__ORACO__CheckInTime_c)
              ? false
              : true
        });
      } else {
        this.setState({
          routeHistory: {},
          loading: false,
          renderedMap: false,
          isStartingDay: false
        });
      }
    } catch (error) {
      console.log('error', error);
      this.setState({ loading: false });
    }
  };

  renderMap = () => {
    if (this.state.isNetConnected) {
      return <Map {...this.props} />;
    } else {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text style={styles.offlineMapMessage}>
            {labels.MAP_NOT_AVAILABLE}
          </Text>
        </View>
      );
    }
  };

  _keyExtractor = (item, index) => `${index}`;
  render() {
    const {
      routeHistory,
      activityList,
      isCheckoutForDay,
      noVisitInprogress,
      inRoute
    } = this.state;
    const routeEnd = routeHistory
      ? routeHistory.__ORACO__CheckOutTime_c
        ? true
        : false
      : false;
    // const inRoute = routeHistory
    //   ? routeHistory.__ORACO__CheckOutTime_c
    //     ? false
    //     : true
    //   : false;
    let isStartDayDisable = false;
    if (
      isEmpty(routeHistory) &&
      !isEmpty(activityList) &&
      !isEmpty(activityList[0].todaysStockRequest) &&
      activityList[0].todaysStockRequest[0].statuscode !== 'APPROVED'
    ) {
      isStartDayDisable = true;
    } else {
      if (inRoute && !isCheckoutForDay) {
        isStartDayDisable = true;
      } else {
        if (isEmpty(activityList)) {
          isStartDayDisable = true;
        } else {
          if (isEmpty(activityList[0].todaysStockRequest)) {
            isStartDayDisable = true;
          } else {
            if (
              activityList[0].todaysStockRequest[0].statuscode !== 'APPROVED'
            ) {
              isStartDayDisable = true;
            } else if (
              activityList[0].todaysStockRequest[0].statuscode === 'APPROVED' &&
              noVisitInprogress
            ) {
              isStartDayDisable = false;
            } else {
              isStartDayDisable = true;
            }
          }
        }
      }
    }

    //TODO: validation skipped
    isStartDayDisable = false;
    return (
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <Loader loading={this.state.loading} />
        <View style={styles.dateContainer}>
          <DataFilter
            valueFrom={this.state.fromDate}
            valueTo={this.state.toDate}
            onFromValueChange={this.fromDateChangeHandler}
            onToValueChange={this.toDateChangeHandler}
          />
          <TouchableOpacity
            style={[
              isStartDayDisable
                ? styles.headerButtonDisable
                : styles.headerButton,
              {
                backgroundColor: routeEnd
                  ? APP_THEME.APP_LIST_BORDER_COLOR
                  : inRoute
                  ? APP_THEME.APP_FONT_COLOR_ORANGE
                  : APP_THEME.APP_BASE_COLOR
              }
            ]}
            disabled={isStartDayDisable ? true : false}
            onPress={() => this.onRouteCheckIn(routeEnd, inRoute)}
          >
            <Text style={styles.headerButtonText}>
              {routeEnd
                ? labels.ROUTE_COMPLETE
                : inRoute
                ? labels.END_DAY
                : labels.START_DAY}
            </Text>
          </TouchableOpacity>
        </View>
        {this.renderMap()}
        <FlatList
          data={activityList}
          extraData={this.state.refresh}
          style={{ flex: 1, marginTop: 10 }}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderActivityItem}
        />
      </View>
    );
  }
}

export default Route;

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    flexDirection: 'column'
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  dateLable: {
    color: APP_THEME.APP_FONT_COLOR_REGULAR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 20
  },
  dateIcon: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 22,
    paddingRight: 10
  },
  dateValue: {
    height: 40,
    width: 110,
    justifyContent: 'center',
    marginLeft: 10,
    marginRight: 10
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
    flex: 0.3,
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
  headerButtonDisable: {
    flex: 0.3,
    opacity: 0.5,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    flexDirection: 'row'
  },
  offlineMapMessage: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 18,
    fontWeight: '600'
  }
});
