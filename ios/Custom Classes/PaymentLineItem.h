//
//  PaymentLine.h
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//


#import "OMCMobileObject.h"
@interface PaymentLineItem
: OMCMobileObject
@property(nonatomic,strong) NSNumber*__nullable Id;
@property(nonatomic,strong) NSString*__nullable RecordName;
@property(nonatomic,strong) NSString*__nullable CurrencyCode;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Payment_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Payment_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Amount_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__PayToInvoice_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Type_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__BankName_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__BankAccountNumber_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__ProofOfPurchaseNumber_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__PurchaseOrderNumber_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Note_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__CheckNumber_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__PayFor_c;
@property(nonatomic,strong) NSString*__nullable MobileUId_c;
@property(nonatomic,strong) NSString*__nullable ParentMobileUId_c;

@end
 
