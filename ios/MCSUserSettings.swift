//
//  MCSUserSettings.swift
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


open class MCSUserSettings: NSObject {
    
    var oAuthEnabled:Bool?
    var purge:Bool?
    var baseUrl:String?;
    var token:String?;
    var backend:String?;
    var mbeId:String?;
    var anonymousKey:String?;
    var clientId:String?;
    var clientSecret:String?;
    var appKey:String?;
    var userDefaults:UserDefaults?;
    
    override init() {
        super.init()
        userDefaults = UserDefaults.standard;
    }

    func refreshSettings() {
        
        if ( userDefaults == nil ) {
            userDefaults = UserDefaults.standard;
        }
        
        self.anonymousKey = self.preferenceValue(param: "anonymousKey_preference")
        self.oAuthEnabled = self.preferenceValue(param: "oAuthEnabled_preference")?.toBool();
        self.baseUrl = self.preferenceValue(param: "baseurl_preference")
        self.token = self.preferenceValue(param:"token_preference")
        self.backend = self.preferenceValue(param:"backend_preference")
        self.mbeId = self.preferenceValue(param:"mbeId_preference")
        self.clientId = self.preferenceValue(param:"clientid_preference")
        self.clientSecret = self.preferenceValue(param:"clientsecret_preference")
        self.appKey = self.preferenceValue(param:"appkey_preference")
        self.purge = self.preferenceValue(param:"purge_preference")?.toBool();

    }
    
    func registerDefaultsSettings() {
        
        if let path = Bundle.main.path(forResource: "Settings", ofType: "bundle") {
            let list:NSDictionary? = NSDictionary(contentsOfFile: path + "/Root.plist")
            
            let preferences = list?.object(forKey: "PreferenceSpecifiers") as? [[String:AnyObject]];
            var defaultsToRegister:[String:AnyObject]? = [ : ]
            
            for prefSpecification in preferences! {
            
                let key:String? = (prefSpecification["Key"]! as? String)!;
                if ( key != nil && prefSpecification["DefaultValue"] != nil ) {

                    defaultsToRegister?[key!] = prefSpecification["DefaultValue"]!;
               }
                
                UserDefaults.standard.register(defaults: defaultsToRegister!);
            }
        }
    }
    
    func preferenceValue (param:String) -> String! {
        
        var value:String? = UserDefaults.standard.object(forKey: param) as? String;
        
        if ( value == nil ) {
            registerDefaultsSettings();
            value = UserDefaults.standard.object(forKey: param) as? String;
        }

        return value;
    }
}

extension String {
    func toBool() -> Bool? {
        switch self {
        case "True", "true", "yes", "1":
            return true
        case "False", "false", "no", "0":
            return false
        default:
            return nil
        }
    }
}
