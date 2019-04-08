//
//  PriceBookHeader.m
//  JTISales
//
//  Created by Appirio-13951 on 29/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "PriceBookHeader.h"

@implementation PriceBookHeader
@synthesize Name , PricebookId , PricebookCode  ,StatusCode , Description  ,HeaderExternalKey, __ORACO__Tax1Code_c,  __ORACO__Tax1Method_c , __ORACO__Tax2Code_c , __ORACO__Tax2Method_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}

@end
