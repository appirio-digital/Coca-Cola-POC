//
//  ProductGroup.h
//  JTISales
//
//  Created by Appirio-13951 on 03/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OMCMobileObject.h"
@interface ProductGroup : OMCMobileObject
@property(nonatomic,strong) NSString*__nullable ProdGroupItemsId;
@property(nonatomic,strong) NSString*__nullable ProdGroupId   ;
@property(nonatomic,strong) NSString*__nullable InventoryItemId;
@property(nonatomic,strong) NSString*__nullable InvOrgId;
@property(nonatomic,strong) NSString*__nullable DisplayOrderNum;
@property(nonatomic,strong) NSString*__nullable ActiveFlag;
@property(nonatomic,strong) NSString*__nullable Description;
@property(nonatomic,strong) NSString*__nullable LongDescription;
@property(nonatomic,strong) NSString*__nullable ProductNumber;

@end
