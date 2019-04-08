import React, { PureComponent } from 'react';
import { View } from 'react-native';
import IpadPortrait from './IpadPortrait';
import IpadLandscap from './IpadLandscap';

export default class ProductDetail extends PureComponent {
  render() {
    const {
      deviceInfo: { orientation }
    } = this.props;
    const {
      navigation: {
        state: { params }
      }
    } = this.props;
    // if (params && params.product) {

    // }
    return (
      <View style={{ flex: 1 }}>
        {orientation === 'Landscape' ? (
          <IpadLandscap {...params} />
        ) : (
          <IpadPortrait {...params} />
        )}
      </View>
    );
  }
}
