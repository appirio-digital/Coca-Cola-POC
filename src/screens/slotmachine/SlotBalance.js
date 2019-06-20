import React, { PureComponent, Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
  Platform,
  Image
} from 'react-native';
import moment from 'moment';
import isEmpty from 'lodash/isEmpty';
import { Button } from '../../components/common';

import { APP_FONTS, APP_THEME } from '../../constants';
import { labels } from '../../stringConstants';
import { CameraModal } from '../../components/common/CameraModal';
import PhotoPreview from '../../components/common/PhotoPreview';

import {
  randomString,
  getCurrentTimestampInGMT,
  formatAmount,
  roundAmount
} from '../../utility';

import { setSlotMachinelists } from '../../store/modules/products/actions';

export default class SlotBalance extends Component {
  state = {
    captureImage: false,
    previewImage: false,
    filePath: ''
  };

  componentDidMount() {}

  onCancelPrivew = () => {
    this.setState({ previewImage: false });
  };

  onCameraCancel = error => {
    const { captureImage } = this.state;
    this.setState({ captureImage: !captureImage });
  };

  captureImage = () => {
    const { captureImage } = this.state;
    this.setState({ captureImage: !captureImage });
  };

  goBack = () => {
    Alert.alert(
      '',
      'Slot balance updated successfully',
      [
        {
          text: 'OK',
          onPress: () => {
            const { navigation } = this.props;
            navigation.goBack();
          }
        }
      ],
      { cancelable: false }
    );
  };

  _renderEmoneyPaymentMode = slot => (
    <View style={styles.itemContainer}>
      <View style={styles.detailItemRow}>
        <Text
          style={styles.itemTextCode}
        >{`Product Id ${slot.ProductNumber}`}</Text>
        <Text
          style={styles.itemTextCode}
        >{`Product Name ${slot.ProductName}`}</Text>
      </View>
      <View style={styles.blankView} />
      <View style={styles.detailItemRow}>
        <View style={styles.detailItemColumn}>
          <Text style={styles.itemTextColumn}>{labels.PREVIOUS_AMOUNT}:</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textValue}
            value={`${slot.PreviousTally}`}
            //onChangeText={text => this.handleAmountChange(text, 'EmoneyAmount')}
          />
        </View>
        <View style={styles.blankView} />

        <View style={styles.detailItemColumn}>
          <Text style={styles.itemTextColumn}>{labels.CURRENT_AMOUNT}:</Text>
          <TextInput
            underlineColorAndroid="transparent"
            style={styles.textValue}
            //value={}
            //onChangeText={text =>
            //this.handleAmountChange(text, 'EmoneyTranscationId')
            //}
          />
        </View>
      </View>
      <View style={styles.blankView} />

      <View style={styles.detailItemRow}>
        <View
          style={{
            alignSelf: 'center',
            alignItems: 'center',
            height: 40,
            width: 200
          }}
        >
          <Button onPress={this.captureImage}> {labels.ATTACH_IMAGE} </Button>
        </View>

        <TouchableOpacity style={styles.headerButton} onPress={this.goBack}>
          <Text style={styles.headerButtonText}> {labels.SAVE}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  render() {
    const {
      navigation: {
        state: { params }
      }
    } = this.props;

    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        enabled={Platform.OS === 'ios' ? true : false}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {this._renderEmoneyPaymentMode(params.slotItem)}
        </ScrollView>
        <View style={{ flex: 1 }}>
          <CameraModal
            visible={this.state.captureImage}
            onCameraCapture={this.onCameraCapture}
            onCameraCancel={this.onCameraCancel}
          />
          <PhotoPreview
            imagePath={this.state.filePath}
            visible={this.state.previewImage}
            //uploadAttchment={this.onUploadImage}
            uploadAttchment={() => {}}
            onPreviewCancel={this.onCancelPrivew}
          />
        </View>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: APP_THEME.APP_BACKGROUND_COLOR
  },

  headerItemRow: {
    flexDirection: 'column',
    marginBottom: 20
  },
  headerRow: {
    flexDirection: 'column',
    marginBottom: 10
  },
  detailItemRow: {
    flexDirection: 'column',
    flex: 1,
    marginTop: 10
  },
  creditHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10
  },
  detailItem: {
    flex: 5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 3,
    paddingRight: 3
  },
  detailItemColumn: {
    flex: 1,
    flexDirection: 'column',
    paddingLeft: 5,
    paddingRight: 5
  },
  iconStyle: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 14,
    lineHeight: 18,
    alignItems: 'center'
  },

  itemContainer: {
    margin: 20,
    padding: 15,
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    backgroundColor: APP_THEME.APP_BASE_COLOR_WHITE,
    shadowColor: APP_THEME.APP_COLOR_DARK_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  creditNotesContainer: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'column',
    borderWidth: 1,
    borderRadius: 2,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    backgroundColor: APP_THEME.APP_BASE_COLOR_WHITE,
    shadowColor: APP_THEME.APP_COLOR_DARK_BLACK,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1
  },
  itemTextCode: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    flex: 1,
    fontSize: 14,
    lineHeight: 18
  },
  itemText: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    margin: 0,
    fontSize: 14,
    lineHeight: 18
  },
  itemTextColumn: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    marginBottom: 5,
    fontSize: 14,
    lineHeight: 18
  },
  itemTextInvoice: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    margin: 0,
    fontSize: 18,
    lineHeight: 22,
    fontWeight: '600'
  },
  itemTextOther: {
    color: APP_THEME.APP_LIST_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_REGULAR,
    margin: 0,
    paddingLeft: 5,
    paddingRight: 5,
    fontSize: 14,
    lineHeight: 18
  },
  itemTextDate: {
    color: APP_THEME.APP_FONT_COLOR_DARK,
    fontFamily: APP_FONTS.FONT_REGULAR,
    margin: 0,
    paddingLeft: 5,
    paddingRight: 5,

    fontSize: 14,
    lineHeight: 18
  },
  button: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 14,
    lineHeight: 18,
    height: 40
  },
  textValue: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    lineHeight: 19,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 15,
    fontFamily: APP_FONTS.FONT_REGULAR,
    borderWidth: 1,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    borderRadius: 2
  },
  headerButton: {
    flex: 0.4,
    maxWidth: 140,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    flexDirection: 'row'
  },
  headerButtonDisable: {
    flex: 0.4,
    maxWidth: 140,
    height: 40,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    flexDirection: 'row',
    opacity: 0.7
  },
  headerButtonText: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    color: APP_THEME.APP_BASE_COLOR_WHITE
  },
  headerButtonIcon: {
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 16,
    lineHeight: 19,
    fontWeight: '600',
    marginRight: 5,
    color: APP_THEME.APP_BASE_COLOR_WHITE
  },
  blankView: {
    height: 15
  },
  datepickerComponentStyle: {
    height: 40,
    width: 150,
    flexDirection: 'row'
  }
});
