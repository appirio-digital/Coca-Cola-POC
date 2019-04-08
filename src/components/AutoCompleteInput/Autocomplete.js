import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  ListView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewPropTypes as RNViewPropTypes,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import { APP_FONTS, APP_THEME, APP_ROUTE } from '../../constants';
const ViewPropTypes = RNViewPropTypes || View.propTypes;

export default class Autocomplete extends Component {
  static defaultProps = {
    data: [],
    defaultValue: '',
    keyboardShouldPersistTaps: 'always',
    onStartShouldSetResponderCapture: () => false,
    renderItem: rowData => <Text>{rowData}</Text>,
    renderSeparator: null,
    rowHasChanged: (r1, r2) => r1 !== r2
  };

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({ rowHasChanged: props.rowHasChanged });
    this.state = { dataSource: ds.cloneWithRows(props.data) };
    this.resultList = null;
  }

  componentWillReceiveProps({ data }) {
    const dataSource = this.state.dataSource.cloneWithRows(data);
    this.setState({ dataSource });
  }

  /**
   * Proxy `blur()` to autocomplete's text input.
   */
  blur = () => {
    const { textInput } = this;
    textInput && textInput.blur();
  };

  /**
   * Proxy `focus()` to autocomplete's text input.
   */
  focus = () => {
    const { textInput } = this;
    textInput && textInput.focus();
  };

  renderResultList = () => {
    const { dataSource } = this.state;
    const {
      listStyle,
      renderItem,
      renderSeparator,
      keyboardShouldPersistTaps,
      onEndReached,
      onEndReachedThreshold
    } = this.props;

    return (
      <ListView
        ref={resultList => {
          this.resultList = resultList;
        }}
        dataSource={dataSource}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        renderRow={renderItem}
        renderSeparator={renderSeparator}
        onEndReached={onEndReached}
        onEndReachedThreshold={onEndReachedThreshold}
        style={[styles.list, { height: 300 }]}
      />
    );
  };

  renderTextInput = () => {
    const {
      onEndEditing,
      viewStyle,
      onClear,
      loading,
      leftView,
      rightView
    } = this.props;
    const props = {
      style: [styles.input, viewStyle, { paddingRight: 30 }],
      ref: ref => (this.textInput = ref),
      onEndEditing: e => onEndEditing && onEndEditing(e),
      ...this.props
    };

    return (
      <View style={styles.inputOuterView}>
        {leftView}
        <View style={{ flex: 1 }}>
          <TextInput {...props} underlineColorAndroid="transparent" />
        </View>

        {loading ? (
          <View style={{ position: 'absolute', right: 0, top: 7, width: 30 }}>
            <ActivityIndicator size="small" />
          </View>
        ) : null}
        {!loading ? (
          <TouchableOpacity
            onPress={onClear}
            style={{ position: 'absolute', right: 0, top: 5, width: 30 }}
          />
        ) : null}
        {rightView}
      </View>
    );
  };

  render() {
    const { dataSource } = this.state;
    const {
      containerStyle,
      hideResults,
      inputContainerStyle,
      listContainerStyle,
      onShowResults,
      onStartShouldSetResponderCapture
    } = this.props;
    const showResults = dataSource.getRowCount() > 0;

    // Notify listener if the suggestion will be shown.
    onShowResults && onShowResults(showResults);

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={[styles.inputContainer, inputContainerStyle]}>
          {this.renderTextInput()}
        </View>
        {!hideResults ? (
          <View
            style={listContainerStyle}
            onStartShouldSetResponderCapture={onStartShouldSetResponderCapture}
          >
            {showResults && this.renderResultList()}
          </View>
        ) : null}
      </View>
    );
  }
}

const border = {
  borderColor: '#b9b9b9',
  borderRadius: 2,
  borderWidth: 1
};

const androidStyles = {
  container: {
    flex: 1,
    left: 0,
    right: 0,
    top: 0,
    zIndex: 5,
    position: 'absolute'
  },
  inputContainer: {
    ...border,
    marginBottom: 0
  },
  input: {
    backgroundColor: 'white',
    height: 40,
    fontSize: 16,
    paddingLeft: 3
  },
  list: {
    ...border,
    backgroundColor: 'white',
    borderTopWidth: 0,
    left: 0,
    right: 0,
    zIndex: 4
  }
};

const iosStyles = {
  container: {},
  inputContainer: {
    ...border
  },
  input: {
    backgroundColor: 'white',
    height: 36,
    fontSize: 16,
    paddingLeft: 3
  },
  list: {
    ...border,
    backgroundColor: 'white',
    borderTopWidth: 0,
    left: 0,
    position: 'absolute',
    right: 0
  }
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: 'white',
    height: 36,
    paddingLeft: 3
  },
  inputOuterView: {
    flexDirection: 'row',
    padding: 5,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    maxHeight: 40
  },
  ...Platform.select({
    android: { ...androidStyles },
    ios: { ...iosStyles }
  })
});
