//
//  Product.m
//  JTISales
//
//  Created by Appirio-13951 on 29/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "Product.h"

@implementation Product
@synthesize __ORACO__Size_c,__ORACO__EligibleForShipment_c,__ORACO__ContainerClass_Id_c,__ORACO__Category_c,__ORACO__Brand_c,__ORACO__IneligibleForShip_c,InventoryItemId,Name,EligibleToSellFlag,DefaultUOM,InvOrgId,ItemNumber,Description,__ORACO__ContainerClass_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}

@end
