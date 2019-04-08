//
//  ProductTemplate.m
//  JTISales
//
//  Created by Appirio-13951 on 18/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "ProductTemplate.h"

@implementation ProductTemplate
@synthesize __ORACO__UOMCode_c,__ORACO__UOM_c,Id,__ORACO__Account_Id_c,__ORACO__Product_Id_c,__ORACO__SKU_c,__ORACO__Quantity_c,__ORACO__Account_c,CurrencyCode,__ORACO__Product_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}

@end
