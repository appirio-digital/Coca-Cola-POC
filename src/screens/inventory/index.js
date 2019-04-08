import React, { Component } from 'react';
import { SafeAreaView, View, Text } from 'react-native';
import { APP_FONTS } from '../../constants';
import StockRequestList from './stockRequest';
import VanInventoryList from './vanInventory';
import TabBar from '../../components/TabBar';
import { labels } from '../../stringConstants';
class Customers extends Component {
  render() {
    return <View style={{ flex: 1 }} />;
  }

  render() {
    return (
      <SafeAreaView
        style={{
          flex: 1
        }}
      >
        <TabBar>
          <View title={labels.STOCKREQUESTS.toUpperCase()} style={{ flex: 1 }}>
            <StockRequestList {...this.props} />
          </View>
          <View title={labels.VALIDATESTOCK.toUpperCase()} style={{ flex: 1 }}>
            <VanInventoryList {...this.props} />
          </View>
        </TabBar>
      </SafeAreaView>
    );
  }
}

export default Customers;
