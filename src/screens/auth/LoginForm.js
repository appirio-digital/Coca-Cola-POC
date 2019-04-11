import React, { Component } from 'react';
import {
  AsyncStorage,
  Alert,
  View,
  Image,
  Text,
  NetInfo,
  NativeModules
} from 'react-native';
import TouchID from 'react-native-touch-id';
import {
  Card,
  CardSection,
  Input,
  Button,
  TextButton,
  Checkbox
} from '../../components/common';
import { connect } from 'react-redux';
import { APP_FONTS } from '../../constants';
import Loader from '../../components/common/Loader';
import { labels } from '../../stringConstants';

class LoginForm extends Component {
  state = {
    email: 'Coke.User', //'Canadian.User',
    password: 'Wipro@1234',
    autoLogin: false,
    touchIdAvailable: false
  };

  async componentWillMount() {
    this.checkForTouchIDLogin();
  }

  checkForTouchIDLogin = async () => {
    try {
      const touchSupport = await TouchID.isSupported();
      this.setState({ touchIdAvailable: touchSupport });
      const storageData = await AsyncStorage.multiGet([
        'email',
        'password',
        'isAutoLoginEnabled'
      ]);
      const credentials = storageData.map(([key, value], index) => {
        return { key: key, value: value };
      });
      const email = '';
      const password = '';
      const isAutoLoginEnabled = '';
      credentials.forEach(cred => {
        switch (cred.key) {
          case 'email':
            email = cred.value;
            break;
          case 'password':
            password = cred.value;
            break;
          case 'isAutoLoginEnabled':
            isAutoLoginEnabled = JSON.parse(cred.value);
            break;
          default:
            break;
        }
      });
      this.setState({ autoLogin: isAutoLoginEnabled });
      if (email && password && isAutoLoginEnabled === true) {
        const optionalConfigObject = {
          title: 'Authentication Required', // Android
          color: '#e00606', // Android,
          fallbackLabel: 'Show Passcode' // iOS (if empty, then label is hidden)
        };
        if (touchSupport) {
          const success = await TouchID.authenticate(
            'Login using TouchId',
            optionalConfigObject
          );
          if (success) {
            this.setState({ email, password });
            this.loginClicked();
          }
        }
      }
    } catch (error) {}
  };

  storeCredsToAsyncStorage = () => {
    const { email, password } = this.state;
    AsyncStorage.setItem('email', email);
    AsyncStorage.setItem('password', password);
    AsyncStorage.setItem('isAutoLoginEnabled', JSON.stringify(true));
  };

  removeCredsFromAsyncStorage = () => {
    AsyncStorage.multiRemove(['email', 'password', 'isAutoLoginEnabled']);
  };

  autoLoginCheckboxClicked = () => {
    this.setState({ autoLogin: !this.state.autoLogin });
  };

  loginClicked = async () => {
    try {
      const { email, password } = this.state;
      this.props.authActions.authenticateOAuthMCSUser(email, password);
    } catch (error) {}
  };

  forgotPasswordClicked = () => {};

  renderError = error => {
    if (error) {
      return (
        <CardSection>
          <Text style={styles.errorFontStyle}>{error}</Text>
        </CardSection>
      );
    }
  };

  updateOnlineStatus = async () => {
    const ForceOfflineFlag = await AsyncStorage.getItem('ForceOfflineFlag');
    const networkConnectivityFlag = await AsyncStorage.getItem(
      'networkConnectivity'
    );
    const isConnected = networkConnectivityFlag == 'true';
    NativeModules.SyncManager.setOfflineMode({
      connectivity: isConnected && ForceOfflineFlag != 'true'
    });
  };

  componentWillReceiveProps(newProps) {
    if (newProps.auth.user) {
      if (this.state.autoLogin === true) {
        this.storeCredsToAsyncStorage();
      } else {
        this.removeCredsFromAsyncStorage();
      }
      this.updateOnlineStatus();
      this.props.navigation.navigate('App');
    }
  }

  renderForTouchIDSupportCheckbox = () => {
    if (this.state.touchIdAvailable) {
      return (
        <CardSection>
          <Checkbox
            isChecked={this.state.autoLogin}
            onPress={this.autoLoginCheckboxClicked}
          >
            {labels.ENABLE_TOUCH_ID}
          </Checkbox>
        </CardSection>
      );
    }
  };

  render() {
    const {
      mainContainerStyleFlex1,
      mainContainerStyleFlex2,
      logoContainerStyle,
      logoStyle,
      loginContainer,
      errorFontStyle,
      topLogoStyle,
      mainContainerStyleFlex3
    } = styles;
    return (
      <View style={mainContainerStyleFlex1}>
        <Loader loading={this.props.auth.loading} />
        <View style={mainContainerStyleFlex3} />
        <View style={logoContainerStyle} />
        <View style={loginContainer}>
          <View style={mainContainerStyleFlex1} />
          <View style={mainContainerStyleFlex2}>
            <CardSection>
              <Input
                label=""
                placeholder="test@test.com"
                autoCorrect={false}
                autoCapitalize="none"
                value={this.state.email}
                onChangeText={email => {
                  this.setState({ email });
                }}
              />
            </CardSection>
            <CardSection>
              <Input
                label=""
                placeholder="******"
                secureTextEntry
                value={this.state.password}
                onChangeText={password => {
                  this.setState({ password });
                }}
              />
            </CardSection>
            <CardSection>
              <Button onPress={this.loginClicked}>{labels.SIGN_IN}</Button>
            </CardSection>
            {this.renderForTouchIDSupportCheckbox()}
            {this.renderError(this.props.auth.errorMessage)}
            <View style={{ paddingTop: 20 }}>
              <CardSection />
            </View>
          </View>
          <View style={mainContainerStyleFlex1} />
        </View>
        <View style={logoContainerStyle}>
          <Image
            source={require('../../../assets/images/cocacola_logo.png')}
            style={logoStyle}
          />
        </View>
      </View>
    );
  }
}
//<TextButton>{`${labels.FORGOT_PASSWORD}${'?'}`}</TextButton>
const styles = {
  mainContainerStyleFlex1: { flex: 1, backgroundColor: 'white' },
  mainContainerStyleFlex3: { flex: 0.5 },
  mainContainerStyleFlex2: { flex: 2 },
  logoContainerStyle: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 40
  },
  logoStyle: { height: 61, width: 181 },
  topLogoStyle: { height: 100, width: 100 },
  loginContainer: {
    flexDirection: 'row',
    flex: 2
  },
  errorFontStyle: {
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 14
  }
};

export default LoginForm;
