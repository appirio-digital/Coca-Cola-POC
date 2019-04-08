//
//  RouteCheckInHistory.m
//  JTISales
//
//  Created by Appirio-13951 on 12/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RouteCheckInHistory.h"

@implementation RouteCheckInHistory
@synthesize RecordName,__ORACO__CheckInLatitude_c,__ORACO__CheckInLongitude_c,__ORACO__CheckInTime_c,__ORACO__CheckInSalesRep_Id_c,__ORACO__CheckInSalesRep_c,__ORACO__CheckOutLatitude_c,__ORACO__CheckOutLongitude_c,__ORACO__CheckOutTime_c,Id,__ORACO__CheckOutSalesRep_Id_c,__ORACO__CheckOutSalesRep_c,__ORACO__Route_c,__ORACO__Route_Id_c,__ORACO__Plate_c,__ORACO__Date_c;


+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}
@end
