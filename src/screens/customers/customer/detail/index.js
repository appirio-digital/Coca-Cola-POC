import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import TabBar from '../../../../components/TabBar';
import { labels } from '../../../../stringConstants';
import Invoice from '../invoice';
import Orders from '../orders';
import Info from './Info';

class CustomerDetails extends PureComponent {
  render() {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1
        }}
      >
        <TabBar>
          <View style={styles.tabContainer} title={labels.INFO.toUpperCase()}>
            <Info {...this.props} />
          </View>
          <View style={styles.tabContainer} title={labels.ORDER.toUpperCase()}>
            <Orders {...this.props} />
          </View>
          <View
            style={styles.tabContainer}
            title={labels.INVOICE.toUpperCase()}
          >
            <Invoice {...this.props} />
          </View>
        </TabBar>
      </View>
    );
  }
}

export default CustomerDetails;

const styles = StyleSheet.create({
  tabContainer: {
    flex: 1,
    flexDirection: 'column'
  }
});
