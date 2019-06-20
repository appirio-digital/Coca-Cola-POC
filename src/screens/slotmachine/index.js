import React, { Component } from 'react';
import { View, FlatList } from 'react-native';
import SlotItemRow from './SlotItemRow';
import { getSlotMachinelists } from '../../store/modules/products/actions';
import { APP_ROUTE } from '../../constants';

export default class SlotsMachine extends Component {
  state = {
    slotlist: []
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    console.log('drived state', nextProps);
  }

  async componentDidMount() {
    try {
      const slotListItem = await getSlotMachinelists();
      console.log(slotListItem);
      this.setState({ slotlist: slotListItem });
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  slotItemClick = item => {
    const {
      navigation,
      navigation: {
        state: { params }
      }
    } = this.props;

    navigation.navigate(APP_ROUTE.SLOT_BALANCE, {
      headerTitle: item.ProductName,
      slotItem: item
    });
  };

  renderCustomerItem = item => {
    return (
      <SlotItemRow
        onPressed={() => {}}
        onPaymentPress={this.slotItemClick}
        item={{ ...item.item }}
      />
    );
  };
  _keyExtractor = (item, index) => `${index}`;
  render() {
    return (
      <View
        style={{
          backgroundColor: '#fff',
          flex: 1,
          paddingLeft: 15,
          paddingRight: 15
        }}
      >
        <FlatList
          data={this.state.slotlist}
          style={{ flex: 1, marginTop: 10 }}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderCustomerItem}
        />
      </View>
    );
  }
}
