//
//  RouteInventory.m
//  JTISales
//
//  Created by Appirio-13951 on 12/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "RouteInventory.h"

@implementation RouteInventory
@synthesize __ORACO__UnsellableQuantity_c,__ORACO__Route_Id_c,__ORACO__UOMCode_c,RecordName,__ORACO__SellableQuantity_c,__ORACO__UOM_c,Id,__ORACO__Product_Id_c,RecordNumber,__ORACO__LastCountDate_c,__ORACO__Route_c,__ORACO__LastProcessedTimestamp_c,__ORACO__OrganizationID_c,CurrencyCode,__ORACO__Product_c,__ORACO__TotalQuantity_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}
@end
