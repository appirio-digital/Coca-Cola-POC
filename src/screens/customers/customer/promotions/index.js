import React, { Component } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { Button } from '../../../../components/common';
import PromotionRow from './PromotionRow';
import { labels } from '../../../../stringConstants';
import { APP_THEME, APP_ROUTE } from '../../../../constants';
import Loader from '../../../../components/common/Loader';
import {
  fetchObjectCollection,
  API_NAME_MCS,
  API_END_POINT
} from '../../../../services/omcClient';
import { findIndex, isEmpty, find } from 'lodash';
import { isAfter, isBefore, getCurrentDateInGMT } from '../../../../utility';
import { callOPA } from '../../../../services/OPACall';

class Promotions extends Component {
  state = {
    promotions: [],
    loading: false,
    accountId: null,
    orderItems: [],
    isValidForPromotion: true
  };

  async componentDidMount() {
    this.setState({ loading: true });
    const {
      navigation: {
        state: { params }
      }
    } = this.props;

    if (params && params.accountId && params.orderItems) {
      this.setState({
        accountId: params.accountId,
        orderItems: params.orderItems
      });
      try {
        const promotionHeader = await fetchObjectCollection(
          API_NAME_MCS,
          API_END_POINT.PROMOTIONS
        );
        const promotion = [...promotionHeader].filter(
          promotion =>
            promotion.__ORACO__StartDate_c &&
            isAfter(promotion.__ORACO__StartDate_c, getCurrentDateInGMT()) &&
            promotion.__ORACO__EndDate_c &&
            isBefore(promotion.__ORACO__EndDate_c, getCurrentDateInGMT()) &&
            promotion.__ORACO__Status_c == 'ORA_ACO_PROMOTION_APPROVED' &&
            promotion.__ORACO__Account_Id_c == params.accountId
          //  promotion.__ORACO__Account_Id_c != '' //100000001716929 //||
          //   promotion.__ORACO__Account_Id_c == 300000014814367) //params.accountId
        );

        const response = await Promise.all(
          [...promotion].map(async header => {
            try {
              const items = await fetchObjectCollection(
                API_NAME_MCS,
                'ORACO__Promotion_c/' +
                  header.Id +
                  '/child/ORACO__PromotionProductCollection_c'
              );
              return { ...header, lineItem: [...items] };
            } catch (error) {}
          })
        );

        try {
          const promotionList = [...response]
            .reduce((right, current) => {
              if (right.lineItem && current.lineItem)
                return [...right.lineItem, ...current.lineItem];
              else return [...right, ...current.lineItem];
            })
            .map(item => {
              const header = find(
                [...promotion],
                promotionItem =>
                  promotionItem.Id == item.__ORACO__Promotion_Id_c
              );

              const order = find(
                params.orderItems,
                order => order.Product_Id_c == item.__ORACO__Item_Id1_c
              );

              return header
                ? {
                    ...item,
                    StratDate: header.__ORACO__StartDate_c,
                    EndDate: header.__ORACO__EndDate_c,
                    Name: header.RecordName,
                    RecordNumber: header.RecordNumber,
                    currentQty: order ? order.Quantity_c : 0,
                    selected:
                      order && order.Promotion1_c == header.RecordNumber
                        ? true
                        : false
                  }
                : item;
            });

          this.setState({ promotions: promotionList });
        } catch (error) {
          console.log(error);
        }

        this.setState({ loading: false });
      } catch (error) {
        this.setState({ loading: false });
      }
    }
  }

  applyPromotions = () => {
    const promotionSelected = [...this.state.promotions].filter(
      data => data.selected
    );
    this.backToOrder(promotionSelected);
  };

  validatePromotions = async () => {
    const { accountId } = this.state;
    try {
      this.setState({ loading: true });
      const response = await callOPA(accountId);
      if (response && response.length > 0) {
        this.setState({
          loading: false,
          isValidForPromotion: response[0].value == 'true' ? true : false
        });
      }
      this.setState({ loading: false });
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };

  backToOrder = promotionList => {
    const { navigation } = this.props;
    navigation.navigate(APP_ROUTE.NEW_ORDER, {
      promotions: promotionList,
      orderLineItems: this.state.orderItems
    });
  };

  onSelectPromotion = (id, productId) => {
    const promotions = [...this.state.promotions].map(item => {
      const promotion = { ...item };

      if (promotion.Id == id) {
        promotion.selected = promotion.selected ? !promotion.selected : true;
      }

      if ((promotion.Id != id && promotion.__ORACO__Item_Id1_c) == productId) {
        promotion.selected = false;
      }

      return promotion;
    });

    this.setState({ promotions: promotions });
  };

  renderItem = item => {
    return (
      <PromotionRow
        item={item && item.item}
        onSelectPromotion={this.onSelectPromotion}
      />
    );
  };

  getGridData = column => {
    if (this.state.promotions.length > 0) {
      const gridData = [...this.state.promotions];
      var count = gridData.length % column;

      if (count > 0)
        for (let i = 0; i < column - count; i++) {
          gridData.push({});
        }
      return gridData;
    }
    return [];
  };

  _keyExtractor = (item, index) => `${index}`;
  render() {
    const { loading } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <Loader loading={loading} />
        <View
          style={{
            flexDirection: 'row',
            width: '100%',
            paddingLeft: 10,
            height: 60
          }}
        >
          <View
            style={{
              alignSelf: 'flex-start',
              height: 40,
              width: 240,
              marginBottom: 10,
              marginTop: 10
            }}
          >
            <Button onPress={this.validatePromotions}>
              {labels.VALIDATE_PROMOTIONS}
            </Button>
          </View>
          <View style={{ flex: 1, height: 1 }} />
          <View
            style={{
              alignSelf: 'flex-end',
              height: 40,
              width: 240,
              marginBottom: 10,
              marginTop: 10,
              paddingRight: 20
            }}
          >
            <Button
              disable={!this.state.isValidForPromotion}
              onPress={this.applyPromotions}
            >
              {' '}
              {labels.APPLY_PROMOTIONS}{' '}
            </Button>
          </View>
        </View>

        <FlatList
          style={{
            flex: 1,
            backgroundColor: '#fff',
            paddingBottom: 10,
            paddingTop: 10
          }}
          data={this.state.promotions}
          keyExtractor={this._keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }
}

export default Promotions;
