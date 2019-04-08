//
//  PartyResource.h
//  JTISales
//
//  Created by Appirio-13951 on 12/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "OMCMobileObject.h"

@interface PartyResource : OMCMobileObject
@property(nonatomic,strong) NSString*__nullable PartyName;
@property(nonatomic,strong) NSString*__nullable PartyNumber;
@property(nonatomic,strong) NSString*__nullable PartyId;
@property(nonatomic,strong) NSString*__nullable EmailAddress;
@property(nonatomic,strong) NSString*__nullable FormattedAddress;
@property(nonatomic,strong) NSString*__nullable PersonFirstName;
@property(nonatomic,strong) NSString*__nullable PersonLastName;
@property(nonatomic,strong) NSString*__nullable __ORACO__DistributionCentre_c;
@property(nonatomic,strong) NSString*__nullable __ORACO__DistributionCentre_Id_c;
@property(nonatomic,strong) NSString*__nullable PrimaryCountry_c;
@property(nonatomic,strong) NSString*__nullable FormattedPhoneNumber;
@property(nonatomic,strong) NSString*__nullable module;
@property(nonatomic,strong) NSString*__nullable MobileAppIdentifier_c;

@end
