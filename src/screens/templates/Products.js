import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { APP_FONTS, APP_THEME, APP_ROUTE } from '../../constants';
import { labels } from '../../stringConstants';
import ProductRow from './ProductRow';
import { Checkbox } from '../../components/common';
import {
  fetchObjectCollection,
  API_NAME_POC,
  API_NAME,
  API_END_POINT
} from '../../services/omcClient';
import { Spinner } from '../../components/common/Spinner';
import { isEmpty, findIndex, find } from 'lodash';

export default class Products extends Component {
  state = {
    isAllItemChecked: false,
    products: [],
    productsAll: [],
    loading: false,
    accountId: '',
    priceBookItem: []
  };

  async componentDidMount() {
    const {
      productActions,
      auth: { profile }
    } = this.props;
    try {
      this.setState({ loading: true });
      const response = await fetchObjectCollection(
        API_NAME_POC,
        API_END_POINT.PRODUCT_TEMPLATE
      );

      const priceBookItem = await productActions.getPriceBookItems(
        profile.__ORACO__DistributionCentre_c
      );

      // let filteredInventoryProduct = [];
      // const routeAllocation = await fetchObjectCollection(
      //   API_NAME,
      //   API_END_POINT.ROUTE_ALLOCATION
      // );
      // if (routeAllocation) {
      //   const inventory = await fetchObjectCollection(
      //     API_NAME,
      //     API_END_POINT.ROUTE_INVENTORY
      //   );
      //   filteredInventoryProduct = inventory.filter(
      //     inventoryProduct =>
      //       inventoryProduct.__ORACO__Route_Id_c ===
      //       routeAllocation[0].__ORACO__Route_Id_c
      //   );
      // }

      this.setState({
        productsAll: response,
        products: response,
        loading: false,
        priceBookItem: priceBookItem
        //  inventoryProduct: filteredInventoryProduct
      });
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const {
      dashboard: { accountId }
    } = nextProps;

    if (accountId !== prevState.accountId) {
      const { productsAll } = prevState;

      const products = [...productsAll].filter(
        item => item.__ORACO__Account_Id_c == accountId
      );
      return {
        isAllItemChecked: false,
        products: products,
        accountId
      };
    }
    return prevState;
  }

  onCheckBoxClick = objId => () => {
    const products = [...this.state.products].map(item => {
      if (item.Id === objId)
        return Object.assign({}, item, { selected: !item.selected });
      return item;
    });
    const selectedProducts = products.filter(product => product.selected);
    this.setState({
      isAllItemChecked: selectedProducts.length === this.state.products.length,
      products
    });
  };

  _keyExtractor = (item, index) => `${index}`;

  onProductRowClick = productId => {};
  renderItem = item => {
    return (
      <ProductRow
        item={item.item}
        checkAll={this.state.isAllItemChecked}
        onCheckBoxClick={this.onCheckBoxClick}
        onRowClick={this.onProductRowClick}
        priceBook={this.state.priceBookItem}
      />
    );
  };

  onSelectAllBtnPressed = () => () => {
    const products = [...this.state.products].map(item => {
      return Object.assign({}, item, { selected: !item.selected });
    });
    this.setState({ isAllItemChecked: !this.state.isAllItemChecked, products });
  };

  moveToOrderDetailScreen = () => () => {
    const selectedProducts = [...this.state.products].filter(
      item => item.selected
    );
    if (selectedProducts.length > 0) {
      this.props.navigation.toggleDrawer();
      this.props.navigation.navigate(APP_ROUTE.NEW_ORDER, {
        products: selectedProducts,
        headerTitle: labels.NEW_ORDER,
        accountId: this.state.accountId
      });
    } else {
      Alert.alert(labels.ERROR, labels.PRODUCT_NOT_SELECTED, [
        {
          text: labels.OK
        }
      ]);
    }
  };

  render() {
    const { isAllItemChecked, products, priceBookItem } = this.state;
    const list = [...products]
      .filter(
        item =>
          findIndex(
            priceBookItem,
            priceBook => priceBook.InvItemId == item.__ORACO__Product_Id_c
          ) !== -1
        // &&
        // (!isEmpty[inventoryProduct] &&
        //   findIndex(
        //     inventoryProduct,
        //     inventory =>
        //       inventory.__ORACO__Product_Id_c == item.__ORACO__Product_Id_c
        //   ) !== -1)
      )

      .map(product => {
        const item = find(
          priceBookItem,
          priceBook => priceBook.InvItemId == product.__ORACO__Product_Id_c
        );
        return { ...product, priceBook: { ...item } };
      });

    return (
      <SafeAreaView
        style={{
          flex: 1
        }}
      >
        <View style={styles.container}>
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={[styles.buttonStyle, { alignItems: 'flex-start' }]}
              onPress={() => {
                this.props.navigation.toggleDrawer();
              }}
            >
              <Text style={styles.textStyle}></Text>
            </TouchableOpacity>
            <Text style={styles.headerText}>{labels.PRODUCT_TEMPLATE}</Text>
            <TouchableOpacity
              style={[styles.buttonStyle, { alignItems: 'flex-end' }]}
              onPress={this.moveToOrderDetailScreen()}
            >
              <Text style={styles.textStyle}></Text>
            </TouchableOpacity>
          </View>
          <View />
          <View
            style={{
              height: 40,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              marginRight: 15
            }}
          >
            <Checkbox
              isChecked={isAllItemChecked}
              onPress={this.onSelectAllBtnPressed()}
            >
              {labels.SELECT_ALL}
            </Checkbox>
          </View>
          {this.state.loading ? (
            <Spinner />
          ) : isEmpty(this.state.products) ? (
            <Text style={styles.errorTextStyle}>
              {labels.PRODUCT_TEMPLATE_NOT_FOUND}
            </Text>
          ) : (
            <FlatList
              style={{
                flex: 1
              }}
              data={list}
              keyExtractor={this._keyExtractor}
              renderItem={this.renderItem}
            />
          )}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  headerContainer: {
    flexDirection: 'row',
    marginTop: 10,
    height: 40
  },
  headerText: {
    flex: 8,
    color: '#000000',
    fontSize: 20,
    fontFamily: APP_FONTS.FONT_MEDIUM,
    textAlign: 'center'
  },
  textStyle: {
    alignSelf: 'center',
    color: '#479D7C',
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 18
  },
  errorTextStyle: {
    padding: 10,
    marginTop: 20,
    alignSelf: 'center',
    color: APP_THEME.APP_COLOR_DARK_BLACK,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 16,
    lineHeight: 18
  },
  buttonStyle: {
    borderWidth: 1,
    borderColor: '#479D7C',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    marginLeft: 15,
    marginRight: 15
  }
});
