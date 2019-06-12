

//
//  Account.m
//  JTISales
//
//  Created by umangshu on 22/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "Account.h"
#import "OMCMobileObject+Utils.h"
#import "JTISales-Swift.h"
#import "OMCMobileObject.h"

@implementation Account

@synthesize Country, PrimaryContactName, AddressLine1, AddressLine2, AddressLine3, AddressLine4, City, State, County, PostalCode, Province, OrganizationName, Type, URL, OwnerPartyId, PartyId, OwnerName, PhoneCountryCode, PhoneAreaCode, PhoneNumber, PhoneExtension, Comments, EmailAddress, PartyNumber, OrganizationDEO___ORACO__PriceBook_Id_c, OrganizationDEO___ORACO__PriceBook_c, PartyUniqueName, OwnerPartyNumber, RegistrationType, OrganizationDEO_JTI_AccountStatus_c, OrganizationDEO_JTI_ShopSize_c, OrganizationDEO_JTI_PromotionAcceptanceRatio_c, OrganizationDEO_JTI_ClusterPriority_c, PrimaryContactPhone, PrimaryContactEmail, PrimaryContactPartyNumber,SourceSystem,SourceSystemReferenceValue;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}

- (void)populateChildsWithIds{
  
  NSString * foreignKey = [[NSString alloc] initWithFormat:@"%@",self.SourceSystem];
  SyncManager *manager = [[SyncManager alloc] init];
}

@end


