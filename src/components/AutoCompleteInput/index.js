import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform
} from 'react-native';
import debounce from 'lodash/debounce';
import { APP_FONTS, APP_THEME } from '../../constants';

import Autocomplete from './Autocomplete';
const initialState = {
  selectedValue: null,
  loading: true,
  options: [],
  optionsSource: [],
  error: null,
  query: ''
};

export default class AutoCompleteInput extends React.Component {
  mounted = true;
  state = initialState;

  componentWillUnmount() {
    this.mounted = false;
  }
  reset = () => {
    const { defaultValue, fieldName, onValueChange } = this.props;
    this.onChangeText('');
    this.setState(
      Object.assign({}, initialState, {
        selectedValue: defaultValue,
        loading: false,
        optionsSource: this.state.optionsSource,
        query: defaultValue
      })
    );
    if (onValueChange) {
      onValueChange(fieldName, true)(undefined);
    }
  };

  async componentWillReceiveProps(props) {
    const { isFormEditable } = props;
    if (isFormEditable) {
      await this.bindData(props);
    }
  }

  getSelectedValue = (formValues = {}) => {
    const { defaultValue, fieldName } = this.props;
    return formValues[fieldName]
      ? formValues[fieldName] || formValues[fieldName].value
      : defaultValue;
  };

  bindData = async (props, resetSelectedValue = false) => {
    const {
      query,
      options,
      formValues,
      fieldName,
      defaultValue,
      value,
      onValueChange
    } = props;

    let selectedValue = this.getSelectedValue(formValues);
    if (resetSelectedValue) {
      onValueChange(fieldName)(defaultValue || null);
      selectedValue = defaultValue || null;
    }

    if (!query) {
      if (fieldName === 'deliverOption') {
        const selected = [...options].filter(
          item => item.label === defaultValue
        );
        if (selected && selected.length > 0)
          props.onValueChange(fieldName)(selected[0]);
      }
      if (this.mounted)
        this.setState({
          selectedValue,
          loading: false,
          optionsSource: options,
          query: selectedValue
        });
      return;
    }

    try {
      let results = await query.source();
      let rows = results.data[query.name].map(row => {
        let output = {};
        output.label = row[query.labelField];
        output.value = query.valueField ? row[query.valueField] : row;
        return output;
      });

      if (selectedValue) {
        const selected = [...rows].filter(item => item.label === selectedValue);
        if (selected && selected.length > 0)
          props.onValueChange(fieldName)(selected[0]);
      }
      if (this.mounted)
        this.setState({
          selectedValue,
          loading: false,
          optionsSource: rows,
          query: selectedValue
        });
    } catch (error) {
      this.setState({
        loading: false,
        error
      });
    }
  };

  async componentDidMount() {
    const { isFormEditable } = this.props;
    if (isFormEditable) {
      await this.bindData(this.props);
    }
  }

  onDropDownValueSelect = item => () => {
    const { onValueChange, fieldName } = this.props;
    if (onValueChange) {
      onValueChange(fieldName, true)(item);
    }
    this.setState({ query: item.label, options: [] });
  };

  findOptions = query => {
    try {
      if (query === '' || !query) {
        return [];
      }
      const { optionsSource } = this.state;
      const regex = new RegExp(`${query.trim()}`, 'i');
      return optionsSource.filter(
        option =>
          option.label.search(regex) >= 0 || option.value.search(regex) >= 0
      );
    } catch (error) {
      console.log(error);
    }
  };

  bindSearchResults = debounce(async text => {
    const { mode, query } = this.props;
    let options = [];
    if (mode !== 'lazy') {
      options = this.findOptions(text);
    } else {
      if (!text || text === '') {
        this.setState({ options, query: text });
        return;
      }
      let results = await query.source({ ...query.params, text });
      options = results.map(item => {
        return {
          label: item[query.labelField],
          value: query.valueField ? item[query.valueField] : item
        };
      });
    }

    this.setState({ query: text, options, loading: false });
  }, 300);

  onChangeText = text => {
    this.setState({
      loading: text && text !== ''
    });

    this.bindSearchResults(text);
  };

  render() {
    const {
      placeholder,
      placement,
      value,
      defaultValue,
      listTopOffset,
      inputStyle,
      leftView,
      rightView,
      isInsideScrollView
    } = this.props;
    const { query, options, loading } = this.state;
    const optionIsSelected = (a, b) =>
      a.toLowerCase().trim() === b.toLowerCase().trim();

    let listStyle =
      placement && placement === 'bottom'
        ? { ...styles.listBottomStyle }
        : isInsideScrollView
          ? { ...styles.listScrollStyle }
          : { ...styles.listStyle };
    let listStyleAndroid =
      placement && placement === 'bottom'
        ? { ...styles.listBottomStyleAndroid }
        : isInsideScrollView
          ? { ...styles.listScrollStyleAndroid }
          : { ...styles.listStyleAndroid };

    if (listTopOffset) {
      listStyle.top = listTopOffset;
    }
    return (
      <View style={styles.container}>
        <Autocomplete
          autoCapitalize="none"
          autoCorrect={false}
          loading={loading}
          containerStyle={styles.autocompleteContainer}
          data={
            options &&
            options.length === 1 &&
            optionIsSelected(query, options[0].label)
              ? []
              : options
          }
          value={value}
          placeholder={placeholder}
          onChangeText={this.onChangeText}
          listStyle={Platform.OS === 'ios' ? listStyle : listStyleAndroid}
          listContainerStyle={styles.listContainerStyle}
          onClear={this.reset}
          renderItem={item => (
            <TouchableOpacity
              onPress={this.onDropDownValueSelect(item)}
              style={{
                borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
                borderBottomWidth: 1,
                padding: 5
              }}
            >
              <Text style={styles.headerText}>{item.value}</Text>
              <Text style={styles.itemText}>{item.label}</Text>
            </TouchableOpacity>
          )}
          viewStyle={inputStyle}
          rightView={rightView}
          leftView={leftView}
        />
      </View>
    );
  }
}

const styles = {
  container: {
    flex: 1
  },
  autocompleteContainer: {},
  headerText: {
    color: APP_THEME.APP_LIST_FONT_COLOR,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: APP_FONTS.FONT_SEMIBOLD
  },
  itemText: {
    color: APP_THEME.APP_LIST_FONT_COLOR,
    fontSize: 14,

    fontFamily: APP_FONTS.FONT_REGULAR
  },
  listContainerStyle: {
    shadowColor: APP_THEME.APP_LIST_BORDER_COLOR,
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 1.0
  },
  listStyle: { zIndex: 99999, position: 'absolute', left: 0, top: 30 },
  listScrollStyle: { zIndex: 99999, position: 'absolute', left: 0, top: 0 },
  listBottomStyle: { zIndex: 99999, position: 'absolute', left: 0, bottom: 0 },
  listStyleAndroid: { left: 0, top: 30 },
  listScrollStyleAndroid: { left: 0, top: 0 },
  listBottomStyleAndroid: { left: 0, bottom: 0 },
  sepraterStyle: {
    backgroundColor: APP_THEME.APP_LIST_BORDER_COLOR,
    height: 0.5
  }
};
