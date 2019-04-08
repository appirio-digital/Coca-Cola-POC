//
//  Activity.m
//  JTISales
//
//  Created by Appirio-13951 on 29/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "Activity.h"

@implementation Activity
@synthesize ActivityFunctionCode ,ActivityNumber,ActivityId,OwnerId , Subject , AccountName , ActivityStartDate , ActivityEndDate , DueDate , AccountId,StatusCode,ActivityTypeCode,__ORACO__VisitStatusFCL_c,__ORACO__Route_c,__ORACO__CheckOutLongitude_c , __ORACO__Route_Id_c,__ORACO__StoreVisitType_Id_c , __ORACO__CheckInLongitude_c  ,__ORACO__CheckInLatitude_c , __ORACO__CheckOutTime_c,__ORACO__VisitStatus_c,__ORACO__AppointmentName_c , __ORACO__CheckOutLatitude_c , __ORACO__CheckInTime_c , __ORACO__StoreVisitType_c,__ORACO__StoreVisit_c,MobileAppUId_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}

- (void)populateChildsWithIds{
  
}

@end
