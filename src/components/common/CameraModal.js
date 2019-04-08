import React, { PureComponent } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  Alert,
  TouchableOpacity
} from 'react-native';
import Camera from 'react-native-camera';
import { dirPicutures } from './dirStorage';
import RNFS from 'react-native-fs';
import { getCurrentTimestampInGMT } from '../../utility';
import { APP_THEME, APP_FONTS } from '../../constants';
import { labels } from '../../stringConstants';

class CameraModal extends PureComponent {
  saveImage = async filePath => {
    try {
      // set new image name and filepath
      const newImageName = `${getCurrentTimestampInGMT()}.jpg`;
      const newFilepath = `file://${dirPicutures}/${newImageName}`;
      // move and save image to new filepath
      //console.log('filePath', filePath);
      const imagePath = await this.moveAttachment(filePath, newFilepath);
      this.props.onCameraCapture(imagePath);
    } catch (error) {
      this.props.onCameraCancel(error);
    }
  };

  moveAttachment = async (filePath, newFilepath) => {
   // console.log('Dir' + dirPicutures);
    return new Promise((resolve, reject) => {
      RNFS.mkdir(dirPicutures)
        .then(() => {
          //console.log('Dir');
          RNFS.copyFile(filePath, newFilepath)
            .then(() => {
              resolve(newFilepath);
            })
            .catch(error => {
              //console.log('moveFile error', error);
              reject(error);
            });
        })
        .catch(err => {
          //console.log('mkdir error', err);
          reject(err);
        });
    });
  };

  takePicture() {
    this.camera
      .capture()
      .then(data => {
        //console.log(data);
        //data is an object with the file path
        //save the file to app  folder
        this.saveImage(data.path);
      })
      .catch(err => {
        console.error('capture picture error', err);
        this.props.onCameraCancel(err);
      });
  }

  render() {
    const { visible } = this.props;
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
            ref={cam => (this.camera = cam)}
            aspect={Camera.constants.Aspect.fill}
            orientation="auto"
            captureTarget={Camera.constants.CaptureTarget.disk}
          >
            <View
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}
            >
              <TouchableOpacity
                style={[
                  styles.buttonStyle,
                  { backgroundColor: APP_THEME.APP_FONT_COLOR_RED }
                ]}
                onPress={() => this.props.onCameraCancel()}
              >
                <Text style={[styles.textStyle]}>{labels.CANCEL}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.buttonStyle,
                  { backgroundColor: APP_THEME.APP_BASE_COLOR }
                ]}
                onPress={() => this.takePicture()}
              >
                <Text style={[styles.textStyle]}>{labels.CAPTURE_IMAGE}</Text>
              </TouchableOpacity>
            </View>
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
  },
  iconText: {
    alignSelf: 'center',
    justifyContent: 'center',
    color: APP_THEME.APP_BASE_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    padding: 5,
    fontSize: 18
  },
  textStyle: {
    alignSelf: 'center',
    color: APP_THEME.APP_BASE_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_BOLD,
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  },
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: APP_THEME.APP_STEPPER_BUTTON_COLOR
  }
});

export { CameraModal };
