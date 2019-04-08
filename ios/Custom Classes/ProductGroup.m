//
//  ProductGroup.m
//  JTISales
//
//  Created by Appirio-13951 on 03/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "ProductGroup.h"

@implementation ProductGroup
@synthesize ProdGroupItemsId,ProdGroupId,InventoryItemId,InvOrgId,DisplayOrderNum,ActiveFlag,Description,LongDescription,ProductNumber;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}

@end
