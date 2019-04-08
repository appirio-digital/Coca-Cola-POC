import React, { Component } from 'react';

import { APP_FONTS, APP_THEME } from '../../constants';
import { labels } from '../../stringConstants';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView
} from 'react-native';

class FilterScreen extends Component {
  state = {
    categories: []
  };

  componentDidMount() {
    this.fetchCategoryData();
  }

  fetchCategoryData = () => {
    const { productActions } = this.props;
    productActions.getAllProductCategory();
  };

  onCheckPress = id => () => {
    const categories = [...this.state.categories].map(category => {
      if (category.ProdGroupId === id)
        category = Object.assign({}, category, {
          isChecked: !category.isChecked
        });
      return category;
    });
    this.setState({ categories });
  };

  onClearBtnPress = () => {
    this.fetchCategoryData();
    const { onSelectFilter } = this.props;
    onSelectFilter([]);
  };

  onApplyBtnPress = () => {
    const { onSelectFilter } = this.props;
    const categories = [...this.state.categories].filter(
      category => category.isChecked
    );
    onSelectFilter(categories);
  };

  renderCheckBox = (text, isChecked, id) => (
    <TouchableOpacity
      style={styles.buttonStyle}
      key={id}
      onPress={this.onCheckPress(id)}
    >
      <Text style={styles.checkBoxStyle}>{isChecked === true ? '' : ''}</Text>

      <Text style={styles.checkBoxTextStyle}>{text}</Text>
    </TouchableOpacity>
  );

  componentWillReceiveProps(props) {
    const {
      product: { category, filters }
    } = props;

    if (category) {
      const selectedIds = filters
        ? filters.map(filter => filter.ProdGroupId)
        : [];
      const categories = [...category].map((category, index) => {
        category = Object.assign({}, category, {
          isChecked: selectedIds.includes(category.ProdGroupId),
          id: index
        });
        return category;
      });

      this.setState({ categories: categories });
    }
  }

  render() {
    const { categories } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.titleTextStyle}>{labels.FILTERS}</Text>
        <ScrollView style={{ flex: 1, width: '100%' }}>
          {categories &&
            categories.map(category =>
              this.renderCheckBox(
                category.ProdGroupName,
                category.isChecked,
                category.ProdGroupId
              )
            )}
        </ScrollView>

        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <TouchableOpacity
            style={styles.applyButtonStyle}
            onPress={this.onApplyBtnPress}
          >
            <Text
              style={[
                styles.textStyle,
                { color: APP_THEME.APP_BASE_FONT_COLOR }
              ]}
            >
              {labels.APPLY}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.clearButtonStyle}
            onPress={this.onClearBtnPress}
          >
            <Text
              style={[styles.textStyle, { color: APP_THEME.APP_BASE_COLOR }]}
            >
              {labels.CLEAR}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    marginTop: 20
  },
  titleTextStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontWeight: '600',
    fontSize: 20,
    color: APP_THEME.APP_FONT_COLOR_REGULAR,
    marginBottom: 20
  },
  applyButtonStyle: {
    flex: 1,
    width: 100,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    marginRight: 20
  },
  clearButtonStyle: {
    flex: 1,
    borderRadius: 2,
    borderWidth: 1,
    width: 100,
    height: 40,
    borderColor: APP_THEME.APP_BASE_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_FONT_COLOR,
    marginLeft: 20
  },
  textStyle: {
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 24,
    alignItems: 'center',
    fontWeight: '600'
  },
  checkBoxTextStyle: {
    alignSelf: 'center',
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16
  },
  checkBoxStyle: {
    alignSelf: 'center',
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 24,
    paddingRight: 10
  },
  buttonStyle: {
    alignSelf: 'stretch',
    flexDirection: 'row',
    marginTop: 10
  }
});

export default FilterScreen;
