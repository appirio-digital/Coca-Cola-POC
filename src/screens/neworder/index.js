import React, { Component } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import {
  APP_FONTS,
  APP_THEME,
  SIDEBAR_ROUTE,
  APP_ROUTE
} from '../../constants';
import { labels } from '../../stringConstants';
import Header from './Header';
import ProductRow from './ProductRow';
import AutoCompleteInput from '../../components/AutoCompleteInput';
import SignatureModal from '../../components/signaure-modal';
import { Scanner } from '../../components/common';
import { find, findIndex, isEmpty } from 'lodash';

import {
  getCurrentDateInGMT,
  getCurrentTimestampInGMT,
  randomString,
  formatAmount,
  roundAmount
} from '../../utility';
import {
  createNewObject,
  API_NAME_POC,
  API_NAME,
  API_END_POINT,
  SyncPinPriority,
  fetchObjectCollection
} from '../../services/omcClient';
import Loader from '../../components/common/Loader';
import { getOrderStatus } from '../../utility';
export default class Neworder extends Component {
  state = {
    base64Icon: '',
    signatureModalVisible: false,
    currentModalTitle: labels.DRAW_YOUR_SIGNATURE,
    signatureValue: '',
    resetSignature: false,
    number: '',
    name: 'Order#' + getCurrentTimestampInGMT(),
    date: getCurrentDateInGMT(),
    draft: 'Draft',
    promo_code: '',
    promo_detail: '',
    amount: '0',
    taxes: '0',
    discount: '0',
    total_amount: '0',
    products: [],
    allProducts: [],
    dropdownList: [],
    selectedProduct: {},
    showBarcodeModal: false,
    accountId: '',
    orderLineItem: [],
    priceBookItem: [],
    loading: false,
    CurrencyCode: '',
    inventoryProduct: [],
    order: null,
    isEdited: false,
    reloadOrder: false,
    promotions: [],
    account: null
  };
  async componentDidMount() {
    const {
      productActions,
      auth: { profile },
      navigation: {
        state: { params }
      }
    } = this.props;

    this.setState({ loading: true });

    try {
      const priceBookItem = await productActions.getPriceBookItems(
        profile.__ORACO__DistributionCentre_c
      );
      const routeAllocation = await fetchObjectCollection(
        API_NAME,
        API_END_POINT.ROUTE_ALLOCATION
      );
      if (routeAllocation) {
        const inventory = await fetchObjectCollection(
          API_NAME,
          API_END_POINT.ROUTE_INVENTORY
        );
        const filteredInventoryProduct = inventory.filter(
          inventoryProduct =>
            inventoryProduct.__ORACO__Route_Id_c ===
            routeAllocation[0].__ORACO__Route_Id_c
        );

        this.setState({
          routeID: routeAllocation[0].__ORACO__Route_Id_c,
          routeName: routeAllocation[0].RecordName,
          loading: false,
          priceBookItem: priceBookItem,
          inventoryProduct: filteredInventoryProduct
        });
        productActions.getAllProductsWithPrice(priceBookItem);
      }

      if (params && params.promotions && params.orderLineItems) {
        this.updateOrderItemWithPromotion(
          params.orderLineItems,
          params.promotions
        );
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  }

  updateOrderItemWithPromotion = (orderLineItem, promotions) => {
    const lineItem = [...orderLineItem].map(item => {
      const promotion = find(
        [...promotions],
        pro => pro.__ORACO__Item_Id1_c == item.Product_Id_c
      );
      let discount = 0;
      let promotionId = '';
      let promotionNumber = '';
      if (promotion) {
        if (
          promotion.__ORACO__DiscountMethod_c ==
            'ORA_ACO_DISCOUNT_PERCENTAGE' &&
          promotion.__ORACO__Discount_c
        ) {
          const unitPrice = Number.isNaN(parseFloat(item.UnitPrice_c))
            ? 0
            : parseFloat(item.UnitPrice_c);

          const price = item.Quantity_c * unitPrice;

          const discountPercentage = Number.isNaN(
            parseFloat(promotion.__ORACO__Discount_c)
          )
            ? 0
            : parseFloat(promotion.__ORACO__Discount_c);

          discount = price * discountPercentage;
        } else if (promotion.__ORACO__DiscountAmount_c) {
          discount = promotion.__ORACO__DiscountAmount_c;
        }
        promotionId = promotion.__ORACO__Promotion_Id_c;
        promotionNumber = promotion.RecordNumber;
      }
      return {
        ...item,
        DiscountAmount_c: discount,
        Promotion1_Id_c: promotionId,
        Promotion1_c: promotionNumber
      };
    });

    const orderTotal = this.getTotalCalculation(lineItem);

    this.setState({
      orderLineItem: lineItem,
      ...orderTotal,
      promotions: [...promotions]
    });
  };
  renderAttribute = (key, value, style) => (
    <View style={{ flexDirection: 'row' }}>
      <Text style={[styles.attrTitleTextStyle]}>{key}</Text>
      <Text
        style={
          key === labels.TOTAL_AMOUNT
            ? [styles.attrValueBoldTextStyle, style]
            : [styles.attrValueTextStyle, style]
        }
      >
        {value}
      </Text>
    </View>
  );

  inputLeftView = () => <Text style={styles.leftIconStyle}></Text>;

  inputRightView = () => (
    <TouchableOpacity
      style={styles.rightContainer}
      onPress={this.scanBarcodeButtonClicked}
    >
      <Text style={styles.rightIconStyle}></Text>
    </TouchableOpacity>
  );

  scanBarcodeButtonClicked = () => {
    if (
      this.state.order &&
      this.state.order.OrderStatus_c !== 'ORA_ACO_ORDER_STATUS_BOOKED'
    )
      return;

    this.setState({ showBarcodeModal: true });
  };

  onBarCodeRead = barcode => {
    this.setState({ showBarcodeModal: false });
    const { allProducts } = this.state;
    const selectedProducts = [...allProducts].filter(
      product => product.ItemNumber == barcode || product.Name == barcode
    );

    const isAdded = [...this.state.orderLineItem].findIndex(
      item => item.Product_Id_c == selectedProducts[0].InventoryItemId
    );
    if (selectedProducts.length > 0 && isAdded == -1) {
      const lineItem = selectedProducts.map(product => {
        const price = find(
          this.state.priceBookItem,
          priceBook => priceBook.InvItemId == product.InventoryItemId
        );

        let amount = price.ListPrice * 1;
        let taxAmount = 0;
        if (price.__ORACO__Tax1Amount_c) {
          taxAmount = taxAmount + price.__ORACO__Tax1Amount_c;
        }
        if (price.__ORACO__Tax2Amount_c) {
          taxAmount = taxAmount + price.__ORACO__Tax2Amount_c;
        }
        if (price.__ORACO__Tax1Percentage_c) {
          let tax = (amount * price.__ORACO__Tax1Percentage_c).toFixed(2);

          taxAmount = taxAmount + tax;
        }
        if (price.__ORACO__Tax2Percentage_c) {
          let tax = (amount * price.__ORACO__Tax2Percentage_c).toFixed(2);
          taxAmount = taxAmount + tax;
        }

        const orderItem = {
          CurrencyCode: this.state.CurrencyCode,
          Order_Id_c: '',
          //Order_c: '',
          Product_Id_c: product.InventoryItemId,
          Product_c: product.ItemNumber,
          UOM_c: price ? price.PriceUOMCode : '',
          UnitPrice_c: price ? price.ListPrice : '',
          Discount_c: '0',
          DiscountAmount_c: '0',
          Quantity_c: 1,
          Promotion1_Id_c: '',
          Promotion1_c: '',
          MobileUId_c: 'OrderLine#' + randomString(20),
          DiscountedPrice1_c: '',
          TotalPrice1_c: '',
          OrderLineStatus_c: '',
          TaxAmount_c: taxAmount,
          ParentMobileUId_c: ''
        };
        return orderItem;
      });

      this.setState({
        isEdited: true
      });
      const orderLineItem = [...this.state.orderLineItem, ...lineItem];

      this.updateOrderItemWithPromotion(orderLineItem, this.state.promotions);
    } else {
      const message =
        isAdded > -1
          ? labels.PRODUCT_ADDED
          : labels.PRODUCT_NOT_FOUND + ':-' + barcode;
      setTimeout(() => {
        Alert.alert('', message);
      }, 200);
    }
  };

  onBarCodeReadCancel = () => {
    this.setState({ showBarcodeModal: false });
  };

  _keyExtractor = (item, index) => `${index}`;

  renderItem = item => {
    return (
      <ProductRow
        isDisable={
          this.state.order &&
          this.state.order.OrderStatus_c !== 'ORA_ACO_ORDER_STATUS_BOOKED'
        }
        onChangeText={this.onChangeText}
        inventory={this.state.inventoryProduct}
        item={item.item}
        onQuantityChange={this.onQuantityChange}
        onDeleteProductPressed={this.onDeleteProductPressed}
      />
    );
  };

  onChangeText = item => {
    if (
      this.state.order &&
      this.state.order.OrderStatus_c !== 'ORA_ACO_ORDER_STATUS_BOOKED'
    )
      return;
    const index = findIndex(
      [...this.state.orderLineItem],
      orderItem => orderItem.Product_Id_c == item.Product_Id_c
    );
    if (index !== -1) {
      const orderLineItem = [...this.state.orderLineItem];

      let qty = Number.isNaN(parseInt(orderLineItem[index].Quantity_c))
        ? 0
        : parseInt(orderLineItem[index].Quantity_c);
      if (qty < 0) qty = 0;

      orderLineItem[index].Quantity_c = qty;

      const price = find(
        this.state.priceBookItem,
        priceBook => priceBook.InvItemId == orderLineItem[index].Product_Id_c
      );
      let amount = price.ListPrice * orderLineItem[index].Quantity_c;
      let taxAmount = 0;
      if (price.__ORACO__Tax1Amount_c) {
        taxAmount = taxAmount + price.__ORACO__Tax1Amount_c;
      }
      if (price.__ORACO__Tax2Amount_c) {
        taxAmount = taxAmount + price.__ORACO__Tax2Amount_c;
      }
      if (price.__ORACO__Tax1Percentage_c) {
        let tax = (amount * price.__ORACO__Tax1Percentage_c).toFixed(2);

        taxAmount = taxAmount + tax;
      }
      if (price.__ORACO__Tax2Percentage_c) {
        let tax = (amount * price.__ORACO__Tax2Percentage_c).toFixed(2);
        taxAmount = taxAmount + tax;
      }

      orderLineItem[index].TaxAmount_c = taxAmount;

      const promotion = find(
        [...this.state.promotions],
        pro => pro.__ORACO__Item_Id1_c == orderLineItem[index].Product_Id_c
      );
      let discount = 0;

      if (
        promotion &&
        !(promotion.__ORACO__RequiredQty_c
          ? orderLineItem[index].Quantity_c < promotion.__ORACO__RequiredQty_c
          : false)
      ) {
        if (
          promotion.__ORACO__DiscountMethod_c ==
            'ORA_ACO_DISCOUNT_PERCENTAGE' &&
          promotion.__ORACO__Discount_c
        ) {
          const unitPrice = Number.isNaN(
            parseFloat(orderLineItem[index].UnitPrice_c)
          )
            ? 0
            : parseFloat(orderLineItem[index].UnitPrice_c);

          const price = orderLineItem[index].Quantity_c * unitPrice;

          const discountPercentage = Number.isNaN(
            parseFloat(promotion.__ORACO__Discount_c)
          )
            ? 0
            : parseFloat(promotion.__ORACO__Discount_c);

          discount = price * discountPercentage;
        } else if (promotion.__ORACO__DiscountAmount_c) {
          discount = promotion.__ORACO__DiscountAmount_c;
        }
        orderLineItem[index].Promotion1_c = promotion.RecordNumber;
        orderLineItem[index].Promotion1_Id_c =
          promotion.__ORACO__Promotion_Id_c;
      } else {
        orderLineItem[index].Promotion1_c = '';
        orderLineItem[index].Promotion1_Id_c = '';
      }
      orderLineItem[index].DiscountAmount_c = discount;

      const orderTotal = this.getTotalCalculation(orderLineItem);
      this.setState({
        orderLineItem: orderLineItem,
        ...orderTotal,
        isEdited: true
      });
      // }
    }
  };

  onQuantityChange = (item, add) => {
    if (
      this.state.order &&
      this.state.order.OrderStatus_c !== 'ORA_ACO_ORDER_STATUS_BOOKED'
    )
      return;
    const index = findIndex(
      [...this.state.orderLineItem],
      orderItem => orderItem.Product_Id_c == item.Product_Id_c
    );
    if (index !== -1) {
      const orderLineItem = [...this.state.orderLineItem];

      const qty = Number.isNaN(parseInt(orderLineItem[index].Quantity_c))
        ? 0
        : parseInt(orderLineItem[index].Quantity_c);
      if (!add && qty == 0) return;

      orderLineItem[index].Quantity_c = add ? qty + 1 : qty - 1;

      const price = find(
        this.state.priceBookItem,
        priceBook => priceBook.InvItemId == orderLineItem[index].Product_Id_c
      );
      let amount = price.ListPrice * orderLineItem[index].Quantity_c;
      let taxAmount = 0;
      if (price.__ORACO__Tax1Amount_c) {
        taxAmount = taxAmount + price.__ORACO__Tax1Amount_c;
      }
      if (price.__ORACO__Tax2Amount_c) {
        taxAmount = taxAmount + price.__ORACO__Tax2Amount_c;
      }
      if (price.__ORACO__Tax1Percentage_c) {
        let tax = (amount * price.__ORACO__Tax1Percentage_c).toFixed(2);

        taxAmount = taxAmount + tax;
      }
      if (price.__ORACO__Tax2Percentage_c) {
        let tax = (amount * price.__ORACO__Tax2Percentage_c).toFixed(2);
        taxAmount = taxAmount + tax;
      }

      orderLineItem[index].TaxAmount_c = taxAmount;

      const promotion = find(
        [...this.state.promotions],
        pro => pro.__ORACO__Item_Id1_c == orderLineItem[index].Product_Id_c
      );
      let discount = 0;

      if (
        promotion &&
        !(promotion.__ORACO__RequiredQty_c
          ? orderLineItem[index].Quantity_c < promotion.__ORACO__RequiredQty_c
          : false)
      ) {
        if (
          promotion.__ORACO__DiscountMethod_c ==
            'ORA_ACO_DISCOUNT_PERCENTAGE' &&
          promotion.__ORACO__Discount_c
        ) {
          const unitPrice = Number.isNaN(
            parseFloat(orderLineItem[index].UnitPrice_c)
          )
            ? 0
            : parseFloat(orderLineItem[index].UnitPrice_c);

          const price = orderLineItem[index].Quantity_c * unitPrice;

          const discountPercentage = Number.isNaN(
            parseFloat(promotion.__ORACO__Discount_c)
          )
            ? 0
            : parseFloat(promotion.__ORACO__Discount_c);

          discount = price * discountPercentage;
        } else if (promotion.__ORACO__DiscountAmount_c) {
          discount = promotion.__ORACO__DiscountAmount_c;
        }
        orderLineItem[index].Promotion1_c = promotion.RecordNumber;
        orderLineItem[index].Promotion1_Id_c =
          promotion.__ORACO__Promotion_Id_c;
      } else {
        orderLineItem[index].Promotion1_c = '';
        orderLineItem[index].Promotion1_Id_c = '';
      }
      orderLineItem[index].DiscountAmount_c = discount;

      const orderTotal = this.getTotalCalculation(orderLineItem);
      this.setState({
        orderLineItem: orderLineItem,
        ...orderTotal,
        isEdited: true
      });
      // }
    }
  };

  setSignatureModalVisible = visible => {
    this.setState({
      signatureModalVisible: visible
    });
  };

  signaturePadError = error => {};

  saveSignatureValue = signature => {
    if (signature) {
      this.setState({ signatureValue: signature });
      this.setSignatureModalVisible(false);
    }
  };

  clearSignature = () => {
    this.setState({
      resetSignature: false,
      signatureValue: '',
      valuesChanged: true
    });
  };

  onValueChange = name => value => {
    const { allProducts, products, order } = this.state;
    if (order && order.OrderStatus_c !== 'ORA_ACO_ORDER_STATUS_BOOKED') return;

    const selectedProducts = [...allProducts].filter(
      product => product.ItemNumber == value.value
    );

    const isAdded = [...this.state.orderLineItem].findIndex(
      item => item.Product_Id_c == selectedProducts[0].InventoryItemId
    );
    if (selectedProducts.length > 0 && isAdded == -1) {
      const lineItem = selectedProducts.map(product => {
        const price = find(
          this.state.priceBookItem,
          priceBook => priceBook.InvItemId == product.InventoryItemId
        );
        let amount = price.ListPrice * 1;
        let taxAmount = 0;
        if (price.__ORACO__Tax1Amount_c) {
          taxAmount = taxAmount + price.__ORACO__Tax1Amount_c;
        }
        if (price.__ORACO__Tax2Amount_c) {
          taxAmount = taxAmount + price.__ORACO__Tax2Amount_c;
        }
        if (price.__ORACO__Tax1Percentage_c) {
          let tax = (amount * price.__ORACO__Tax1Percentage_c).toFixed(2);

          taxAmount = taxAmount + tax;
        }
        if (price.__ORACO__Tax2Percentage_c) {
          let tax = (amount * price.__ORACO__Tax2Percentage_c).toFixed(2);
          taxAmount = taxAmount + tax;
        }
        const orderItem = {
          CurrencyCode: this.state.CurrencyCode,
          Order_Id_c: '',
          //Order_c: '',
          Product_Id_c: product.InventoryItemId,
          Product_c: product.ItemNumber,
          UOM_c: price ? price.PriceUOMCode : '',
          UnitPrice_c: price ? price.ListPrice : '',
          Discount_c: '0',
          DiscountAmount_c: '0',
          Quantity_c: 1,
          Promotion1_Id_c: '',
          Promotion1_c: '',
          MobileUId_c: 'OrderLine#' + randomString(20),
          DiscountedPrice1_c: '',
          TotalPrice1_c: '',
          OrderLineStatus_c: '',
          TaxAmount_c: taxAmount,
          ParentMobileUId_c: ''
        };
        return orderItem;
      });
      const orderLineItem = [...this.state.orderLineItem, ...lineItem];

      this.setState({
        selectedProduct: value,
        isEdited: true
      });
      this.updateOrderItemWithPromotion(orderLineItem, this.state.promotions);
    } else {
      const message =
        isAdded > -1
          ? labels.PRODUCT_ADDED
          : labels.PRODUCT_NOT_FOUND + ':-' + barcode;
      setTimeout(() => {
        Alert.alert('', message);
      }, 200);
    }
  };

  onDeleteProductPressed = id => () => {
    if (
      this.state.order &&
      this.state.order.OrderStatus_c !== 'ORA_ACO_ORDER_STATUS_BOOKED'
    )
      return;
    const orderLineItem = [...this.state.orderLineItem].filter(
      item => item.Product_Id_c !== id
    );
    this.setState({ orderLineItem: orderLineItem, isEdited: true });
  };

  componentWillReceiveProps(props) {
    const {
      product: { pricedProducts, priceBookHeader },
      customers: { customersList },
      navigation: {
        state: { params }
      }
    } = props;

    if (priceBookHeader) {
      this.setState({ CurrencyCode: priceBookHeader.CurrencyCode });
    }

    if (pricedProducts) {
      const dropdownList = pricedProducts.map(product => {
        const { Name, ItemNumber } = product;
        return { value: ItemNumber, label: Name };
      });
      this.setState({
        allProducts: pricedProducts,
        dropdownList: dropdownList
      });
    }
    if (params && params.accountId) {
      const account = find(
        customersList,
        customer => customer.id == params.accountId
      );
      this.setState({
        accountId: params.accountId,
        account: account
      });
    }

    if (params && params.order && !params.promotions) {
      const order = { ...params.order };
      const orderLineItem = [...order.orderItem];
      const orderTotal = this.getTotalCalculation(orderLineItem);
      delete order['orderItem'];
      this.setState({
        order: order,
        orderLineItem: orderLineItem,
        ...orderTotal
      });
    }

    if (
      params &&
      params.orderItems &&
      params.orderItems.length != this.state.orderLineItem.length &&
      !isEmpty(this.state.priceBookItem)
    ) {
      let orderLineItem = [
        ...this.state.orderLineItem,
        ...params.orderItems
      ].map(orderItem => {
        const price = find(
          [...this.state.priceBookItem],
          priceBook => priceBook.InvItemId == orderItem.Product_Id_c
        );
        let taxAmount = 0;
        if (price) {
          let amount = price.ListPrice * orderItem.Quantity_c;

          if (price.__ORACO__Tax1Amount_c) {
            taxAmount = taxAmount + price.__ORACO__Tax1Amount_c;
          }
          if (price.__ORACO__Tax2Amount_c) {
            taxAmount = taxAmount + price.__ORACO__Tax2Amount_c;
          }
          if (price.__ORACO__Tax1Percentage_c) {
            let tax = (amount * price.__ORACO__Tax1Percentage_c).toFixed(2);

            taxAmount = taxAmount + tax;
          }
          if (price.__ORACO__Tax2Percentage_c) {
            let tax = (amount * price.__ORACO__Tax2Percentage_c).toFixed(2);
            taxAmount = taxAmount + tax;
          }
        }

        return { ...orderItem, TaxAmount_c: taxAmount };
      });

      const orderTotal = this.getTotalCalculation(orderLineItem);
      this.setState({
        loading: false,
        orderLineItem: orderLineItem,
        ...orderTotal
      });
    }
    if (
      params &&
      params.products &&
      pricedProducts &&
      !isEmpty(this.state.priceBookItem)
    ) {
      this.setState({ loading: true });
      const filteredProducts = params.products
        .filter(
          item =>
            pricedProducts.findIndex(
              product => product.InventoryItemId == item.__ORACO__Product_Id_c
            ) !== -1 &&
            [...this.state.orderLineItem].findIndex(
              lineItem => lineItem.Product_Id_c == item.__ORACO__Product_Id_c
            ) === -1
        )
        .map(item => {
          const product = find(
            pricedProducts,
            product => product.InventoryItemId == item.__ORACO__Product_Id_c
          );

          let qty = Number.isNaN(parseInt(item.__ORACO__Quantity_c))
            ? 0
            : parseInt(item.__ORACO__Quantity_c);

          return {
            ...product,
            __ORACO__Quantity_c: qty,
            __ORACO__UOM_c: item.__ORACO__UOM_c
          };
        });

      const lineItem = filteredProducts.map(product => {
        const price = find(
          [...this.state.priceBookItem],
          priceBook => priceBook.InvItemId == product.InventoryItemId
        );

        let amount = price.ListPrice * product.__ORACO__Quantity_c;
        let taxAmount = 0;
        if (price.__ORACO__Tax1Amount_c) {
          taxAmount = taxAmount + price.__ORACO__Tax1Amount_c;
        }
        if (price.__ORACO__Tax2Amount_c) {
          taxAmount = taxAmount + price.__ORACO__Tax2Amount_c;
        }
        if (price.__ORACO__Tax1Percentage_c) {
          let tax = (amount * price.__ORACO__Tax1Percentage_c).toFixed(2);

          taxAmount = taxAmount + tax;
        }
        if (price.__ORACO__Tax2Percentage_c) {
          let tax = (amount * price.__ORACO__Tax2Percentage_c).toFixed(2);
          taxAmount = taxAmount + tax;
        }

        const orderItem = {
          CurrencyCode: this.state.CurrencyCode,
          Order_Id_c: '',
          //Order_c: '',
          Product_Id_c: product.InventoryItemId,
          Product_c: product.ItemNumber,
          UOM_c: product.__ORACO__UOM_c,
          UnitPrice_c: price ? price.ListPrice : '',
          Discount_c: '0',
          DiscountAmount_c: '0',
          Quantity_c: product.__ORACO__Quantity_c,
          Promotion1_Id_c: '',
          Promotion1_c: '',
          MobileUId_c: 'OrderLine#' + randomString(20),
          DiscountedPrice1_c: '',
          TotalPrice1_c: '',
          OrderLineStatus_c: '',
          TaxAmount_c: taxAmount,
          ParentMobileUId_c: ''
        };
        return orderItem;
      });

      const orderLineItem = [...this.state.orderLineItem, ...lineItem];

      const orderTotal = this.getTotalCalculation(orderLineItem);
      this.setState({
        loading: false,
        orderLineItem: orderLineItem,
        ...orderTotal
      });
    }
  }

  getTotalCalculation = orderLineItem =>
    orderLineItem.length > 0
      ? orderLineItem
          .map(item => {
            let amount, taxes, discount;
            amount = taxes = discount = total_amount = 0;

            amount =
              (Number.isNaN(parseFloat(item.Quantity_c))
                ? 0
                : parseFloat(item.Quantity_c)) * item.UnitPrice_c;

            taxes = item.TaxAmount_c ? item.TaxAmount_c : 0;

            discount = item.DiscountAmount_c ? item.DiscountAmount_c : 0;

            taxes = item.TaxAmount_c ? item.TaxAmount_c : 0;

            return {
              amount: amount,
              taxes: taxes,
              discount: discount,
              total_amount:
                parseFloat(amount) + parseFloat(taxes) - parseFloat(discount)
            };
          })
          .reduce((prev, current) => {
            return {
              amount: parseFloat(prev.amount) + parseFloat(current.amount),
              taxes: parseFloat(prev.taxes) + parseFloat(current.taxes),
              discount:
                parseFloat(prev.discount) + parseFloat(current.discount),
              total_amount:
                parseFloat(prev.total_amount) + parseFloat(current.total_amount)
            };
          })
      : { amount: 0, taxes: 0, discount: 0, total_amount: 0 };

  closeSignaturePanel = () => {
    this.setState({
      signatureModalVisible: false
    });
  };

  saveSignature = base64Icon => {
    this.setState({ signatureModalVisible: false, base64Icon });
  };

  openSideBarOrder = () => () => {
    const { dashboardActions } = this.props;
    dashboardActions.fetchSidebarScreenType(SIDEBAR_ROUTE.ORDERS);
    this.props.navigation.toggleDrawer();
  };

  openProductTemplateScreen = () => () => {
    const { dashboardActions } = this.props;
    dashboardActions.fetchSidebarScreenType(
      SIDEBAR_ROUTE.PRODUCT_TEMPLATE,
      this.state.accountId
    );
    this.props.navigation.toggleDrawer();
  };

  onSaveClick = async () => {
    const {
      name,
      accountId,
      date,
      total_amount,
      taxes,
      CurrencyCode,
      order
    } = this.state;

    const {
      auth: {
        profile: { Minimum_Amount }
      }
    } = this.props;
    if (parseInt(total_amount) < Minimum_Amount) {
      const message = `${
        labels.MINIMUM_ORDER_AMOUNT
      }${CurrencyCode} ${Minimum_Amount}`;
      Alert.alert(labels.ORDER, message);
      return;
    }

    const orderRequest = order
      ? order
      : {
          RecordName: name,
          CurrencyCode: CurrencyCode,
          MobileUId_c: name,
          Account_Id_c: accountId,
          OrderDate_c: date,
          Amount_c: roundAmount(parseFloat(total_amount)),
          OrderStatus_c: 'ORA_ACO_ORDER_STATUS_BOOKED',
          PaymentMode_c: '',
          PaymentStatus_c: 'Pending',
          Type_c: 'Order',
          TaxAmount_c: roundAmount(parseFloat(taxes))
        };

    try {
      this.setState({ loading: true });

      const orderResponse = await createNewObject(
        orderRequest,
        API_NAME_POC,
        API_END_POINT.CUSTOMER_ORDER,
        'MobileUId_c',
        SyncPinPriority.High
      );

      if (orderResponse.success) {
        this.setState({ order: orderResponse.object });
        const { Id, RecordName, MobileUId_c } = orderResponse.object;

        const response = await Promise.all(
          [...this.state.orderLineItem].map(lineItem => {
            delete lineItem['selected'];
            const lineItemRequest = {
              ...lineItem,
              Order_Id_c: Id,
              //Order_c: RecordName,
              ParentMobileUId_c: MobileUId_c
            };

            return createNewObject(
              lineItemRequest,
              API_NAME_POC,
              API_END_POINT.ORDER_LINE_ITEM,
              'MobileUId_c',
              SyncPinPriority.Normal
            );
          })
        );

        this.setState({ loading: false, isEdited: false, reloadOrder: true });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  isInventoryAvailable = () => {
    const outOfInventory = [...this.state.orderLineItem].filter(lineItem => {
      const qty = Number.isNaN(parseInt(lineItem.Quantity_c))
        ? 0
        : parseInt(lineItem.Quantity_c);
      const inventory = find(
        [...this.state.inventoryProduct],
        inventory => inventory.__ORACO__Product_Id_c == lineItem.Product_Id_c
      );

      if (qty == 0) return false;

      if (inventory && qty > 0) {
        const sellableQty = Number.isNaN(
          parseInt(inventory.__ORACO__SellableQuantity_c)
        )
          ? 0
          : parseInt(inventory.__ORACO__SellableQuantity_c);

        return sellableQty < qty;
      } else {
        return true;
      }
    });

    if (outOfInventory && !isEmpty(outOfInventory)) return false;
    return true;
  };

  onInvoiceClick = async () => {
    try {
      const invoiceHeader = await fetchObjectCollection(
        API_NAME_POC,
        API_END_POINT.INVOICE_HEADER
      );
      if (invoiceHeader) {
        const invoice = invoiceHeader.filter(
          item =>
            (item.CustomerOrder_Id_c &&
              item.CustomerOrder_Id_c == this.state.order.Id) ||
            item.__ORACO__AuxiliaryAttribute01_c == this.state.order.MobileUId_c
        );
        //||this.state.order.OrderStatus_c != 'ORA_ACO_ORDER_STATUS_DELIVERED'
        if (isEmpty(invoice)) {
          //Invoice is not genrated
          this.onGenrateInvoice();
        } else {
          //Invoice is available
          //TODO: redirect to render PDF screen
          this.navigateToinvoicePdf();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  navigateToinvoicePdf = () => {
    const { navigation } = this.props;
    navigation.navigate(APP_ROUTE.VIEW_PDF, {
      headerTitle: this.state.order ? this.state.order.RecordName : '',
      account: this.state.account,
      order: this.state.order,
      signature: this.state.base64Icon
    });
  };
  onGenrateInvoice = async () => {
    if (!this.isInventoryAvailable()) {
      Alert.alert('', labels.ORDER_INVENTORY_NOT_AVAILABLE);
      return;
    }
    const {
      order,
      accountId,
      discount,
      taxes,
      amount,
      total_amount
    } = this.state;

    try {
      this.setState({ loading: true });
      const name = 'Invoice-' + getCurrentTimestampInGMT();
      const invoiceReq = {
        RecordName: name,
        CurrencyCode: order.CurrencyCode,
        __ORACO__Account_Id_c: accountId,
        __ORACO__Discount_c: discount,
        __ORACO__InvoiceDate_c: getCurrentDateInGMT(),
        __ORACO__SubtotalAmount_c: amount,
        __ORACO__Tax1_c: taxes,
        __ORACO__Tax1Code_c: 'ORA_ACO_TAX_CODE_VAT',
        __ORACO__Tax2_c: 0,
        __ORACO__Tax2Code_c: 'ORA_ACO_TAX_CODE_VAT',
        __ORACO__TotalAmount_c: total_amount,
        __ORACO__ProcessStatus_c: 'ORA_ACO_PROCESS_STATUS_READY',
        CustomerOrder_Id_c: order.Id,
        __ORACO__AuxiliaryAttribute01_c: order.MobileUId_c,
        //CustomerOrder_c: order.RecordName,
        MobileUId_c: name
      };

      const invoiceResponse = await createNewObject(
        invoiceReq,
        API_NAME_POC,
        API_END_POINT.INVOICE_HEADER,
        'MobileUId_c',
        SyncPinPriority.High
      );

      if (invoiceResponse.success) {
        const { Id, RecordName, MobileUId_c } = invoiceResponse.object;

        const responseInvoiceItem = await Promise.all(
          [...this.state.orderLineItem].map(lineItem => {
            let Name =
              'InvoiceLine-' + getCurrentTimestampInGMT() + randomString(5);
            const invoiceLine = {
              RecordName: Name,
              CurrencyCode: lineItem.CurrencyCode,
              __ORACO__DiscountAmount_c: lineItem.__ORACO__DiscountAmount_c,
              __ORACO__Invoice_Id_c: Id,
              //__ORACO__Invoice_c: RecordName,
              __ORACO__ListPrice_c: 10,
              __ORACO__Price_c: lineItem.UnitPrice_c,
              __ORACO__Product_Id_c: lineItem.Product_Id_c,
              __ORACO__Product_c: lineItem.Product_c,
              __ORACO__Quantity_c: lineItem.Quantity_c,
              __ORACO__SKU_c: '',
              __ORACO__Subtotal_c: 0,
              __ORACO__Tax1_c: lineItem.TaxAmount_c,
              __ORACO__Tax1Code_c: '',
              __ORACO__Tax2_c: 0,
              __ORACO__Tax2Code_c: 'ORA_ACO_TAX_CODE_VAT',
              __ORACO__Total_c: 0,
              __ORACO__UOMCode_c: '',
              __ORACO__UOM_c: lineItem.UOM_c,
              __ORACO__Promotion_Id_c: '',
              __ORACO__Promotion_c: '',
              CustomOrderLine_Id_c: lineItem.Id,
              //CustomOrderLine_c: lineItem.RecordName,
              __ORACO__AuxiliaryAttribute01_c: lineItem.MobileUId_c,
              MobileUId_c: Name,
              ParentMobileUId_c: MobileUId_c
            };

            return createNewObject(
              invoiceLine,
              API_NAME_POC,
              API_END_POINT.INVOICE_LINE,
              'MobileUId_c',
              SyncPinPriority.Normal
            );
          })
        );

        await this.updateOrderToDelivered();
      }

      this.setState({ loading: false });
      this.navigateToinvoicePdf();
    } catch (error) {
      console.log(error);
      this.setState({ loading: false });
    }
  };

  updateOrderToDelivered = async () => {
    const { order, accountId } = this.state;

    try {
      this.setState({ loading: true });
      const orderResponse = await createNewObject(
        { ...order, OrderStatus_c: 'ORA_ACO_ORDER_STATUS_DELIVERED' },
        API_NAME_POC,
        API_END_POINT.CUSTOMER_ORDER,
        'MobileUId_c',
        SyncPinPriority.High
      );

      if (orderResponse.success) {
        this.setState({ order: orderResponse.object, reloadOrder: true });
        await [...this.state.orderLineItem].map(async lineItem => {
          const inventory = find(
            [...this.state.inventoryProduct],
            inventory =>
              inventory.__ORACO__Product_Id_c == lineItem.Product_Id_c
          );

          const sellableQty = Number.isNaN(
            parseInt(inventory.__ORACO__SellableQuantity_c)
          )
            ? 0
            : parseInt(inventory.__ORACO__SellableQuantity_c);

          const totalQty = Number.isNaN(
            parseInt(inventory.__ORACO__TotalQuantity_c)
          )
            ? 0
            : parseInt(inventory.__ORACO__TotalQuantity_c);

          const qty = Number.isNaN(parseInt(lineItem.Quantity_c))
            ? 0
            : parseInt(lineItem.Quantity_c);

          try {
            const InventoryRes = await createNewObject(
              {
                ...inventory,
                __ORACO__SellableQuantity_c: sellableQty - qty,
                __ORACO__TotalQuantity_c: totalQty - qty
              },
              API_NAME,
              API_END_POINT.ROUTE_INVENTORY,
              'Id',
              SyncPinPriority.Normal
            );
            // const uniqueTime = getCurrentTimestampInGMT() + randomString(6);

            // const transectionReq = {
            //   __ORACO__Route_Id_c: this.state.routeID,
            //   __ORACO__TransactionDate_c: getCurrentDateInGMT(),
            //   RecordName: 'Transection-' + uniqueTime,
            //   __ORACO__OrderNumber_c: order.Id,
            //   __ORACO__SellableQuantity_c: sellableQty,
            //   __ORACO__OrderLineNumber_c: lineItem.Id,
            //   __ORACO__UOM_c: lineItem.UOM_c,
            //   __ORACO__Account_Id_c: accountId,
            //   __ORACO__Product_Id_c: lineItem.Product_Id_c,
            //   RecordNumber: '' + uniqueTime,
            //   __ORACO__Route_c: this.state.routeName,
            //   __ORACO__Account_c: '',
            //   __ORACO__TransactionQuantity_c: qty,
            //   CurrencyCode: lineItem.CurrencyCode,
            //   __ORACO__Product_c: lineItem.Product_c,
            //   __ORACO__TransactionType_c: 'ORA_ACO_INVTRANS_DELIVERY'
            // };
            // const transection = await createNewObject(
            //   transectionReq,
            //   API_NAME,
            //   API_END_POINT.ROUTE_TRANSECTION,
            //   'MobileUId_c',
            //   SyncPinPriority.Normal
            // );
          } catch (error) {
            this.setState({ loading: false });
          }
        });

        this.setState({ loading: false });
      } else {
        this.setState({ loading: false });
      }
    } catch (error) {
      this.setState({ loading: false });
    }
  };

  onPromotionsClick = async () => {
    const { navigation } = this.props;
    navigation.navigate(APP_ROUTE.PROMOTIONS, {
      accountId: this.state.accountId,
      orderItems: [...this.state.orderLineItem]
    });
  };

  onSubmitClick = async () => {
    if (this.isInventoryAvailable()) {
      const { order } = this.state;

      try {
        this.setState({ loading: true });

        const orderResponse = await createNewObject(
          { ...order, OrderStatus_c: 'ORA_ACO_ORDER_STATUS_SUBMITTED' },
          API_NAME_POC,
          API_END_POINT.CUSTOMER_ORDER,
          'MobileUId_c',
          SyncPinPriority.High
        );

        if (orderResponse.success) {
          this.setState({ order: orderResponse.object, reloadOrder: true });

          this.setState(
            {
              loading: false
            },
            () => {
              setTimeout(() => {
                Alert.alert('', labels.ORDER_SAVE);
              }, 200);
            }
          );
        } else {
          this.setState({ loading: false });
        }
      } catch (error) {
        this.setState({ loading: false });
      }
    } else {
      Alert.alert('', labels.ORDER_INVENTORY_NOT_AVAILABLE);
    }
  };

  componentWillUnmount() {
    const { customersActions } = this.props;
    if (this.state.reloadOrder) customersActions.reloadOrder(true);
  }

  goBack = () => {
    const { navigation } = this.props;
    navigation.goBack();
  };

  render() {
    const {
      signatureModalVisible,
      currentModalTitle,
      resetSignature,
      number,
      name,
      date,
      draft,
      promo_code,
      promo_detail,
      amount,
      taxes,
      discount,
      total_amount,
      products,
      dropdownList,
      selectedProduct,
      orderLineItem,
      base64Icon,
      CurrencyCode,
      isEdited,
      order,
      promotions
    } = this.state;

    return (
      <SafeAreaView
        style={{
          flex: 1
        }}
      >
        <Scanner
          visible={this.state.showBarcodeModal}
          onBarCodeRead={this.onBarCodeRead}
          onBarCodeReadCancel={this.onBarCodeReadCancel}
        />
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          enabled
          keyboardVerticalOffset={50}
        >
          <Loader loading={this.state.loading} />
          <Header
            isSubmitted={
              this.state.order &&
              this.state.order.OrderStatus_c !== 'ORA_ACO_ORDER_STATUS_BOOKED'
            }
            isBooked={
              this.state.order &&
              this.state.order.OrderStatus_c == 'ORA_ACO_ORDER_STATUS_BOOKED' &&
              !isEdited
            }
            onSubmitClick={this.onSubmitClick}
            onSaveClick={this.onSaveClick}
            onInvoiceClick={this.onInvoiceClick}
            onPromotionsClick={this.onPromotionsClick}
          />
          <ScrollView
            style={{
              padding: 20
            }}
          >
            <View
              style={
                Platform.OS === 'ios' && {
                  zIndex: 2,
                  position: 'relative'
                }
              }
            >
              <View
                style={{
                  flexDirection: 'row',
                  paddingBottom: 10
                }}
              >
                <Text
                  style={[
                    styles.attrTitleTextStyle,
                    { color: APP_THEME.APP_BASE_COLOR }
                  ]}
                >
                  {order ? order.Id : number}
                </Text>
                <Text style={[styles.dateTextStyle, { textAlign: 'right' }]}>
                  {date}
                </Text>
              </View>
              <Text style={[styles.nameTextStyle]}>
                {order ? order.RecordName : name}
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row'
                }}
              >
                <View style={{ flex: 1.2 }}>
                  {this.renderAttribute(
                    labels.STATUS,
                    order ? getOrderStatus(order.OrderStatus_c) : labels.DRAFT
                  )}
                  {/* {this.renderAttribute(labels.PROMO_CODE, promo_code)}
                  {this.renderAttribute(labels.PROMO_DETAILS, promo_detail)} */}
                </View>
                <View
                  style={{
                    flex: 0.8,
                    marginLeft: 10
                  }}
                >
                  {this.renderAttribute(
                    labels.AMOUNT,
                    formatAmount(parseFloat(amount), CurrencyCode),
                    {
                      textAlign: 'right'
                    }
                  )}
                  {this.renderAttribute(
                    labels.TAXES,
                    formatAmount(parseFloat(taxes), CurrencyCode),
                    {
                      textAlign: 'right'
                    }
                  )}
                  {this.renderAttribute(
                    labels.DISCOUNT,
                    formatAmount(parseFloat(discount), CurrencyCode),
                    {
                      textAlign: 'right'
                    }
                  )}
                  {this.renderAttribute(
                    labels.TOTAL_AMOUNT,
                    formatAmount(parseFloat(total_amount), CurrencyCode),
                    {
                      textAlign: 'right'
                    }
                  )}
                </View>
              </View>
              <Text
                style={[
                  styles.attrTitleTextStyle,
                  { color: APP_THEME.APP_BASE_COLOR }
                ]}
              >
                {`${labels.ORDER_ITEMS}${':'}`}
              </Text>
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    flex: 1.2
                  }}
                >
                  <AutoCompleteInput
                    options={dropdownList}
                    fieldName="product"
                    placeholder={labels.PRODUCT_SEARCH}
                    isFormEditable
                    isInsideScrollView
                    leftView={this.inputLeftView()}
                    rightView={this.inputRightView()}
                    onValueChange={this.onValueChange}
                  />
                </View>
                <View
                  style={{
                    flex: 0.8,
                    marginLeft: 20,
                    flexDirection: 'row',
                    paddingTop: 5
                  }}
                >
                  {/* <TouchableOpacity
                    style={styles.listContainer}
                    onPress={this.openSideBarOrder()}
                  >
                    <Text style={styles.listIconStyle}></Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.listContainer, { marginLeft: 10 }]}
                    onPress={this.openProductTemplateScreen()}
                  >
                    <Text style={styles.listIconStyle}></Text>
                  </TouchableOpacity> */}
                  <TouchableOpacity
                    style={styles.signatureButtonStyle}
                    onPress={() =>
                      this.setState({ signatureModalVisible: true })
                    }
                  >
                    <Text
                      style={[
                        styles.signatureBtnTextStyle,
                        { color: APP_THEME.APP_BASE_FONT_COLOR }
                      ]}
                    >
                      <Text style={styles.editIconStyle}> </Text>
                      Signature
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View
              style={
                Platform.OS === 'ios'
                  ? styles.viewFlatListIOS
                  : styles.viewFlatListAndroid
              }
            >
              <FlatList
                data={orderLineItem}
                keyExtractor={this._keyExtractor}
                renderItem={this.renderItem}
                removeClippedSubviews={false}
              />

              {base64Icon ? (
                <View style={styles.signatureContainer}>
                  <Text
                    style={[
                      styles.attrTitleTextStyle,
                      {
                        fontSize: 14,
                        marginBottom: 10,
                        color: APP_THEME.APP_BASE_COLOR
                      }
                    ]}
                  >
                    {labels.CUSTOMER_SIGNATURE}
                  </Text>
                  <Image
                    style={{
                      resizeMode: 'contain',
                      height: 120
                    }}
                    source={{ uri: base64Icon }}
                  />
                </View>
              ) : null}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
        <SignatureModal
          signatureModalVisible={signatureModalVisible}
          clearSignature={resetSignature}
          signatureModalTitle={currentModalTitle}
          closeSignaturePanel={this.closeSignaturePanel}
          saveSignature={this.saveSignature}
          base64Icon={this.base64Icon}
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F8F8F8'
  },
  nameTextStyle: {
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    paddingBottom: 10
  },
  dateTextStyle: {
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 14,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    flex: 2
  },
  attrTitleTextStyle: {
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 16,
    fontWeight: '600',
    color: APP_THEME.APP_COLOR_DARK_BLACK,
    flex: 1.5,
    paddingBottom: 5
  },
  attrValueTextStyle: {
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_REGULAR,
    fontSize: 16,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    flex: 2,
    paddingBottom: 5
  },
  attrValueBoldTextStyle: {
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 16,
    color: APP_THEME.APP_LIST_FONT_COLOR,
    flex: 2,
    paddingBottom: 5
  },
  leftContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
  },
  leftIconStyle: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 20,
    textAlign: 'center',
    width: 25,
    height: 25
  },
  rightContainer: {
    width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  rightIconStyle: {
    color: APP_THEME.APP_BASE_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 25,
    textAlign: 'center',
    width: 25,
    height: 25
  },
  signatureButtonStyle: {
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    marginLeft: 8,
    borderRadius: 2,
    position: 'absolute',
    right: 0,
    marginTop: 5
  },
  signatureBtnTextStyle: {
    color: APP_THEME.APP_STEPPER_BUTTON_COLOR,
    fontFamily: APP_FONTS.FONT_SEMIBOLD,
    fontSize: 14,
    alignItems: 'center',
    fontWeight: '600',
    lineHeight: 18
  },
  listContainer: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: APP_THEME.APP_BASE_COLOR,
    borderRadius: 25
  },
  listIconStyle: {
    color: APP_THEME.APP_BASE_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 20,
    textAlign: 'center'
  },
  editIconStyle: {
    color: APP_THEME.APP_BASE_FONT_COLOR,
    fontFamily: APP_FONTS.FONT_MATERIAL_DESIGN,
    fontSize: 14,
    textAlign: 'center'
  },
  signatureContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: APP_THEME.APP_LIST_BORDER_COLOR,
    borderRadius: 2,
    padding: 20,
    marginTop: 20
  },
  viewFlatListIOS: {
    flex: 1,
    zIndex: 1,
    position: 'relative',
    minHeight: 500,
    marginBottom: 30
  },
  viewFlatListAndroid: {
    flex: 1,
    minHeight: 500,
    marginBottom: 30,
    paddingTop: 60
  }
});
