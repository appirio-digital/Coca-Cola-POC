import React, { PureComponent } from 'react';
import { Text, View, StyleSheet, Modal, Alert } from 'react-native';
import { Button, CardSection } from './index';
import Camera from 'react-native-camera';

class Scanner extends PureComponent {
  onBarCodeRead = ({ data, type }) => {
    if (type.includes('org.iso.DataMatrix')) {
      data = data.substring(data.lastIndexOf('(240)') + 5);
    }

    this.props.onBarCodeRead(data);
  };

  render() {
    const { visible, onBarCodeReadCancel } = this.props;
    return (
      <Modal
        animationType="slide"
        onRequestClose={() => {
          this.setState({ showBarcodeModal: false });
        }}
        visible={visible}
      >
        <View style={styles.container}>
          <Camera
            style={styles.preview}
            onBarCodeRead={this.onBarCodeRead}
            ref={cam => (this.camera = cam)}
          >
            <CardSection>
              <Button onPress={onBarCodeReadCancel}>Cancel</Button>
            </CardSection>
          </Camera>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row'
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  }
});

export { Scanner };
