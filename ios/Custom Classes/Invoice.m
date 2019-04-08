//
//  Invoice.m
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "Invoice.h"

@implementation Invoice
@synthesize Id,RecordName,CurrencyCode,__ORACO__Account_Id_c,__ORACO__Discount_c,__ORACO__InvoiceDate_c,__ORACO__SubtotalAmount_c,__ORACO__Tax1_c,__ORACO__Tax2_c,__ORACO__Tax2Code_c,__ORACO__TotalAmount_c,__ORACO__ProcessStatus_c,CustomerOrder_Id_c,MobileUId_c;


+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}
@end
