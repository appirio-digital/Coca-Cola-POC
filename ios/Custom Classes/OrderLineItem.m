//
//  OrderLine.m
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "OrderLineItem.h"

@implementation OrderLineItem
@synthesize Id,CurrencyCode,Order_Id_c,Order_c,Product_Id_c,Product_c,UOM_c,UnitPrice_c,Discount_c,DiscountAmount_c,Quantity_c,Promotion1_Id_c,Promotion1_c,MobileUId_c,DiscountedPrice1_c,TotalPrice1_c,OrderLineStatus_c,TaxAmount_c,ParentMobileUId_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}
@end
