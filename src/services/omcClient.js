import { NativeModules, NativeEventEmitter, Alert } from 'react-native';
import JSONfn from 'json-fn';
import SyncObject from './sync.json';
import DBLayer from './DBLayer';
import { labels } from '../stringConstants';
import {
  Click,
  executeBusinessRulesAndPerformCRUDOperation
} from '../screens/customers/customer/detail/Observer';
import Buffer from 'buffer';
import CustomerSampleJSON from './DummyJson/Customer.json';
import ProductGroupProductSetup from './DummyJson/ProductGroupProductSetup.json';
import setupSalesCatalogs from './DummyJson/setupSalesCatalogs.json';
import Products from './DummyJson/Products.json';
import Activity from './DummyJson/Activity.json';
import Order from './DummyJson/CustomOrder.json';
import OrderLineItem from './DummyJson/CustomOrderLine.json';
import PriceBookHeader from './DummyJson/PriceBookHeader.json';
import PriceBookLine from './DummyJson/PriceBookLine.json';
import Invoice from './DummyJson/Invoice.json';
import InvoiceLineItem from './DummyJson/InvoiceLineItem.json';
import Route from './DummyJson/Route.json';
import RouteAllocation from './DummyJson/RouteAllocation.json';
import RouteInventory from './DummyJson/RouteInventory.json';
import Template from './DummyJson/check.json';

export const API_END_POINT = {
  ACCOUNT: 'Accounts',
  ACTIVITY: 'activity',
  PRODUCT: 'products',
  PRODUCT_CATEGORY: 'setupSalesCatalogs',
  CONTACT: 'contacts',
  PRODUCT_CATEGORY_MAPPING: 'ProductGroupProductSetup',
  PRICE_BOOK_HEADER: 'priceBookHeaders',
  ROUTE: 'ORACO__Route_c',
  ROUTE_INVENTORY: 'ORACO__RouteInventory_c',
  ROUTE_ALLOCATION: 'ORACO__RouteAllocation_c',
  USER_PROFILE: 'PartyResource',
  ROUTE_CHIECKIN: 'ORACO__RouteCheckInHist_c',
  ROUTE: 'ORACO__Route_c',
  INVOICE_HEADER: 'ORACO__InvoiceDSD_c',
  INVOICE_LINE: 'ORACO__InvoiceLineDSD_c',
  CUSTOMER_ORDER: 'CustomOrder_c',
  PRODUCT_TEMPLATE: 'ORACO__ShoppingCartTmpl_c',
  PRICE_BOOK: '/priceBookHeaders?Name=',
  PRICE_BOOK_ITEM: 'priceBookItemId?priceBookId=',
  INVOICE_PAYMENT_LINE: 'ORACO__PaymentLineDSD_c',
  INVOICE_PAYMENT: 'ORACO__PaymentDSD_c',
  ORDER_LINE_ITEM: 'CustomOrderLine_c',
  PROMOTIONS: 'ORACO__Promotion_c',
  ROUTE_INVENTORY_TRANSACTION: 'RouteInvTransDSD_c',
  ACTIVITY_APPROVAL_SERVICE: 'JTIPCSProcess',
  ROUTE_TRANSECTION: 'RouteInvTransDSD_c',
  WORKFLOW_RULE: 'workflowrules',
  //New
  CUSTOMERS: 'Customer',
  CONFIGURATION_RULE: 'configurationrules',
  INVOICE_TEMPLATE: 'check'
};

export const TriggerType = {
  onCreate: 'onCreate',
  onUpdate: 'onUpdate',
  onDelete: 'onDelete',
  onRead: 'onRead'
};

export const TriggerWhen = {
  before: 'before',
  after: 'after'
};

export const SyncPinPriority = {
  High: '1',
  Normal: '0'
};

export const ALL_API_ENDPOINTS = Object.entries(API_END_POINT).map(
  ([_, value]) => {
    return value;
  }
);

