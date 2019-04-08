import React, { Component } from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import { labels } from './stringConstants';

class Main extends Component {
  componentDidMount() {
    this.validateUser();

    //labels.setLanguage('en-IE');
    // this.setState({});
  }

  // Fetch the token from storage then navigate to our appropriate place
  validateUser = async () => {
    // const userToken = await AsyncStorage.getItem('userToken');

    this.props.navigation.navigate(false ? 'App' : 'Auth');
  };
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default Main;
