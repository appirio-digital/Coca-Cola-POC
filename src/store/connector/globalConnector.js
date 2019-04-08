import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actions } from '../../store/modules';

export default WrapperComponent => {
  class BaseConnector extends Component {
    render() {
      return <WrapperComponent {...this.props} />;
    }
  }

  function mapStateToProps(state) {
    let {
      auth,
      dashboard,
      stock,
      customers,
      product,
      performance,
      locations,
      reports,
      orders,
      templates,
      sync,
    } = state;
    return {
      auth,
      dashboard,
      stock,
      customers,
      product,
      performance,
      locations,
      reports,
      orders,
      templates,
      sync,
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      authActions: bindActionCreators(actions.auth, dispatch),
      dashboardActions: bindActionCreators(actions.dashboard, dispatch),
      stockActions: bindActionCreators(actions.stock, dispatch),
      customersActions: bindActionCreators(actions.customers, dispatch),
      productActions: bindActionCreators(actions.product, dispatch),
      performanceActions: bindActionCreators(actions.performance, dispatch),
      locationsActions: bindActionCreators(actions.locations, dispatch),
      reportActions: bindActionCreators(actions.reports, dispatch),
      ordersActions: bindActionCreators(actions.orders, dispatch),
      templatesActions: bindActionCreators(actions.templates, dispatch),
      syncActions: bindActionCreators(actions.sync, dispatch),
    };
  }

  return connect(
    mapStateToProps,
    mapDispatchToProps
  )(BaseConnector);
};
