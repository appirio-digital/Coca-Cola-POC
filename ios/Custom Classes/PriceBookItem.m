//
//  PriceBookItem.m
//  JTISales
//
//  Created by Appirio-13951 on 29/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "PriceBookItem.h"
@implementation PriceBookItem
@synthesize PricebookItemId,PricebookId,InvItemId,ItemDescription,InvOrgId,ListPrice,PriceUOMCode,__ORACO__Tax1Amount_c,__ORACO__Tax1Percentage_c,__ORACO__Tax2Amount_c,__ORACO__Tax2Percentage_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}

- (void)populateChildsWithIds{
  
}

@end
