//Signature Modal
import React, { Component } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image
} from 'react-native';
import { APP_FONTS, APP_THEME } from '../../constants';
import SignaturePad from './signature-pad';
import { labels } from '../../stringConstants';

export default class SignatureModal extends React.Component {
  state = {
    signature: '',
    title: '',
    key: 1
  };

  componentDidMount() {
    const { base64Icon } = this.props;
    this.setState({ signature: base64Icon });
  }

  _signaturePadError = error => {
    console.error(error);
  };
  _signaturePadChange = ({ base64DataUrl }) => {
    this.setState({
      signature: base64DataUrl
    });
  };

  onClearSignature = () => () => {
    this.setState({ signature: '', key: Math.floor(Math.random(100) * 100) });
  };

  onDonePressed = () => () => {
    const { saveSignature } = this.props;
    const { signature } = this.state;
    saveSignature(signature);
  };

  render() {
    const {
      signatureModalVisible,
      clearSignature,
      signatureModalTitle,
      closeSignaturePanel
    } = this.props;
    const { key, signature } = this.state;
    return (
      <View style={{ marginTop: 22 }}>
        <Modal
          animationType="fade"
          presentationStyle="fullScreen"
          transparent={false}
          visible={signatureModalVisible}
          supportedOrientations={[
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right'
          ]}
        >
          <View
            style={{
              flex: 1,
              padding: 50,
              backgroundColor: 'rgba(0,0,0,0.4)'
            }}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: '#FFFFFF'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
                  borderBottomWidth: 1
                }}
              >
                <Text
                  style={[
                    styles.btnText,
                    {
                      flex: 9,
                      textAlign: 'center',
                      color: APP_THEME.APP_BASE_COLOR,
                      marginLeft: 50
                    }
                  ]}
                >
                  {signatureModalTitle}
                </Text>

                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: APP_THEME.APP_BASE_COLOR,
                      flex: 1.5,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: APP_THEME.APP_BASE_COLOR,
                      borderRadius: 2
                    }
                  ]}
                  onPress={this.onDonePressed()}
                >
                  <Text
                    style={
                      (styles.btnText,
                      {
                        color: '#FFFFFF',
                        fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
                        fontSize: 14
                      })
                    }
                  >
                    {`${' '}${labels.DONE}`}
                  </Text>
                </TouchableOpacity>
              </View>

              <SignaturePad
                onError={this._signaturePadError}
                onChange={this._signaturePadChange}
                style={{ flex: 1, backgroundColor: 'white' }}
                key={key}
                dataURL={signature}
              />

              <View
                style={{
                  flexDirection: 'row',
                  padding: 20,
                  alignItems: 'center',
                  borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
                  borderTopWidth: 1
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      flex: 1.5,
                      maxWidth: 100,
                      borderColor: APP_THEME.APP_BASE_COLOR,
                      borderRadius: 2,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  ]}
                  onPress={closeSignaturePanel}
                >
                  <Text
                    style={[
                      styles.btnText,
                      { color: APP_THEME.APP_BASE_COLOR, textAlign: 'center' }
                    ]}
                  >
                    {`${labels.CANCEL}`}
                  </Text>
                </TouchableOpacity>
                <View style={[{ flex: 7 }]} />
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      maxWidth: 100,
                      borderColor: APP_THEME.APP_BASE_COLOR,
                      flex: 1.5,
                      borderRadius: 2,
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  ]}
                  onPress={this.onClearSignature()}
                >
                  <Text
                    style={[
                      styles.btnText,
                      { color: APP_THEME.APP_BASE_COLOR, textAlign: 'center' }
                    ]}
                  >
                    {`${labels.CLEAR}`}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  signature: {
    flex: 1,
    borderColor: '#000033',
    borderWidth: 1
  },
  drawerIcon: {
    borderWidth: 1,
    borderColor: '#000000',
    width: 30,
    height: 30,
    alignSelf: 'flex-end',
    borderRadius: 2
  },
  button: {
    borderWidth: 1,
    borderColor: '#000',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 2,
    flexDirection: 'row'
  },
  btnText: {
    fontWeight: 'bold',
    fontSize: 14
  }
});
