import React, { Component } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { APP_FONTS, APP_THEME, APP_ROUTE } from '../../constants';
import { IconButton } from '../../components/common';
import ProductRow from './ProductRow';
import FilterBarRow from './FilterBarRow';
import { find, filter } from 'lodash';
import Loader from '../../components/common/Loader';
import { labels } from '../../stringConstants';

export default class Products extends Component {
  state = {
    searchTxt: '',
    category: [],
    loading: false
  };
  componentDidMount() {
    const { productActions } = this.props;
    productActions.getAllProducts();
  }

  componentWillReceiveProps(newProps) {
    const {
      product: { loading }
    } = newProps;
    this.setState({
      loading
    });
  }

  openFilterScreen = () => {
    const { dashboardActions } = this.props;
    dashboardActions.fetchSidebarScreenType(APP_ROUTE.PRODUCTS);
    this.props.navigation.toggleDrawer();
  };

  removeSelectedFilter = id => () => {
    const {
      product: { filters },
      productActions
    } = this.props;
    if (filters) {
      const newFilters = filters.filter(filter => filter.ProdGroupId !== id);
      productActions.getSelectedFilter(newFilters);
    }
  };
  _renderFilterBar = filters => (
    <View style={styles.topBarContainer}>
      <View style={styles.filterSelectedIconContainer}>
        {filters ? (
          filters.map(filter => (
            <FilterBarRow
              data={filter}
              key={filter.id}
              removeSelectedFilter={this.removeSelectedFilter}
            />
          ))
        ) : (
          <Text style={styles.fadetextStyle}>{labels.NO_FILTER_SELECTED}</Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.barcodeContainer}
        onPress={this.openFilterScreen}
      >
        <Text style={styles.filterIconStyle}></Text>
      </TouchableOpacity>
    </View>
  );

  _renderSearchBar = () => (
    <View style={styles.searchBarContainer}>
      <View>
        <Text style={styles.iconStyle}></Text>
      </View>
      <TextInput
        underlineColorAndroid="transparent"
        placeholder={labels.PRODUCT_CODE_NAME}
        style={styles.inputStyle}
        value={this.state.searchTxt}
        onChangeText={searchTxt => this.setState({ searchTxt })}
      />
    </View>
  );

  ons;

  _keyExtractor = (item, index) => `${index}`;

  renderItem = item => {
    return <ProductRow item={item.item} onRowClick={this.onProductRowClick} />;
  };

  onProductRowClick = product => () => {
    this.props.navigation.navigate('ProductDetail', {
      product,
      headerTitle: labels.PRODUCT_DETAIL
    });
  };

  applyFilter = (products, filters) => {
    let { searchTxt } = this.state;
    if (products && searchTxt.length > 0) {
      searchTxt = searchTxt.replace(/[&\/\\#,+()$~%.'":*?<>{}]/g, '');
      const regex = new RegExp(`${searchTxt.trim()}`, 'i');
      products = [...products].filter(
        product =>
          product.InventoryItemId.search(regex) >= 0 ||
          product.Name.search(regex) >= 0
      );
    }

    if (filters && filters.length > 0) {
      const filterId = filters.map(filter => filter.ProdGroupId);
      return products.filter(product =>
        filterId.includes(
          product.ProdGroup ? product.ProdGroup.ProdGroupId : ''
        )
      );
    }
    return products;
  };

  render() {
    const {
      product: { products, filters, loading }
    } = this.props;

    const list = this.applyFilter(products, filters);

    return (
      <View style={styles.container}>
        <Loader loading={loading} />
        {this._renderFilterBar(filters)}
        {this._renderSearchBar()}
        <View style={styles.listContainer}>
          <FlatList
            style={{
              flex: 1
            }}
            data={list}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F8F8' },
  listContainer: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20
  },
  searchBarContainer: {
    minHeight: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    marginTop: 10,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    flexDirection: 'row'
  },
  topBarContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    padding: 20
  },
  filterSelectedIconContainer: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    flex: 9,
    alignItems: 'center'
  },
  barcodeContainer: {
    flex: 1,
    alignItems: 'flex-end'
  },
  iconStyle: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 22,
    lineHeight: 26,
    alignItems: 'center'
  },
  filterIconStyle: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 25,
    textAlign: 'center',
    borderWidth: 1,
    borderColor: APP_THEME.APP_BASE_COLOR,
    borderRadius: 20,
    width: 40,
    height: 40,
    paddingTop: 8
  },
  barcodeIconStyle: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 25,
    textAlign: 'right',
    width: 50
  },
  inputStyle: { padding: 10, fontSize: 14, flex: 8 },
  fadetextStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: 'normal',
    fontSize: 14,
    color: APP_THEME.APP_BASE_COLOR,
    marginLeft: 5,
    lineHeight: 18
  }
});
