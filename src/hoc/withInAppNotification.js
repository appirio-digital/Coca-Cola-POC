import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native'
import Notification from 'react-native-in-app-notification'

import InAppNotificationBody from '../components/InAppNotificationBody'

export default WrappedComponent => {
  class withInAppNotification extends Component {
    notification = null

    bindNotificationRef = (ref) => {
      this.notification = ref
    }

    createNotification = (title, message, onPress = () => {}) => {
      if (this.notification) {
        this.notification.show({
          title,
          message,
          onPress,
        })
      }
    }

    render() {
      return (
        <View style={styles.container}>
          <WrappedComponent
            {...this.props}
            createNotification={this.createNotification}
          />
          <Notification
            ref={this.bindNotificationRef}
            notificationBodyComponent={InAppNotificationBody}
          />
        </View>
      )
    }
  }
  return withInAppNotification
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})