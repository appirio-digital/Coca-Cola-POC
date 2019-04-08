import { NativeModules } from 'react-native';
import { SyncPinPriority, findAPIName } from './omcClient';

const kgenericDiffrentiator = 'id';

/**
 * By default each entity will have id which acts as a diffrentiator to decide whether to create new object or to update the existing.
 * @param {*} objectName - apiName or object name for which new object needs to be created
 * @param {*} payload - json payload of the new object.
 *
 */
const insert = (objectName, payload) => {
  //We call the business rules and wait for their response.
  return NativeModules.SyncManager.createNewObject(
    payload,
    findAPIName(objectName),
    objectName,
    kgenericDiffrentiator,
    SyncPinPriority.Normal
  );
};

/**
 * By default each entity will have id which acts as a diffrentiator to decide whether to create new object or to update the existing.
 * @param {*} objectName - apiName or object name for which new object needs to be updated.
 * @param {*} payload - json payload of the object which needs to be updated including the id field value.
 *
 */
const update = (objectName, payload) => {
  return NativeModules.SyncManager.createNewObject(
    payload,
    findAPIName(objectName),
    objectName,
    kgenericDiffrentiator,
    SyncPinPriority.Normal
  );
};

/**
 * Will return all objects stored locally for given object name.
 * @param {*} objectName For which records needs to be retrived.
 */
const findAll = objectName => {
  return NativeModules.SyncManager.fetchObjects(
    findAPIName(objectName),
    objectName
  );
};

/**
 * This method will return the objects matching the query provided in query string.
 * Final output will look like:
 * https://jtiodcmcs-ehjz.mobileenv.us2.oraclecloud.com:443/mobile/custom/JTI_SALES/Accounts?AccountName='SAM'
 * * https://jtiodcmcs-ehjz.mobileenv.us2.oraclecloud.com:443/mobile/custom/JTI_SALES/Accounts?AccountName='SAM'&EmailAddress='sam@appirio.com'
 * @param {*} objectName Object's name which needs to be queried.
 * @param {*} filter filter which needs to be applied. like: AccountName='SAM'.
 * If you want to add multiple query parameters then append string using &.
 * AccountName='SAM'&EmailAddress='sam@appirio.com'
 */
const find = (objectName, filters) => {
  return NativeModules.SyncManager.fetchObjectsWithFilters(
    filters,
    findAPIName(objectName),
    objectName
  );
};

/**
 * Method  will call bridge deleteObject method which fetch object using id diffrentiator and then delete if locally
 * and from server if network is online.
 * @param {*} objectName object's name.
 * @param {*} id value for the object's id which needs to be deleted.
 */
const deleteObject = (objectName, id) => {
  return NativeModules.SyncManager.deleteObject(
    id,
    kgenericDiffrentiator,
    findAPIName(objectName),
    objectName
  );
};

const checkForNewAccount = (dbLayer, jsonAccountPayload) => {
  const { PartyNumber } = jsonAccountPayload;
  var d = new Date(),
    month = '' + (d.getMonth() + 1),
    day = '' + d.getDate(),
    year = d.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  const DueDate = [year, month, day].join('-');

  return new Promise((resolve, reject) => {
    if (!PartyNumber || !DueDate) {
      return reject('Invalid Param.');
    }
    return dbLayer
      .findAll('Accounts')
      .then(results => {
        const filteredAccounts = results.filter(account => {
          return account.PartyNumber === PartyNumber;
        });
        if (!filteredAccounts || filteredAccounts.length == 0) {
          return Promise.reject('Invalid Param.');
        }
        const account = filteredAccounts[0];
        const { OrganizationDEO_JTI_ShopSize_c, PartyId } = account;
        if (parseInt(OrganizationDEO_JTI_ShopSize_c) <= 100) {
          return Promise.resolve(true);
        }
        const activityPayload = {
          ActivityFunctionCode: 'TASK',
          Subject: 'Review New Account',
          DueDate: DueDate,
          AccountId: PartyId,
          StatusCode: 'NOT_STARTED',
          ActivityTypeCode: 'MEETING',
          __ORACO__VisitStatusFCL_c: 'ORA_ACO_VISIT_STATUS_NSTARTED',
          __ORACO__VisitStatus_c: 'Not Started',
          __ORACO__AppointmentName_c: 'Review New Account',
          __ORACO__StoreVisit_c: 'true'
        };
        return dbLayer.insert('activities', activityPayload);
      })
      .then(res => {
        return resolve(true);
      })
      .catch(err => {
        return reject(err);
      });
  });
};

export default {
  insert,
  update,
  deleteObject,
  find,
  findAll
};
