//
//  OMCSDKModulesTracker.h
//  OMCCore
//
//  Created by Jay Vachhani on 12/5/17.
//  Copyright © 2017 Oracle. All rights reserved.
//

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Tracker for SDK modules, provides const values for all sdk modules to be passed on request header.
 */
@interface OMCSDKModulesTracker : NSObject
@end

extern NSString* const OMCSDKAuthorizationModuleName;

extern NSString* const OMCSDKSyncModuleName;

extern NSString* const OMCSDKStorageModuleName;

extern NSString* const OMCSDKNotificationsModuleName;

extern NSString* const OMCSDKUserManagementModuleName;

extern NSString* const OMCSDKAppConfigModuleName;

extern NSString* const OMCSDKLocationModuleName;

extern NSString* const OMCSDKMCSAnalyticsModuleName;

extern NSString* const OMCSDKCustomCodeModuleName;

NS_ASSUME_NONNULL_END
