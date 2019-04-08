//
//  InvoiceLineItem.h
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//


#import "OMCMobileObject.h"
@interface InvoiceLineItem : OMCMobileObject
@property(nonatomic,strong) NSNumber*__nullable Id;
@property(nonatomic,strong) NSString*__nullable RecordName;
@property(nonatomic,strong) NSString*__nullable CurrencyCode;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__DiscountAmount_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Invoice_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Invoice_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__ListPrice_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Price_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Product_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Product_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Quantity_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__SKU_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Subtotal_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Tax1_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Tax1Code_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Tax2_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Tax2Code_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Total_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__UOM_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__UOMCode_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Promotion_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Promotion_c;
@property(nonatomic,strong) NSNumber*__nullable CustomOrderLine_Id_c;
@property(nonatomic,strong) NSString*__nullable CustomOrderLine_c;
@property(nonatomic,strong) NSString*__nullable MobileUId_c;
@property(nonatomic,strong) NSString*__nullable ParentMobileUId_c;
@end
