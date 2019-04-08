//
//  SyncManagerBridge.m
//  JTISales
//
//  Created by umangshu on 04/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(SyncManager, NSObject)

- (dispatch_queue_t)methodQueue
{
  return dispatch_queue_create("com.JTISales.ReactBridge.OMCClient", DISPATCH_QUEUE_SERIAL);
}

RCT_EXTERN_METHOD(AuthenticateMCS:(NSString *)username password:(NSString *)password resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(authenticateAnonymousMCS:(RCTPromiseResolveBlock)resolve  reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(logoutMCS:(RCTPromiseResolveBlock)resolve  reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(authenticateSSO:(RCTPromiseResolveBlock)resolve  reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(deleteObject:(NSString *)idValue diffrentiator:(NSString *)diffrentiator apiName:(NSString *)apiName endPoint:(NSString *)endPoint resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(createNewObject:(NSDictionary *)objectJSON apiName:(NSString *)apiName endPoint:(NSString *)endPoint diffrentiator:(NSString *)diffrentiator isPinHigh:(NSString *)isPinHigh resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(updateObject:(NSDictionary *)objectJSON apiName:(NSString *)apiName endPoint:(NSString *)endPoint diffrentiator:(NSString *)diffrentiator resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(fetchObject:(NSString *)objectWithId apiName:(NSString *)apiName endPoint:(NSString *)endPoint resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(fetchFile:(NSString *)apiName endPoint:(NSString *)endPoint resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(createNewFile:(NSString *)fileName fileType:(NSString *)fileType filePath:(NSString *)filePath apiName:(NSString *)apiName endPoint:(NSString *)endPoint resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(fetchObjects:(NSString *)apiName endPoint:(NSString *)endPoint resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(eraseLocalDatabase:(RCTPromiseResolveBlock)resolve  reject:(RCTPromiseRejectBlock)reject);




RCT_EXTERN_METHOD(removeAllStoredCollections);
RCT_EXTERN_METHOD(loadDataForEntity: (NSString *)apiName endPoint:(NSString *)endPoint resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);


RCT_EXTERN_METHOD(reload:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(syncAll:(NSString*)fromServer resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);
//New

RCT_EXTERN_METHOD(invokeCustomAPI:(NSDictionary *)objectJSON apiName:(NSString *)apiName endPoint:(NSString *)endPoint resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(supportedEvents);

RCT_EXTERN_METHOD(setOfflineMode:(NSDictionary *)isOffline);
RCT_EXTERN_METHOD(hasLocalRecords:(RCTPromiseResolveBlock)resolve  reject:(RCTPromiseRejectBlock)reject);


RCT_EXTERN_METHOD(updateCountryCode:(NSString *)country);


//Functions

//Offline Records Sync
RCT_EXTERN_METHOD(uploadOfflineResourcesToServer:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);


//Unused
RCT_EXTERN_METHOD(fetchObjectsWithFilters:(NSArray *)filters apiName:(NSString *)apiName endPoint:(NSString *)endPoint resolve:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

RCT_EXTERN_METHOD(fetchSampleBusinessRulesJSON:(RCTPromiseResolveBlock)resolve reject:(RCTPromiseRejectBlock)reject);

@end
