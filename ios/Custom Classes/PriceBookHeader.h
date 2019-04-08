//
//  PriceBookHeader.h
//  JTISales
//
//  Created by Appirio-13951 on 29/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OMCMobileObject.h"
@interface PriceBookHeader : OMCMobileObject
@property (nonatomic, strong) NSString*__nullable Name;
@property (nonatomic, strong) NSString*__nullable PricebookId;
@property (nonatomic, strong) NSString*__nullable PricebookCode;
@property (nonatomic, strong) NSString*__nullable StatusCode;
@property (nonatomic, strong) NSString*__nullable Description;
@property (nonatomic, strong) NSString*__nullable HeaderExternalKey;
@property (nonatomic, strong) NSString*__nullable __ORACO__Tax1Code_c;
@property (nonatomic, strong) NSString*__nullable __ORACO__Tax1Method_c;
@property (nonatomic, strong) NSString*__nullable __ORACO__Tax2Code_c;
@property (nonatomic, strong) NSString*__nullable __ORACO__Tax2Method_c;

+ (NSComparisonResult) compare:(id)otherClass;

@end
