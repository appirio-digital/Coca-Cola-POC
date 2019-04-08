//
//  PartyResource.m
//  JTISales
//
//  Created by Appirio-13951 on 12/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "PartyResource.h"

@implementation PartyResource
@synthesize PartyName,PartyNumber,PartyId,EmailAddress,FormattedAddress,PersonFirstName,PersonLastName,__ORACO__DistributionCentre_c,__ORACO__DistributionCentre_Id_c,PrimaryCountry_c,FormattedPhoneNumber,module,MobileAppIdentifier_c;

+ (NSComparisonResult) compare:(id)otherClass
{
  return NSOrderedSame;
}
- (void)populateChildsWithIds{
  
}
@end
