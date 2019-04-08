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
import union from 'lodash/union';
import uniq from 'lodash/uniq';
import { APP_FONTS, APP_THEME } from '../../constants';
import { labels } from '../../stringConstants';
import TemplateRow from './TemplateRow';
import Products from './Products';

const initialState = {
  isShowProducts: false,
  selectedTemplateId: '',
  products: [],
  templates: []
};

export default class Templates extends Component {
  state = initialState;

  componentDidMount() {
    const { templatesActions } = this.props;
    templatesActions.getAllTemplates();
  }

  componentWillReceiveProps(newProps) {
    const {
      templates: { templates }
    } = newProps;
    this.setState({
      templates,
      isShowProducts: false,
      selectedTemplateId: '',
      products: []
    });
  }

  moveToOrderDetailScreen = () => () => {
    const selectedTemplates = [...this.state.templates].filter(
      template => template.selected
    );
    if (selectedTemplates.length > 0) {
      const products = selectedTemplates.map(item => {
        return item.products.filter(product => product.selected);
      });
      const allSelectedProducts = uniq(union(...products));
      this.props.navigation.toggleDrawer();
      this.props.navigation.navigate('Neworder', {
        products: allSelectedProducts,
        headerTitle: labels.NEW_ORDER
      });
    } else {
      Alert.alert(labels.ERROR, labels.TEMPLATE_SELECTION_ERROR, [
        {
          text: 'Ok'
        }
      ]);
    }
  };

  onProductSelect = products => {
    const { selectedTemplateId } = this.state;
    const templates = [...this.state.templates].map(item => {
      if (item.id === selectedTemplateId)
        return Object.assign({}, item, { products });
      return item;
    });
    this.setState({ templates, products });
  };
  onBackBtnPresed = () => {
    this.props.navigation.toggleDrawer();
  };

  onProductBackBtnPressed = () => () => {
    this.setState({
      isShowProducts: false,
      selectedTemplateId: ''
    });
  };

  onCheckBoxClick = objId => () => {
    const templates = [...this.state.templates].map(item => {
      if (item.id === objId)
        return Object.assign({}, item, { selected: !item.selected });
      return item;
    });
    this.setState({ templates });
  };

  _keyExtractor = (item, index) => `${index}`;

  onProductRowClick = template => () => {
    this.setState({
      isShowProducts: true,
      selectedTemplateId: template.id,
      products: template.products
    });
  };

  renderItem = item => {
    return (
      <TemplateRow
        item={item.item}
        onCheckBoxClick={this.onCheckBoxClick}
        onRowClick={this.onProductRowClick}
      />
    );
  };

  render() {
    const { templates, isShowProducts, selectedTemplateId } = this.state;
    if (isShowProducts) {
      const template = templates.filter(item => item.id === selectedTemplateId);
      return (
        <Products
          onBackPressed={this.onProductBackBtnPressed}
          parentItem={template[0]}
          products={this.state.products}
          onProductSelect={this.onProductSelect}
          moveToOrderDetailScreen={this.moveToOrderDetailScreen}
        />
      );
    }
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
              onPress={this.onBackBtnPresed}
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
          <FlatList
            style={{
              flex: 1
            }}
            data={templates}
            keyExtractor={this._keyExtractor}
            renderItem={this.renderItem}
          />
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
