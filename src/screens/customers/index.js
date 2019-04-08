import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import TabBar from '../../components/TabBar';
import { labels } from '../../stringConstants';

import Customer from './customer';
import Route from './route';
import { formatDateMMDD, getToDateForRegion } from '../../utility';

export default class Customers extends Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1
        }}
      >
        <TabBar>
          <View style={styles.mapContainer} title={labels.MAP.toUpperCase()}>
            <Route {...this.props} />
          </View>
          <View
            style={styles.mapContainer}
            title={labels.CUSTOMERS.toUpperCase()}
          >
            <Customer {...this.props} filtered />
          </View>
        </TabBar>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    flexDirection: 'column'
  }
});
