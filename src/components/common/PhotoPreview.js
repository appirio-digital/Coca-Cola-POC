import React, { PureComponent } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Image
} from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';
import { labels } from '../../stringConstants';

export default class PhotoPreview extends PureComponent {
  render() {
    const { uploadAttchment, onPreviewCancel, visible, imagePath } = this.props;
    return (
      <Modal
        animationType="slide"
        visible={visible}
        presentationStyle="formSheet"
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            padding: 10,
            backgroundColor: APP_THEME.APP_BASE_COLOR_WHITE
          }}
        >
          <Image style={styles.imageStyle} source={{ uri: imagePath }} />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity
            style={[
              styles.buttonStyle,
              { backgroundColor: APP_THEME.APP_FONT_COLOR_RED }
            ]}
            onPress={() => onPreviewCancel()}
          >
            <Text style={[styles.textStyle]}>{labels.CANCEL}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.buttonStyle,
              { backgroundColor: APP_THEME.APP_BASE_COLOR }
            ]}
            onPress={() => uploadAttchment()}
          >
            <Text style={[styles.textStyle]}>{labels.UPLOAD_IMAGE}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  imageStyle: {
    flex: 1,
    resizeMode: 'contain',
    width: 300,
    height: 300
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
