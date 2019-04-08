import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { APP_FONTS, APP_THEME } from '../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabsContainer: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20
  },
  tabContainer: {
    flex: 1,
    paddingVertical: 15,
    borderBottomWidth: 3,
    borderBottomColor: APP_THEME.APP_LIST_FONT_COLOR
  },
  tabContainerActive: {
    borderBottomColor: APP_THEME.APP_BASE_COLOR
  },
  tabTextActive: {
    color: APP_THEME.APP_FONT_COLOR_DARK
  },
  tabText: {
    color: APP_THEME.APP_LIST_FONT_COLOR,
    textAlign: 'center',
    fontWeight: '500',
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 14,
    lineHeight: 18
  },
  contentContainer: {
    flex: 1
  }
});

export default class Tabs extends Component {
  state = {
    activeTab: 0
  };
  componentDidMount() {
    const { activeTab } = this.props;
    if (activeTab) {
      this.setState({ activeTab });
    }
  }

  render({ children } = this.props) {
    return (
      <View style={styles.container}>
        <View style={styles.tabsContainer}>
          {children.map(({ props: { title } }, index) => (
            <TouchableOpacity
              style={[
                styles.tabContainer,
                index === this.state.activeTab ? styles.tabContainerActive : []
              ]}
              onPress={() => this.setState({ activeTab: index })}
              key={index}
            >
              <Text
                style={[
                  styles.tabText,
                  index === this.state.activeTab ? styles.tabTextActive : []
                ]}
              >
                {title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.contentContainer}>
          {children[this.state.activeTab]}
        </View>
      </View>
    );
  }
}
