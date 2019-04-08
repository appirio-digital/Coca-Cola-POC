//
//  OrderLine.h
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "OMCMobileObject.h"
@interface OrderLineItem : OMCMobileObject
@property(nonatomic,strong) NSNumber*__nullable Id;
@property(nonatomic,strong) NSString*__nullable CurrencyCode;
@property(nonatomic,strong) NSNumber*__nullable Order_Id_c;
@property(nonatomic,strong) NSString*__nullable Order_c;
@property(nonatomic,strong) NSNumber*__nullable Product_Id_c;
@property(nonatomic,strong) NSString*__nullable Product_c;
@property(nonatomic,strong) NSString*__nullable UOM_c;
@property(nonatomic,strong) NSNumber*__nullable UnitPrice_c;
@property(nonatomic,strong) NSNumber*__nullable Discount_c;
@property(nonatomic,strong) NSNumber*__nullable DiscountAmount_c;
@property(nonatomic,strong) NSNumber*__nullable Quantity_c;
@property(nonatomic,strong) NSString*__nullable Promotion1_Id_c;
@property(nonatomic,strong) NSString*__nullable Promotion1_c;
@property(nonatomic,strong) NSString*__nullable MobileUId_c;
@property(nonatomic,strong) NSNumber*__nullable DiscountedPrice1_c;
@property(nonatomic,strong) NSNumber*__nullable TotalPrice1_c;
@property(nonatomic,strong) NSString*__nullable OrderLineStatus_c;
@property(nonatomic,strong) NSNumber*__nullable TaxAmount_c;
@property(nonatomic,strong) NSString*__nullable ParentMobileUId_c;


@end
