//
//  Invoice.h
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//


#import "OMCMobileObject.h"
@interface Invoice : OMCMobileObject
@property(nonatomic,strong) NSNumber*__nullable Id;
@property(nonatomic,strong) NSString*__nullable RecordName;
@property(nonatomic,strong) NSString*__nullable CurrencyCode;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Account_Id_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Discount_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__InvoiceDate_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__SubtotalAmount_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Tax1_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Tax1Code_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Tax2_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Tax2Code_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__TotalAmount_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__ProcessStatus_c;
@property(nonatomic,strong) NSNumber*__nullable CustomerOrder_Id_c;
@property(nonatomic,strong) NSString*__nullable MobileUId_c;

@end
