//
//  Order.h
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "OMCMobileObject.h"

@interface Order : OMCMobileObject
@property(nonatomic,strong) NSNumber*__nullable Id;
@property(nonatomic,strong) NSString*__nullable RecordName;
@property(nonatomic,strong) NSString*__nullable CurrencyCode;
@property(nonatomic,strong) NSString*__nullable MobileUId_c;
@property(nonatomic,strong) NSNumber*__nullable Account_Id_c;
@property(nonatomic,strong) NSString*__nullable Account_c;
@property(nonatomic,strong) NSString*__nullable OrderDate_c;
@property(nonatomic,strong) NSNumber*__nullable Amount_c;
@property(nonatomic,strong) NSString*__nullable OrderStatus_c;
@property(nonatomic,strong) NSString*__nullable PaymentMode_c;
@property(nonatomic,strong) NSString*__nullable PaymentStatus_c;
@property(nonatomic,strong) NSString*__nullable Type_c;
@property(nonatomic,strong) NSNumber*__nullable TaxAmount_c;

@end
