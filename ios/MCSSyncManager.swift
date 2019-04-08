//
//  MCSSyncManager.swift
//  SalesPlus
//
/* Copyright (c) 2016, Oracle and/or its affiliates. All rights reserved. */

/******************************************************************************
 *
 * You may not use the identified files except in compliance with the Apache
 * License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 *****************************************************************************/

import Foundation

class MCSSyncManager : NSObject {
    
  fileprivate let apiKey = "f0511985-d1ad-4307-92f6-3b81e882be9f";

  static let sharedInstance = MCSSyncManager();
  override init() {
      super.init()
  }
  
  // mbeName must match in the OMC.plist file, to get correct "synchronization" configurations.
  fileprivate let mbeName = "JTI_SALES_MB";
  
  fileprivate var mbe: OMCMobileBackend!;
  fileprivate var auth: OMCAuthorization!;
  fileprivate var sync:OMCSynchronization!;
  fileprivate var _workOffline:Bool!;
  fileprivate var loggedIn:Bool! = false;
  
  var arrAssets:NSArray!;
  
  @objc func registerForMCSPushNotifications() {
    
    // Get notifications sdk object
    DispatchQueue.main.async {
      let notifications = self.myBackend().notifications()
      
      // Get device token first, and assign it here
      let appDelegate = UIApplication.shared.delegate as! AppDelegate
      let deviceTokenData:Data! = appDelegate.deviceToken
      
      // Register device token with MCS server using notifications sdk
      notifications?.register(forNotifications: deviceTokenData, onSuccess: { (response) in
        NSLog("Device token registered successfully on MCS server");
      }) { (error) in
        
        print("Error: %@", error?.localizedDescription ?? "");
      };
    }
  }
  
  func myBackend() -> OMCMobileBackend! {
    
    let mbeManager: OMCMobileBackendManager = OMCMobileBackendManager.shared();
    if (  mbeManager.mobileBackend(forName: mbeName) != nil ) {
      
      let mbe:OMCMobileBackend! =  mbeManager.mobileBackend(forName: mbeName);
      
      if ( mbe != nil ) {
        
        NSLog("%@ mobile backend configured", mbeName);
        return mbe;
      }
    }
    
    NSLog("Mobile backend configuration failed");
    return nil;
  }
    
    func mcsSynchronization() -> OMCSynchronization? {
        mbe = myBackend()
        auth = mbe.authorization
        if auth.authorized {
            
            if sync == nil {
                sync = mbe.synchronization();
                
                let userSettings:MCSUserSettings? = MCSUserSettings.init();
                userSettings!.refreshSettings();
                if ( userSettings!.purge == true ) {
                    sync.purge();
                }

              sync.initialize(withMobileObjectEntities: [Account.self,Contact.self,Activity.self, Product.self, SalesCatalog.self, PriceBookHeader.self , ProductGroup.self, PartyResource.self , Route.self , RouteAllocation.self , RouteInventory.self, RouteCheckInHistory.self , RouteInventoryTransaction.self, Invoice.self ,InvoiceLineItem.self, Order.self, OrderLineItem.self , Payment.self , PaymentLineItem.self , ProductTemplate.self , Promotion.self])
            }
            
            return sync;
        }
        
        return nil;
    }

    func workOffline() -> Bool? {
        return self._workOffline;
    }
    
    func setWorkOffline(_ flag:Bool) -> Void {
        self._workOffline = flag;
    }
    
    func isLoggedIn() -> Bool! {
        return self.loggedIn;
    }
    
    func setLoggedOut() {
        self.loggedIn = false;
    }
}
