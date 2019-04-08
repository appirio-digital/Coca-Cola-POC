//
//  RouteCheckInHistory.h
//  JTISales
//
//  Created by Appirio-13951 on 12/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "OMCMobileObject.h"

@interface RouteCheckInHistory : OMCMobileObject
@property(nonatomic,strong) NSString*__nullable RecordName;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckInLatitude_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckInLongitude_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckInTime_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckInSalesRep_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckInSalesRep_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckOutLatitude_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckOutLongitude_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckOutTime_c;
@property(nonatomic,strong) NSString*__nullable Id;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckOutSalesRep_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckOutSalesRep_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Route_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Route_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Plate_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Date_c;

@end
