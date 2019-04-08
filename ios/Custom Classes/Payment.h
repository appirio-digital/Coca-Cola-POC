//
//  Payment.h
//  JTISales
//
//  Created by Appirio-13951 on 14/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//
#import "OMCMobileObject.h"
@interface Payment : OMCMobileObject
@property(nonatomic,strong) NSNumber*__nullable Id;
@property(nonatomic,strong) NSString*__nullable RecordName;
@property(nonatomic,strong) NSString*__nullable CorpCurrencyCode;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Account_Id_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Account_c;
@property(nonatomic,strong) NSNumber*__nullable __ORACO__Amount_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__Note_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__PaymentDate_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__ProcessStatus_c;
@property(nonatomic,strong) NSString*__nullable MobileUId_c;

@end
