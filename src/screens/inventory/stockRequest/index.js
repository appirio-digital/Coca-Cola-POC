import React, { Component } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { IconButton } from '../../../components/common';
import StockRequestRow from './StockRequestRow';
import { labels } from '../../../stringConstants';
import {
  fetchObjectCollection,
  API_END_POINT,
  API_NAME
} from '../../../services/omcClient';
import Loader from '../../../components/common/Loader';
import { APP_THEME, APP_FONTS } from '../../../constants';
import moment from 'moment';
export default class StockRequestList extends Component {
  onGridItemPressHandler = route => {
    this.props.navigation.push(route);
  };

  state = {
    stockRequests: [],
    loading: false,
    disableNewRequest: false
  };

  componentWillReceiveProps(newProps) {
    const {
      stock: { routeAllocation, stockRequests, loading }
    } = newProps;
    const routeId =
      routeAllocation && routeAllocation.length > 0
        ? routeAllocation[0].__ORACO__Route_Id_c
        : '';
    const filteredStockRequest =
      stockRequests &&
      stockRequests.filter(
        activity =>
          activity.function == 'TASK' &&
          activity.subtype == 'STOCK_REQUEST' &&
          activity.routeid == routeId
      );

    const disableNewRequest =
      filteredStockRequest && filteredStockRequest.length > 0 && true;
    this.setState({
      stockRequests: filteredStockRequest,
      loading,
      disableNewRequest
    });
  }

  componentDidMount() {
    this.downloadData();
  }

  downloadData = async () => {
    const { product, productActions, stockActions } = this.props;
    this.setState({ loading: true });
    await stockActions.getRouteAllocation();
    if (product && product.length === 0) {
      await productActions.getAllProducts();
    }
    await stockActions.getAllStockRequest();
  };

  onStockRequestEditClicked = item => {
    this.props.stockActions.selectStockRequest(item);
    this.props.navigation.navigate('NewStockRequest', {
      headerTitle: 'Edit Request' + '(' + item.routeid + ')'
    });
  };

  onNewStockRequestClicked = () => {
    const {
      stock: { routeAllocation }
    } = this.props;
    const routeName =
      routeAllocation && routeAllocation.length > 0
        ? routeAllocation[0].__ORACO__Route_c
        : '';
    this.props.stockActions.createNewStockRequest();
    this.props.navigation.navigate('NewStockRequest', {
      headerTitle: labels.NEWREQUEST + '(' + routeName + ')'
    });
  };

  renderItem = item => {
    return (
      <StockRequestRow
        stockRequest={item}
        onEditClicked={this.onStockRequestEditClicked}
      />
    );
  };

  _keyExtractor = (item, index) => `${index}`;

  render() {
    const {
      stock: { routeAllocation }
    } = this.props;
    const routeName =
      routeAllocation && routeAllocation.length > 0
        ? routeAllocation[0].__ORACO__Route_c
        : '';
    return (
      <View
        style={{
          flex: 1,
          paddingLeft: 20,
          paddingRight: 20
        }}
      >
        <View style={styles.titleView}>
          <Text style={styles.titleStyle}>
            {`${labels.CURRENT_ROUTE}${' :  '}`}
          </Text>
          <Text style={styles.titleValueStyle}>{routeName}</Text>
        </View>
        <Loader loading={this.state.loading} />
        {/* <View
          style={
            this.state.disableNewRequest
              ? {
                  opacity: 0.7,
                  alignSelf: 'flex-end',
                  height: 40,
                  width: 180,
                  marginBottom: 10,
                  marginTop: 10
                }
              : {
                  alignSelf: 'flex-end',
                  height: 40,
                  width: 180,
                  marginBottom: 10,
                  marginTop: 10
                }
          }
        >
          <IconButton
            bgColor={APP_THEME.APP_BASE_COLOR}
            onPress={this.onNewStockRequestClicked}
            disable={this.state.disableNewRequest}
          >
            {' '}
            <Text style={{ fontSize: 16, lineHeight: 19, fontWeight: '600' }}>
              {labels.NEWREQUEST}
            </Text>
          </IconButton>
        </View> */}
        <FlatList
          style={{
            flex: 1
          }}
          data={this.state.stockRequests}
          extraData={this.state}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleView: {
    alignSelf: 'flex-start',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 10,
    paddingTop: 20
  },
  titleStyle: {
    fontSize: 18,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontWeight: '600'
  },
  titleValueStyle: {
    fontSize: 18,
    fontFamily: APP_FONTS.FONT_REGULAR
  }
});
