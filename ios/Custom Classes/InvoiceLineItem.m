//
//  InvoiceLineItem.m
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "InvoiceLineItem.h"

@implementation InvoiceLineItem
@synthesize Id,RecordName,CurrencyCode,__ORACO__DiscountAmount_c,__ORACO__Invoice_Id_c,__ORACO__Invoice_c,__ORACO__ListPrice_c,__ORACO__Price_c,__ORACO__Product_Id_c,__ORACO__Product_c,__ORACO__Quantity_c,__ORACO__SKU_c,__ORACO__Subtotal_c,__ORACO__Tax1_c,__ORACO__Tax1Code_c,__ORACO__Tax2_c,__ORACO__Tax2Code_c,__ORACO__Total_c,__ORACO__UOM_c,__ORACO__UOMCode_c,__ORACO__Promotion_Id_c,__ORACO__Promotion_c,CustomOrderLine_Id_c,CustomOrderLine_c,MobileUId_c,ParentMobileUId_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}
@end
