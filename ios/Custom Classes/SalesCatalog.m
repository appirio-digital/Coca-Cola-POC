//
//  SalesCatalog.m
//  JTISales
//
//  Created by Appirio-13951 on 29/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "SalesCatalog.h"

@implementation SalesCatalog

@synthesize  StartDate,EndDate,UsageRootFlag,ProdGroupId,ProdGroupName,ProdGroupDescription;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}

- (void)populateChildsWithIds{
  
}

@end