export const findAPIName = endPoint => {
  for (const value of Object.values(SyncObject)) {
    if (value.API === `${endPoint}`) {
      console.log('value.ROOT_NAME', value.ROOT_NAME);
      return value.ROOT_NAME;
    }
  }
  return true;
};

export const OPRATIONS = {
  EQUALS: 'Equals',
  NOT_EQUALS: 'NotEquals',
  LESS_THEN: 'LessThan',
  GREATER_THEN: 'GreaterThan',
  LESS_THEN_OR_EQUAL: 'LessThanOrEqual',
  GREATER_THEN_OR_EQUAL: 'GreaterThanOrEqual'
};

export const API_NAME = 'JTI_SALES';
export const API_NAME_POC = 'JTI_SALESPOC';
export const API_NAME_MCS = 'JTI_SALES_MCS';
export const API_NAME_WORKFLOW_RULE = 'WorkflowRule';
export const API_JTI_CUSTOMER_API = 'JTI_CUSTOMER_API';
export const JTI_API = 'JTI_API';

export const API_NAME_CONFIGURATION_RULE = 'Business_RuleAPI';
export const API_TEMPLATE = 'JTI_Templates';

export const authenticateAnonymousMCS = () =>
  NativeModules.SyncManager.authenticateAnonymousMCS();

export const authenticateMCS = (email, password) =>
  NativeModules.SyncManager.AuthenticateMCS(email, password);

export const logoutMCSUser = () => NativeModules.SyncManager.logoutMCS();

export const fetchObjectCollection = async (apiName, endPoint) => {
  let sampleJSON = [];
  switch (endPoint) {
    case 'Customer':
      sampleJSON = CustomerSampleJSON;
      break;
    case 'ProductGroupProductSetup':
      sampleJSON = ProductGroupProductSetup;
      break;
    case 'setupSalesCatalogs':
      sampleJSON = setupSalesCatalogs;
      break;
    case 'products':
      sampleJSON = Products;
      break;
    case 'activity':
      sampleJSON = Activity;
      break;
    case 'CustomOrder_c':
      sampleJSON = Order;
      break;
    case 'CustomOrderLine_c':
      sampleJSON = OrderLineItem;
      break;
    case 'ORACO__InvoiceDSD_c':
      sampleJSON = Invoice;
      break;
    case 'ORACO__InvoiceLineDSD_c':
      sampleJSON = InvoiceLineItem;
      break;
    case 'ORACO__Route_c':
      sampleJSON = Route;
      break;
    case 'ORACO__RouteAllocation_c':
      sampleJSON = RouteAllocation;
      break;
    case 'ORACO__RouteInventory_c':
      sampleJSON = RouteInventory;
      break;
    case 'check':
      sampleJSON = Template;
      break;
  }

  if (endPoint.includes(API_END_POINT.PRICE_BOOK)) {
    sampleJSON = PriceBookHeader;
  }

  if (endPoint.includes(API_END_POINT.PRICE_BOOK_ITEM)) {
    sampleJSON = PriceBookLine;
  }
  return Promise.resolve(sampleJSON);
  //return NativeModules.SyncManager.fetchObjects(apiName, endPoint);
};

/**
 * Fetch the Object based on provided filter
 * @param {*} filter - Key value pair filter
 * @param {*} apiName - API Name
 * @param {*} endPoint - End Point/Entitiy Name
 */
export const fetchObjectWithFilter = async (filter, apiName, endPoint) => {
  return NativeModules.SyncManager.fetchObjectsWithFilters(
    filter,
    apiName,
    endPoint
  );
};

/**
 * Add entry to API_END_POINT collection to load the data into local storage.
 */
export const loadAllData = () =>
  NativeModules.SyncManager.loadData(API_NAME, ALL_API_ENDPOINTS);

export const loadData = endpoint =>
  NativeModules.SyncManager.loadData(API_NAME, [endpoint]);

