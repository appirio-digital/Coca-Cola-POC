//
//  Payment.m
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "Payment.h"

@implementation Payment
@synthesize Id,RecordName,CorpCurrencyCode,__ORACO__Account_Id_c,__ORACO__Account_c,__ORACO__Amount_c,__ORACO__Note_c,__ORACO__PaymentDate_c,__ORACO__ProcessStatus_c,MobileUId_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}
@end
