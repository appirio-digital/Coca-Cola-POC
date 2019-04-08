//
//  Activity.h
//  JTISales
//
//  Created by Appirio-13951 on 29/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OMCMobileObject.h"

@interface Activity : OMCMobileObject
@property (nonatomic, strong) NSString*__nullable ActivityFunctionCode;
@property(nonatomic,strong) NSString*__nullable ActivityNumber;
@property(nonatomic,strong) NSString*__nullable ActivityId;
@property(nonatomic,strong) NSString*__nullable OwnerId;
@property(nonatomic,strong) NSString*__nullable Subject;
@property(nonatomic,strong) NSString*__nullable AccountName;
@property(nonatomic,strong) NSString*__nullable ActivityStartDate;
@property(nonatomic,strong) NSString*__nullable ActivityEndDate;
@property(nonatomic,strong) NSString*__nullable DueDate;
@property(nonatomic,strong) NSString*__nullable AccountId;
@property(nonatomic,strong) NSString*__nullable StatusCode;
@property(nonatomic,strong) NSString*__nullable ActivityTypeCode;
@property(nonatomic,strong) NSString*__nullable __ORACO__VisitStatusFCL_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Route_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckOutLongitude_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Route_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__StoreVisitType_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckInLongitude_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckInLatitude_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckOutTime_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__VisitStatus_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__AppointmentName_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckOutLatitude_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckInTime_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__StoreVisitType_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__StoreVisit_c;
@property(nonatomic,strong)NSString *__nullable MobileAppUId_c;

+ (NSComparisonResult) compare:(id)otherClass;



@end
