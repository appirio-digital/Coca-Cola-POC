import React, { PureComponent } from 'react'
import {
  ScrollView,
  View,
} from 'react-native'

import Applet from '../Applet'
import FilterHeader from '../FilterHeader'

import styles from './style'

export default class Dashboard extends PureComponent {
  render() {
    return (
      <View style={styles.container}>
        <FilterHeader {...this.props} />
        <ScrollView contentContainerStyle={styles.scrollview}>
          <View style={styles.appletsCenterContainer}>
            <View style={styles.appletsContainer}>
              {
                this.props.filteredCharts
                  .sort((a, b) => a.title.localeCompare(b.title)) // string1.localeCompare(string2) = string1 < string2
                  .map(chart => (
                    <Applet
                      {...this.props}
                      {...chart}
                      key={chart.title}
                    />
                  ))
              }
            </View>
          </View>
        </ScrollView>
      </View>
    )
  }
}
