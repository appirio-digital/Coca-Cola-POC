//
//  Contact.m
//  JTISales
//
//  Created by umangshu on 22/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "Contact.h"
#import "OMCMobileObject+Utils.h"

@implementation Contact


@synthesize Title, FirstName, MiddleName, LastName, Type, EmailFormat, JobTitle, EmailAddress, Country, County, AddressLine1, AddressLine2, AddressLine3, AddressLine4, City, State, PostalCode, Province, PartyNumber, PartyId, OwnerPartyId, AccountPartyId, OwnerPartyNumber, OwnerName, AccountPartyNumber , SourceSystem ,SourceSystemReferenceValue;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}

- (void)populateChildsWithIds{
  
}

@end
