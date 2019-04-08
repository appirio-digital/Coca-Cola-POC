//
//  PaymentLine.m
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "PaymentLineItem.h"

@implementation PaymentLineItem
@synthesize Id,RecordName,CurrencyCode,__ORACO__Payment_Id_c,__ORACO__Payment_c,__ORACO__Amount_c,__ORACO__PayToInvoice_c,__ORACO__Type_c, __ORACO__BankName_c,__ORACO__BankAccountNumber_c,__ORACO__ProofOfPurchaseNumber_c,__ORACO__PurchaseOrderNumber_c,__ORACO__Note_c,__ORACO__CheckNumber_c,__ORACO__PayFor_c,MobileUId_c,ParentMobileUId_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}
@end