export const deleteObject = async (json, apiName, endPoint, diffrentiator) => {
  return NativeModules.SyncManager.deleteObject(
    json['diffrentiator'],
    diffrentiator,
    apiName,
    endPoint
  );
};

/**
 * Will check for the business rules first and execute the create/update operation.
 * @param {*} json JSON of the object which you need to create on cloud.
 * @param {*} apiName API Name
 * @param {*} endPoint Endpoint
 * @param {*} diffrentiator the unique key which diffrentiate the objects.
 * @param {*} isPinHigh the priority to upload the objects in order, High will upload first.
 */
export const createNewObject = async (
  json,
  apiName,
  endPoint,
  diffrentiator,
  isPinHigh
) => {
  return Promise.resolve({ success: true, object: json });
};

const applyTriggersToCRUDOperation = async (
  endPoint,
  triggerType,
  json,
  callbackCRUDFunctions,
  args
) => {
  try {
    var triggerType = TriggerType.onCreate;
    //Considering that Id field would be available in all the APIs.
    if (json.hasOwnProperty('id')) {
      triggerType = TriggerType.onUpdate;
    }

    //First execute triggers which needs to be fired before CRUD operatiton.
    await findAndExecuteBusinessRules(
      endPoint,
      triggerType,
      TriggerWhen.before,
      json
    );

    //Now perform the CRUD operation.
    const createResponse = callbackCRUDFunctions.apply(this, args);

    //First execute triggers which needs to be fired before CRUD operatiton.
    await findAndExecuteBusinessRules(
      endPoint,
      triggerType,
      TriggerWhen.after,
      json
    );

    return Promise.resolve(createResponse);
  } catch (error) {
    return Promise.reject(error);
  }
};

const createNewObjectOnBridge = (
  json,
  apiName,
  endPoint,
  diffrentiator,
  isPinHigh
) => {
  //return { success: true, object: {} };
  return NativeModules.SyncManager.createNewObject(
    json,
    apiName,
    endPoint,
    diffrentiator,
    isPinHigh
  );
};

