import React, { Component } from 'react';
import { StyleSheet, View, Modal, Text, TouchableOpacity } from 'react-native';
import { labels } from '../stringConstants';
import { APP_FONTS, SIDEBAR_ROUTE } from '../constants';
export default class BottomActionSheets extends Component {
  state = {
    isVisbile: false,
    accountId: ''
  };
  componentDidMount() {
    const { isVisbile, accountId } = this.props;
    this.setState({ isVisbile });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      isVisbile: nextProps.isVisbile,
      accountId: nextProps.accountId
    };
  }

  openSideBarOrder = accountId => {
    const { dashboardActions } = this.props;
    dashboardActions.fetchSidebarScreenType(SIDEBAR_ROUTE.ORDERS, accountId);
    this.props.navigation.toggleDrawer();
  };

  openNewOrderScreen = accountId => {
    this.setState({ isVisbile: false });
    this.props.navigation.navigate('Neworder', {
      headerTitle: labels.NEW_ORDER,
      accountId: accountId
    });
  };

  openProductTemplateScreen = accountId => {
    const { dashboardActions } = this.props;
    dashboardActions.fetchSidebarScreenType(
      SIDEBAR_ROUTE.PRODUCT_TEMPLATE,
      accountId
    );
    this.props.navigation.toggleDrawer();
  };

  closeBottomSheet = () => {
    this.setState({ isVisbile: false });
  };

  render() {
    const { isVisbile, accountId } = this.state;
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={isVisbile}
        supportedOrientations={[
          'portrait',
          'portrait-upside-down',
          'landscape',
          'landscape-left',
          'landscape-right'
        ]}
      >
        <View style={styles.container}>
          <View style={styles.bottomSheetContainer}>
            <View style={styles.topBarContainer}>
              <TouchableOpacity
                style={styles.topRowContainer}
                onPress={() => this.openSideBarOrder(accountId)}
              >
                <Text style={styles.topTextStyle}>
                  {labels.GENERATE_ORDER_FROM_PREVIOS_ORDERS}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.topRowContainer}
                onPress={() => this.openProductTemplateScreen(accountId)}
              >
                <Text style={styles.topTextStyle}>
                  {labels.SELECT_ITEM_FROM_TEMPLATES}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.manuallyContainer}
                onPress={() => this.openNewOrderScreen(accountId)}
              >
                <Text style={styles.manuallyText}>
                  {labels.ADD_PRODUCTS_MANUALLY}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelContiner}
              onPress={this.closeBottomSheet}
            >
              <Text style={styles.cancelText}>{labels.CANCEL}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center'
  },
  bottomSheetContainer: {
    width: 420,
    position: 'absolute',
    bottom: 0,
    margin: 20
  },
  topBarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    flex: 1
  },
  topRowContainer: {
    padding: 20,
    borderColor: '#000000',
    borderBottomWidth: 1,
    alignItems: 'center'
  },
  topTextStyle: {
    color: '#202E38',
    fontSize: 16,
    fontFamily: APP_FONTS.FONT_REGULAR
  },
  manuallyContainer: {
    padding: 20,
    alignItems: 'center'
  },
  manuallyText: {
    textAlign: 'center',
    color: '#202E38',
    fontSize: 16,
    fontFamily: APP_FONTS.FONT_REGULAR
  },
  cancelContiner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    flex: 1,
    padding: 20,
    marginTop: 10,
    alignItems: 'center'
  },
  cancelText: {
    color: '#BF2929',
    fontSize: 16,
    fontFamily: APP_FONTS.FONT_REGULAR
  }
});
