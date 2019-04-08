//
//  Order.m
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "Order.h"
#import "OMCMobileObject+Utils.h"
#import "JTISales-Swift.h"
#import "OMCMobileObject.h"

@implementation Order
@synthesize Id,RecordName,CurrencyCode,MobileUId_c,Account_Id_c,Account_c,OrderDate_c,Amount_c,OrderStatus_c,PaymentMode_c,PaymentStatus_c,Type_c,TaxAmount_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}

- (void)populateChildsWithIds{
 /* NSString * foreignKey = [[NSString alloc] initWithFormat:@"%@",self.Id];
  NSLog(@"OrderId %@",foreignKey);
  SyncManager *manager = [[SyncManager alloc] init];
  [manager findObjectWithApiName:@"JTI_SALESPOC" endPoint:@"CustomOrderLine_c" key:@"Order_Id_c" value:foreignKey completion:^(NSArray<Contact *> * mobileObjects) {
    for (OrderLineItem * contactObject in mobileObjects) {
      if (contactObject.Order_Id_c != self.Id){
        contactObject.Order_Id_c = self.Id;
        [contactObject saveResourceOnSuccess:^(id mobileObject) {
          NSLog(@"%@",mobileObject);
        } OnError:^(NSError *error) {
          NSLog(@"Error %@",error.localizedDescription);
        }];
      }
    }
  }];*/
}

@end
