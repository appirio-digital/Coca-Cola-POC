//
//  Account.h
//  JTISales
//
//  Created by umangshu on 22/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "OMCMobileObject.h"
@interface Account : OMCMobileObject


@property (nonatomic, strong) NSString*__nullable Country;
@property (nonatomic, strong) NSString*__nullable PrimaryContactName;
@property (nonatomic, strong) NSString*__nullable AddressLine1;
@property (nonatomic, strong) NSString*__nullable AddressLine2;
@property (nonatomic, strong) NSString*__nullable AddressLine3;
@property (nonatomic, strong) NSString*__nullable AddressLine4;
@property (nonatomic, strong) NSString*__nullable City;
@property (nonatomic, strong) NSString*__nullable State;
@property (nonatomic, strong) NSString*__nullable County;
@property (nonatomic, strong) NSString*__nullable PostalCode;
@property (nonatomic, strong) NSString*__nullable Province;
@property (nonatomic, strong) NSString*__nullable OrganizationName;
@property (nonatomic, strong) NSString*__nullable Type;
@property (nonatomic, strong) NSString*__nullable URL;
@property (nonatomic, strong) NSString*__nullable OwnerPartyId;
@property (nonatomic, strong) NSNumber*__nullable PartyId;
@property (nonatomic, strong) NSString*__nullable OwnerName;
@property (nonatomic, strong) NSString*__nullable PhoneCountryCode;
@property (nonatomic, strong) NSString*__nullable PhoneAreaCode;
@property (nonatomic, strong) NSString*__nullable PhoneNumber;
@property (nonatomic, strong) NSString*__nullable PhoneExtension;
@property (nonatomic, strong) NSString*__nullable Comments;
@property (nonatomic, strong) NSString*__nullable EmailAddress;
@property (nonatomic, strong) NSString*__nullable PartyNumber;
@property (nonatomic, strong) NSString*__nullable OrganizationDEO___ORACO__PriceBook_Id_c;
@property (nonatomic, strong) NSString*__nullable OrganizationDEO___ORACO__PriceBook_c;
@property (nonatomic, strong) NSString*__nullable PartyUniqueName;
@property (nonatomic, strong) NSString*__nullable OwnerPartyNumber;
@property (nonatomic, strong) NSString*__nullable RegistrationType;
@property (nonatomic, strong) NSString*__nullable OrganizationDEO_JTI_AccountStatus_c;
@property (nonatomic, strong) NSString*__nullable OrganizationDEO_JTI_ShopSize_c;
@property (nonatomic, strong) NSString*__nullable OrganizationDEO_JTI_PromotionAcceptanceRatio_c;
@property (nonatomic, strong) NSString*__nullable OrganizationDEO_JTI_ClusterPriority_c;
@property (nonatomic, strong) NSString*__nullable PrimaryContactPhone;
@property (nonatomic, strong) NSString*__nullable PrimaryContactEmail;
@property (nonatomic, strong) NSString*__nullable PrimaryContactPartyNumber;
@property(nonatomic,strong)NSString *__nullable SourceSystem;
@property(nonatomic,strong)NSString *__nullable SourceSystemReferenceValue;


+ (NSComparisonResult) compare:(id)otherClass;


@end
