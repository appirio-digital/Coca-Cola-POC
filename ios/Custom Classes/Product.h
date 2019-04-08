//
//  Product.h
//  JTISales
//
//  Created by Appirio-13951 on 29/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OMCMobileObject.h"
@interface Product : OMCMobileObject

@property(nonatomic,strong) NSString*__nullable __ORACO__Size_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__EligibleForShipment_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__ContainerClass_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Category_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Brand_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__IneligibleForShip_c;
@property(nonatomic,strong) NSString*__nullable InventoryItemId;
@property(nonatomic,strong) NSString*__nullable Name;
@property(nonatomic,strong) NSString*__nullable EligibleToSellFlag;
@property(nonatomic,strong) NSString*__nullable DefaultUOM;
@property(nonatomic,strong) NSString*__nullable InvOrgId;
@property(nonatomic,strong) NSString*__nullable ItemNumber;
@property(nonatomic,strong) NSString*__nullable Description;
@property(nonatomic,strong) NSString*__nullable __ORACO__ContainerClass_c;

+ (NSComparisonResult) compare:(id)otherClass;


@end
