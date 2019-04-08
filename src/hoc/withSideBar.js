import React, { Component } from 'react';
import { View } from 'react-native';
import SideBar from '../components/SideBar';
import BottomActionSheets from '../components/BottomActionSheets';

export default WrappedComponent => {
  class withSideBarComponent extends Component {
    state = {
      isVisible: false,
      accountId: ''
    };
    setBottomActionSheetsVisibile = (isVisible, Id) => {
      this.setState({
        isVisible,
        accountId: Id
      });
    };

    render() {
      const { isVisible, accountId } = this.state;

      return (
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <WrappedComponent
            {...this.state}
            {...this.props}
            openBottomSheets={this.setBottomActionSheetsVisibile}
          />

          <View style={{ height: '100%', width: 60 }}>
            <SideBar {...this.props} />
          </View>
          <BottomActionSheets
            accountId={accountId}
            isVisbile={isVisible}
            {...this.props}
          />
        </View>
      );
    }
  }
  return withSideBarComponent;
};