export const fetchConfigurationRule = async () => {
  try {
    const configurationRulesResponse = await fetchObjectCollection(
      API_NAME_CONFIGURATION_RULE,
      API_END_POINT.CONFIGURATION_RULE
    );
    return Promise.resolve(configurationRulesResponse);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchBusinessRule = async (endPoint, type, when) => {
  try {
    const businessRulesResponse = await fetchObjectCollection(
      API_NAME_WORKFLOW_RULE,
      API_END_POINT.WORKFLOW_RULE
    );
    //const businessRuleJSONs = JSONfn.parse(businessRulesResponse);
    const filteredBusinessRuleJSONs = businessRulesResponse
      .filter(businessRuleJSON => {
        return (
          businessRuleJSON.object === endPoint &&
          businessRuleJSON.trigger === type &&
          businessRuleJSON.when === when
        );
      })
      .map(businessRuleJSON => {
        let decodedJSFunction = new Buffer.Buffer(
          businessRuleJSON.attachment,
          'base64'
        );
        return JSONfn.parse(
          JSONfn.stringify({
            ...businessRuleJSON,
            attachment: decodedJSFunction.toString()
          })
        );
      });
    console.log('FETCHED RULES', filteredBusinessRuleJSONs);
    return Promise.resolve(filteredBusinessRuleJSONs);
  } catch (error) {
    return Promise.reject(error);
  }
};

export const loadDataForEntity = (rootPoint, endPoint) => {
  return NativeModules.SyncManager.loadDataForEntity(rootPoint, endPoint);
};

export const loadLocalForEntity = async (parent, child) => {
  try {
    const response = await NativeModules.SyncManager.fetchObjects(
      parent.ROOT_NAME,
      parent.API
    );
    if (response) {
      return response.map(master => {
        const API = parent.API + '/' + master[child.dependencyOn] + child.API;
        return loadDataForEntity(parent.ROOT_NAME, API);
      });
    } else {
      return Promise.reject('Not Parent Data Found');
    }
  } catch (ex) {
    return Promise.reject(ex);
  }
};

export const syncData = async (syncAll, country) => {
  try {
    //let requestPromise = []
    for (const value of Object.values(SyncObject)) {
      if (!syncAll && value.isMaster) continue;

      if (!value.dependency) {
        if (value.API == 'priceBookHeaders') {
          value.API = 'priceBookHeaders?Name=' + country;
        }
        const response = await loadDataForEntity(value.ROOT_NAME, value.API);
        if (response && value.API == 'priceBookHeaders?Name=' + country) {
          const response = await NativeModules.SyncManager.fetchObjects(
            value.ROOT_NAME,
            value.API
          );
          if (response) {
            response.map(async master => {
              const { PricebookId } = master;
              const API = 'priceBookItemId?priceBookId=' + PricebookId;
              await loadDataForEntity(value.ROOT_NAME, API);
            });
          }
        }
      }
    }

    return true;

    /**
     *  Loading PricebookItem in Loop as per Technical decision advices on this.
     */
    // for (const value of Object.values(SyncObject)) {
    //   if (!syncAll && value.isMaster) continue;

    //   if (value.dependency) {
    //     if (value.dependency == 'priceBookHeaders') {
    //       try {
    //         const response = await NativeModules.SyncManager.fetchObjects(
    //           API_NAME,
    //           parent.API
    //         );
    //         if (response) {
    //           response.map(async master => {
    //             const API =
    //               parent.API + '/' + master[child.dependencyOn] + child.API;
    //             await loadDataForEntity(API);
    //           });
    //         }
    //       } catch (ex) {}
    //     }
    //   }
    // }

    // requestPromise = [];

    // for (const value of Object.values(SyncObject)) {
    //   if (!syncAll && value.isMaster) continue;

    //   if (value.dependency) {
    //     const promiseList = await loadLocalForEntity(
    //       SyncObject[value.dependency],
    //       value
    //     );
    //     requestPromise = [...requestPromise, ...promiseList];
    //   }
    // }

    // return await Promise.all(requestPromise);
  } catch (ex) {
    return false;
  }
};

/** Upload and downlaod records from server  */

export const syncAllData = () => {
  NativeModules.SyncManager.syncAll('true');
};
/** Erase Local Database */
export const eraseDatabase = () =>
  NativeModules.SyncManager.eraseLocalDatabase();

/** Check if local records pending to sync over server  */
export const hasLocalDatabaseRecords = () => {
  return Promise.resolve({
    LocalCounts: 0,
    FailedCounts: 0
  });
};

export const uploadRecords = () => {
  NativeModules.SyncManager.syncUp();
};

export const downloadRecords = () => {
  NativeModules.SyncManager.syncDown();
};

//New SyncUp and SyncDown Function
export const syncDown = () => {};

/**
 * Download file with Id
 * @param {100000000756353/child/ProductImageAttachments} fileId
 * @param {JTI_Sales} apiName
 * @param {products} endPoint
 */
export const fetchFile = (apiName, endPoint) =>
  NativeModules.SyncManager.fetchFile(apiName, endPoint);

export const createNewFile = (
  fileName,
  fileType,
  filePath,
  apiName,
  endPoint
) =>
  NativeModules.SyncManager.createNewFile(
    fileName,
    fileType,
    filePath,
    apiName,
    endPoint
  );

// New Sync Feature implementation
export const hasCollectionRecordsToReload = () => {
  NativeModules.SyncManager.hasCollectionRecordsToReload();
};

export const updateCountryCode = country => {
  NativeModules.SyncManager.updateCountryCode(country);
};

export const invokeCustomAPI = (json, apiName, endPoint) =>
  NativeModules.SyncManager.invokeCustomAPI(json, apiName, endPoint);

export const fetchSampleBusinessRulesJSON = () =>
  NativeModules.SyncManager.fetchSampleBusinessRulesJSON();
