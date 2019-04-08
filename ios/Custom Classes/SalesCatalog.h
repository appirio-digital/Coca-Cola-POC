//
//  SalesCatalog.h
//  JTISales
//
//  Created by Appirio-13951 on 29/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OMCMobileObject.h"
@interface SalesCatalog : OMCMobileObject
@property (nonatomic, strong) NSString*__nullable StartDate;
@property (nonatomic, strong) NSString*__nullable EndDate;
@property (nonatomic, strong) NSString*__nullable UsageRootFlag;
@property (nonatomic, strong) NSString*__nullable ProdGroupId;
@property (nonatomic, strong) NSString*__nullable ProdGroupName;
@property (nonatomic, strong) NSString*__nullable ProdGroupDescription;
+ (NSComparisonResult) compare:(id)otherClass;

@end
