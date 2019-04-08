//
//  OMCMobileEndpoint+Utils.m
//  JTISales
//
//  Created by Appirio-13951 on 03/09/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

#import "OMCMobileEndpoint+Utils.h"
#import "Account.h"
#import "Contact.h"

@implementation OMCMobileEndpoint (Utils)

-(OMCMobileObject *)createObject:(NSString *)endPoint{
  if ([endPoint isEqualToString:@"Accounts"]){
    Account *accountObject = [self createObject];
    return accountObject;
  } else if ([endPoint isEqualToString:@"contacts"]){
    Contact *contactObject = [self createObject];
    return contactObject;
  }else{
    return [self createObject];
  }
}

@end
