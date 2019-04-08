//
//  Promotion.h
//  JTISales
//
//  Created by Appirio-13951 on 21/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "OMCMobileObject.h"

@interface Promotion : OMCMobileObject
@property(nonatomic,strong) NSNumber*__nullable Id;
@property(nonatomic,strong) NSString*__nullable RecordName;
@property(nonatomic,strong) NSString*__nullable RecordNumber;
@property(nonatomic,strong) NSString*__nullable CurrencyCode;
@property(nonatomic,strong) NSString*__nullable __ORACO__Account_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Account_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Description_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__EndDate_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__ShipmentEndDate_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__ShipmentStartDate_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__StartDate_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Status_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__DiscountName_c;
@property(nonatomic,assign) BOOL  __ORACO__MandatoryFlag_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__MaxAmountDisc_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__DiscountType_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__VolumeDiscountType_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__DiscountMethod_c;

@end
