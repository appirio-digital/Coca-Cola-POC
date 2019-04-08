//
//  PriceBookItem.h
//  JTISales
//
//  Created by Appirio-13951 on 29/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OMCMobileObject.h"

@interface PriceBookItem : OMCMobileObject
@property (nonatomic, strong) NSString*__nullable PricebookItemId;
@property (nonatomic, strong) NSString*__nullable PricebookId;
@property (nonatomic, strong) NSString*__nullable InvItemId;
@property (nonatomic, strong) NSString*__nullable ItemDescription;
@property (nonatomic, strong) NSString*__nullable InvOrgId;
@property (nonatomic, strong) NSString*__nullable ListPrice;
@property (nonatomic, strong) NSString*__nullable PriceUOMCode;
@property (nonatomic, strong) NSString*__nullable __ORACO__Tax1Amount_c;
@property (nonatomic, strong) NSString*__nullable __ORACO__Tax1Percentage_c;
@property (nonatomic, strong) NSString*__nullable __ORACO__Tax2Amount_c;
@property (nonatomic, strong) NSString*__nullable __ORACO__Tax2Percentage_c;

+ (NSComparisonResult) compare:(id)otherClass;

@end
