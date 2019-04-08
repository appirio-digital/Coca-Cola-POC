import React, { PureComponent } from 'react';
import { APP_THEME, APP_FONTS } from '../constants';
import {
  TouchableOpacity,
  StatusBar,
  View,
  Text,
  Image,
  Vibration
} from 'react-native';
import GestureRecognizer, {
  swipeDirections
} from 'react-native-swipe-gestures';

export default class InAppNotificationBody extends PureComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.isOpen !== this.props.isOpen) {
      StatusBar.setHidden(nextProps.isOpen);
    }

    if (
      (this.props.vibrate || nextProps.vibrate) &&
      nextProps.isOpen &&
      !this.props.isOpen
    ) {
      Vibration.vibrate();
    }
  }

  onSwipe = direction => {
    const { SWIPE_UP } = swipeDirections;

    if (direction === SWIPE_UP) {
      this.props.onClose();
    }
  };

  render() {
    const { title, message, onPress, onClose } = this.props;

    return (
      <View style={styles.root}>
        <GestureRecognizer onSwipe={this.onSwipe} style={styles.container}>
          <TouchableOpacity
            style={styles.content}
            activeOpacity={0.3}
            underlayColor="transparent"
            onPress={() => {
              onClose();
              // onPress()
            }}
          >
            <View style={styles.textContainer}>
              <Text numberOfLines={1} style={styles.title}>
                {title}
              </Text>
              <Text numberOfLines={1} style={styles.message}>
                {message}
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.footer} />
        </GestureRecognizer>
      </View>
    );
  }
}

const styles = {
  root: {
    flex: 1,
    backgroundColor: APP_THEME.APP_BASE_COLOR_LIGHT
  },
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  content: {
    flex: 1,
    flexDirection: 'row'
  },
  textContainer: {
    alignSelf: 'center',
    marginLeft: 20
  },
  title: {
    color: '#FFF',
    fontWeight: 'bold'
  },
  message: {
    color: '#FFF',
    marginTop: 5
  },
  footer: {
    backgroundColor: '#696969',
    borderRadius: 5,
    alignSelf: 'center',
    height: 5,
    width: 35,
    margin: 5
  }
};
