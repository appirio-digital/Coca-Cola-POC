//
//  Contact.h
//  JTISales
//
//  Created by umangshu on 22/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>
#import "OMCMobileObject.h"

@interface Contact : OMCMobileObject

@property (nonatomic, strong) NSString*__nullable Title;
@property (nonatomic, strong) NSString*__nullable FirstName;
@property (nonatomic, strong) NSString*__nullable MiddleName;
@property (nonatomic, strong) NSString*__nullable LastName;
@property (nonatomic, strong) NSString*__nullable Type;
@property (nonatomic, strong) NSString*__nullable EmailFormat;
@property (nonatomic, strong) NSString*__nullable JobTitle;
@property (nonatomic, strong) NSString*__nullable EmailAddress;
@property (nonatomic, strong) NSString*__nullable Country;
@property (nonatomic, strong) NSString*__nullable County;
@property (nonatomic, strong) NSString*__nullable AddressLine1;
@property (nonatomic, strong) NSString*__nullable AddressLine2;
@property (nonatomic, strong) NSString*__nullable AddressLine3;
@property (nonatomic, strong) NSString*__nullable AddressLine4;
@property (nonatomic, strong) NSString*__nullable City;
@property (nonatomic, strong) NSString*__nullable State;
@property (nonatomic, strong) NSString*__nullable PostalCode;
@property (nonatomic, strong) NSString*__nullable Province;
@property (nonatomic, strong) NSString*__nullable PartyNumber;
@property (nonatomic, strong) NSString*__nullable PartyId;
@property (nonatomic, strong) NSString*__nullable OwnerPartyId;
@property (nonatomic, strong) NSString*__nullable AccountPartyId;
@property (nonatomic, strong) NSString*__nullable OwnerPartyNumber;
@property (nonatomic, strong) NSString*__nullable OwnerName;
@property (nonatomic, strong) NSString*__nullable AccountPartyNumber;
@property (nonatomic, strong) NSString*__nullable SourceSystem;
@property (nonatomic, strong) NSString*__nullable SourceSystemReferenceValue;


+ (NSComparisonResult) compare:(id)otherClass;

@end
