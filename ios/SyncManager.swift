//
//  SyncManager.swift
//  JTISales
//
//  Created by umangshu on 04/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit

let UNIQUE_KEY_DIFFRENTIATOR = "PartyNumber"
let kSyncCollectionObject = "SyncCollectionObject"
let kUserProperty  = "kUserProperty"
extension String {
  
  func fromBase64() -> String? {
    guard let data = Data(base64Encoded: self) else {
      return nil
    }
    
    return String(data: data, encoding: .utf8)
  }
  
  func toBase64() -> String {
    return Data(self.utf8).base64EncodedString()
  }
}

func convertToDictionary(text: String) -> [String: Any]? {
  if let data = text.data(using: .utf8) {
    do {
      return try JSONSerialization.jsonObject(with: data, options: []) as? [String: Any]
    } catch {
      print(error.localizedDescription)
    }
  }
  return nil
}

enum SyncPriority:Int {
  case order = 1,
  orderLine,
  invoice,
  invoiceLine,
  payment,
  paymentLine,
  other
  
  static func getSyncPriorityForURI(uri:String) -> SyncPriority{
    if uri.contains("CustomOrder_c"){
      return SyncPriority.order
    }else if uri.contains("CustomOrderLine_c"){
      return SyncPriority.orderLine
    }
    else if uri.contains("ORACO__InvoiceDSD_c"){
      return SyncPriority.invoice
    }
    else if uri.contains("ORACO__InvoiceLineDSD_c"){
      return SyncPriority.invoiceLine
    }
    else if uri.contains("ORACO__PaymentDSD_c"){
      return SyncPriority.payment
    }
    else if uri.contains("ORACO__PaymentLineDSD_c"){
      return SyncPriority.paymentLine
    }else{
      return SyncPriority.other
    }
  }
  
  func getEndpoint() -> String {
    switch self {
    case .order:
      return "CustomOrder_c"
    case .orderLine:
      return "CustomOrderLine_c"
    case .invoice:
      return "ORACO__InvoiceDSD_c"
    case .invoiceLine:
      return "ORACO__InvoiceLineDSD_c"
    case .payment:
      return "ORACO__PaymentDSD_c"
    case .paymentLine:
      return "ORACO__PaymentLineDSD_c"
    default:
      return ""
    }
  }
  
  func getMobileEndpoint() -> OMCMobileEndpoint {
    let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
    
    // Open endpoint for custom api
    let mobileEndpoint:OMCMobileEndpoint = sync.openEndpoint(nil, apiName: "JTI_SALESPOC", endpointPath: self.getEndpoint())
    
    return mobileEndpoint
  }
}

struct MobileObjectPriority {
  var mobileObject:OMCMobileObject
  var priority:SyncPriority
  
  func getObjectCopy(completion: @escaping ((OMCMobileObject?) -> Void)) {
    mobileObject.reload(false, reloadFromService: false) { (object) in
      if let newObject = object as? OMCMobileObject{
        if self.priority != .other{
          // Create new mobile object
          let copiedObject = self.priority.getMobileEndpoint().createObject() as! OMCMobileObject
          
          let policy = self.mobileObject.getCurrentSyncPolicy()
          policy!.update_Policy =  UPDATE_POLICY_QUEUE_IF_OFFLINE
          copiedObject.setSyncPolicy(policy)
          
          let objectJSON = newObject.jsonObject() as! [String:Any]
          
          for (key, value) in objectJSON{
            copiedObject.addOrUpdateJsonProperty(key, propertyValue: "\(value)")
          }
          self.mobileObject.reload(true, reloadFromService: false, onSuccess: { (object) in
            
          })
          completion(copiedObject)
        }else{
          completion(newObject)
        }
      }else{
        completion(nil)
      }
    }
  }
}

struct MobileResourceSync {
  var resource:OMCMobileResource
  var synced:Bool
}

@objc(SyncManager)
class SyncManager: RCTEventEmitter {
  var syncObjectCollection = [String:OMCMobileObjectCollection]()
  var mobileResourcesToSync = [MobileResourceSync]()
  
  var syncFailedMobileObjects = [MobileObjectPriority]()
  
  var currentCountry = "CA"
  
  @objc override func supportedEvents() -> [String] {
    return ["EventReminder","TEST", "hasLocalDatabaseEvent"]
  }
  
  @objc override func constantsToExport() -> [AnyHashable : Any]! {
    return [
      "x":1, "y":2, "z": "Arbitary String"
    ]
  }
  
  func getCurrencyCode() -> String {
    switch self.currentCountry {
    case "CA":
      return "CAD"
    default:
      return "EUR"
    }
  }
  
  func mapStringToClass(endPoint:String) -> AnyClass? {
    switch endPoint {
    case "Accounts":
      return Account.self
    case "contacts":
      return Contact.self
    case "activities":
      return Activity.self
    case "products":
      return Product.self
    case "ORACO__ShoppingCartTmpl_c":
      return ProductTemplate.self
    case "setupSalesCatalogs":
      return SalesCatalog.self
    case "priceBookHeaders":
      return PriceBookHeader.self
    case "PriceBookItem":
      return PriceBookItem.self
    case "ProductGroupProductSetup":
      return ProductGroup.self
    case "ORACO__Route_c":
      return Route.self
    case "ORACO__RouteInventory_c":
      return nil
    case "RouteInvTransDSD_c":
      return nil
    case "ORACO__RouteAllocation_c":
      return RouteAllocation.self
    case "PartyResource":
      return PartyResource.self
    case "ORACO__RouteCheckInHist_c":
      return RouteCheckInHistory.self
    case "ORACO__InvoiceDSD_c":
      return nil
    case "ORACO__InvoiceLineDSD_c":
      return nil
    case "CustomOrder_c":
      return nil
    case "CustomOrderLine_c":
      return nil
    case "ORACO__PaymentDSD_c":
      return nil
    case "ORACO__PaymentLineDSD_c":
      return nil
    case "ORACO__Promotion_c":
      return nil
    default:
      return nil
    }
  }
  
  @objc(updateCountryCode:) func updateCountryCode(country:String) {
    self.currentCountry = country;
  }
  
  //MARK:AuthenticateMCS - Auth the User
  @objc(AuthenticateMCS:password:resolve:reject:) func AuthenticateMCS(username:String,password:String, resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    
    if let mbe = MCSSyncManager.sharedInstance.myBackend(){
      let auth = mbe.authorization;
      
      auth.authenticationType = OMCAuthenticationType.httpBasic;
      
      if let userAuthError = auth.authenticate(username, password: password){
        reject("LOGIN_FAILED",userAuthError.localizedDescription,userAuthError)
      }else{
        //Check for network, if found offline then check NSUserdefaults for user object else call getCurrentUser.
        self.setOfflineResourceUploadingListerner()
        MCSSyncManager.sharedInstance.registerForMCSPushNotifications()
        let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
        DispatchQueue.main.async {
          if(sync.getNetworkStatus() == SyncNetworkStatus.online){
            auth.getCurrentUser({ (error, user) in
              if let authenticatedUser = user{
                //Save to local NSUSer defaults.
                let encodedObject = NSKeyedArchiver.archivedData(withRootObject: authenticatedUser.properties)
                UserDefaults.standard.set(encodedObject, forKey: kUserProperty)
                UserDefaults.standard.synchronize()
                DispatchQueue.main.async {
                  resolve(["success":true,"userProperties":authenticatedUser.properties])
                }
              }else if let _ = error{
                reject("LOGIN_FAILED",error!.localizedDescription,error!)
              }
            })
            
          }else{
            if let userOject = UserDefaults.standard.object(forKey: kUserProperty) as? Data, let property = NSKeyedUnarchiver.unarchiveObject(with: userOject) as? NSMutableDictionary{
              print(property);
              resolve(["success":true,"userProperties":property])
            }else{
              reject("LOGIN_FAILED","User not found",nil)
            }
          }
        }
      }
    }else{
      reject("LOGIN_FAILED","Backend not configured.",nil)
    }
  }
  
  @objc(authenticateSSO:reject:) func authenticateSSO(resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    
    if let mbe = MCSSyncManager.sharedInstance.myBackend(){
      let auth = mbe.authorization;
      
      auth.authenticationType = OMCAuthenticationType.oAuth;
      
      let currentViewController = APUtility.getCurrentViewController()!
      
      auth.authenticateSSO(currentViewController, clearCookies: true) { (error) in
        if let userAuthError = error{
          reject("LOGIN_FAILED",userAuthError.localizedDescription,userAuthError)
        }else{
          auth.getCurrentUser({ (error, user) in
            if let authenticatedUser = user{
              resolve(["success":true,"user":["user":authenticatedUser.username,"email":authenticatedUser.email,"firstName":authenticatedUser.firstName,"lastName":authenticatedUser.lastName]])
            }else{
              reject("LOGIN_FAILED",error?.localizedDescription ?? "",error ?? nil)
            }
          })
        }
      }
    }else{
      reject("LOGIN_FAILED","Backend not configured.",nil)
    }
  }
  
  //MARK: Logout MCS
  @objc(logoutMCS:reject:) func logoutMCS(resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    
    if let mbe = MCSSyncManager.sharedInstance.myBackend(){
      let auth = mbe.authorization;
      
      auth.logout { (error) in
        if let logoutError = error{
          reject("LOGOUT_FAILED",logoutError.localizedDescription,logoutError)
        }else{
          UserDefaults.standard.removeObject(forKey: kUserProperty);
          UserDefaults.standard.synchronize()
          
          UserDefaults.standard.removeObject(forKey: kSyncCollectionObject)
          UserDefaults.standard.synchronize()
          resolve(["success":true])
        }
      }
    }else{
      reject("LOGOUT_FAILED","Backend not configured.",nil)
    }
  }
  
  @objc(authenticateAnonymousMCS:reject:) func authenticateAnonymousMCS(resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    
    if let mbe = MCSSyncManager.sharedInstance.myBackend(){
      let auth = mbe.authorization;
      
      auth.authenticationType = OMCAuthenticationType.oAuth;
      
      auth.authenticateAnonymous { (error) in
        if let userAuthError = error{
          reject("LOGIN_FAILED",userAuthError.localizedDescription,userAuthError)
        }else{
          auth.getCurrentUser({ (error, user) in
            if let authenticatedUser = user{
              resolve(["success":true,"user":["user":authenticatedUser.username,"email":authenticatedUser.email,"firstName":authenticatedUser.firstName,"lastName":authenticatedUser.lastName]])
            }else{
              reject("LOGIN_FAILED",error?.localizedDescription ?? "",error ?? nil)
            }
          })
        }
      }
    }else{
      reject("LOGIN_FAILED","Backend not configured.",nil)
    }
  }

  
  //MARK: Call Custom Api For Promotion
  @objc(invokeCustomAPI:apiName:endPoint:resolve:reject:) func invokeCustomAPI(objectJSON:[String:Any],apiName:String,endPoint:String, resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    print("Object JSON Sent")
    print(objectJSON)
    let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
    
    let jsonData = try? JSONSerialization.data(withJSONObject:objectJSON)
    // Open endpoint for custom api
    let mobileEndpoint:OMCMobileEndpoint = sync.openEndpoint(nil, apiName: apiName, endpointPath: endPoint)
    
    sync.request(withUri: mobileEndpoint.absoluteUrl(), method: SyncRequestMethod.RequestMethodPost, syncPolicy: nil, headers: nil, data: jsonData, onSuccess: { (data, response) in
      if let _ = data, let result = try? JSONSerialization.jsonObject(with: data!, options: JSONSerialization.ReadingOptions.allowFragments){
        resolve(result)
      }else{
        reject("CUSTOM_API_FAILED","",nil)
      }
    }) { (error) in
      reject("CUSTOM_API_FAILED",error?.localizedDescription ?? "",error ?? nil)
    }
  }

  //MARK: deleteObject - Call this API to delete the object locally and on server if online.
  @objc(deleteObject:diffrentiator:apiName:endPoint:resolve:reject:) func deleteObject(idValue:String, diffrentiator:String,apiName:String,endPoint:String, resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    findObject(apiName: apiName, endPoint: endPoint, key: diffrentiator, value: idValue) { (objects) in
      if let foundObject = objects?.first{
        foundObject.deleteResource(onError: { (error) in
          print("Error while deleting record \(error?.localizedDescription ?? " error nil")")
        })
        resolve(["id":idValue])
      }else{
        reject("OBJECT_DELETION_FAILED","object not found" ,nil)
      }
    }
  }
  
  //MARK: createNewObject - Call Api from React for diferent Entity and Edn Points
  @objc(createNewObject:apiName:endPoint:diffrentiator:isPinHigh:resolve:reject:) func createNewObject(objectJSON:[String:Any],apiName:String,endPoint:String,diffrentiator:String, isPinHigh:String, resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    print("Object JSON Sent")
    print(objectJSON)
    if objectJSON.keys.contains(diffrentiator) && "\(objectJSON[diffrentiator]!)".isEmpty == false{
      updateObject(objectJSON: objectJSON, apiName: apiName, endPoint: endPoint, diffrentiator: diffrentiator,isPinHigh: isPinHigh, resolve: resolve, reject: reject)
    }else{
      let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
      
      // Open endpoint for custom api
      let mobileEndpoint:OMCMobileEndpoint = sync.openEndpoint(mapStringToClass(endPoint: endPoint), apiName: apiName, endpointPath: endPoint)
      
      // Create new mobile object
      let mobileObject = mobileEndpoint.createObject(endPoint)!
      
      let policy = mobileObject.getCurrentSyncPolicy()
      policy!.update_Policy =  UPDATE_POLICY_QUEUE_IF_OFFLINE
      mobileObject.setSyncPolicy(policy)
      
      for (key, value) in objectJSON{
        mobileObject.addOrUpdateJsonProperty(key, propertyValue: "\(value)")
      }
      mobileObject.addOrUpdateJsonProperty("CurrencyCode", propertyValue: getCurrencyCode())
      
      DispatchQueue.main.async {
        mobileObject.saveResource(onSuccess: { (object) in
          if let omcObject = object as? OMCMobileObject {
            if (omcObject.jsonObject()) != nil{
              print("OMCMobileObject",omcObject.jsonObject())
              resolve(["success":true,"object":omcObject.jsonObject()])
            }
            else {
              resolve(["success":true,"object":nil])
            }
          }
          else {
            resolve(["success":false])
          }
        }) { (error) in
          reject("OBJECT_CREATION_FAILED",error?.localizedDescription ?? "Error while creating object" ,error)
        }
      }
    }
  }
  
  //MARK:updateObject - Update Object if already exist else create New one.
  @objc(updateObject:apiName:endPoint:diffrentiator:isPinHigh:resolve:reject:) func updateObject(objectJSON:[String:Any],apiName:String,endPoint:String,diffrentiator:String,isPinHigh:String, resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    let objectDistinctValue = "\(objectJSON[diffrentiator]!)"
    findObject(apiName: apiName, endPoint: endPoint, key: diffrentiator, value: objectDistinctValue) { (objects) in
      if let mobileobjects = objects, let mobileObject = mobileobjects.first{
        
        if MCSSyncManager.sharedInstance.mcsSynchronization()!.getNetworkStatus() != SyncNetworkStatus.online && mobileObject.hasOfflineUpdates == true{
          mobileObject.reload(true, reloadFromService: false, onSuccess: nil)
        }
        
        for (key, value) in objectJSON{
          mobileObject.addOrUpdateJsonProperty(key, propertyValue:"\(value)")
        }
        mobileObject.addOrUpdateJsonProperty("CurrencyCode", propertyValue: self.getCurrencyCode())
        
        let policy = mobileObject.getCurrentSyncPolicy()
        policy!.update_Policy =  UPDATE_POLICY_QUEUE_IF_OFFLINE
        mobileObject.setSyncPolicy(policy)
        
        DispatchQueue.main.async {
          mobileObject.saveResource(onSuccess: { (object) in
            resolve(["success":true,"object":(object as! OMCMobileObject).jsonObject()])
          }) { (error) in
            reject("OBJECT_CREATION_FAILED",error?.localizedDescription ?? "Error while creating object" ,error)
          }
        }
        
      }else{
        //Create a new object.
        let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
        
        // Open endpoint for custom api
        let mobileEndpoint:OMCMobileEndpoint = sync.openEndpoint(self.mapStringToClass(endPoint: endPoint), apiName: apiName, endpointPath: endPoint)
        
        // Create new mobile object
        let mobileObject = mobileEndpoint.createObject(endPoint)!
        
        for (key, value) in objectJSON{
          mobileObject.addOrUpdateJsonProperty(key, propertyValue: "\(value)")
        }
        mobileObject.addOrUpdateJsonProperty("CurrencyCode", propertyValue: self.getCurrencyCode())
        
        let policy = mobileObject.getCurrentSyncPolicy()
        policy!.update_Policy =  UPDATE_POLICY_QUEUE_IF_OFFLINE
        mobileObject.setSyncPolicy(policy)
        
        DispatchQueue.main.async {
          mobileObject.saveResource(onSuccess: { (object) in
            if let omcObject = object as? OMCMobileObject {
              print("OMCMobileObject",omcObject.jsonObject())
              resolve(["success":true,"object":omcObject.jsonObject()])
            }
            else {
              resolve(["success":false])
            }
          }) { (error) in
            reject("OBJECT_CREATION_FAILED",error?.localizedDescription ?? "Error while creating object" ,error)
          }
        }
      }
    }
  }
  

  
  @objc(fetchObjectsWithFilters:apiName:endPoint:resolve:reject:) func fetchObjectsWithFilters(filters:[[String:Any]], apiName:String,endPoint:String, resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    
    let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;

    let mobileEndpoint:OMCMobileEndpoint = sync.openEndpoint(mapStringToClass(endPoint: endPoint), apiName: apiName, endpointPath: endPoint)
    let builder = mobileEndpoint.fetchObjectCollectionBuilder()
    for filter in filters{
      var comparator:SyncCompareOperator!
      if let key = filter["key"] as? String, let comparision = filter["op"] as? String, let value = filter["value"] as? String{
        switch (comparision) {
        case "Equals":
          comparator = SyncCompareOperator.Equals
          break;
        case "NotEquals":
          comparator = SyncCompareOperator.NotEquals
        case "LessThan":
          comparator = SyncCompareOperator.LessThan
        case "GreaterThan":
          comparator = SyncCompareOperator.GreaterThan
        case "LessThanOrEqual":
          comparator = SyncCompareOperator.LessThanOrEqual
        case "GreaterThanOrEqual":
          comparator = SyncCompareOperator.GreaterThanOrEqual
        default:
          break;
        }
        builder?.query(forProperty: key, comparision: comparator, compareWith: value)
      }
    }
    
    var objectsJSON = [Any]()
    builder?.executeFetch(onSuccess: { (collection:OMCMobileObjectCollection!) in
      if let _ = collection {
        for omcObject in collection.getMobileObjects() as! [OMCMobileObject]{
          objectsJSON.append(omcObject.jsonObject())
        }
      } else {
        objectsJSON.append("[]")
      }
      resolve(objectsJSON)
    }, onError: { (error) in
      reject("OBJECT_COLLECTION_FETCH_FAILED",error?.localizedDescription ?? "",error ?? nil)
    })
  }
  
  //MARK: fetchObject - Fetch Objects
  @objc(fetchObject:apiName:endPoint:resolve:reject:) func fetchObject(objectWithId:String, apiName:String,endPoint:String, resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
    
    let mobileEndpoint:OMCMobileEndpoint = sync.openEndpoint(mapStringToClass(endPoint: endPoint), apiName: apiName, endpointPath: endPoint)
    let builder = mobileEndpoint.fetchObjectBuilder(objectWithId)
    
    builder?.executeFetch(onSuccess: { (object) in
      if let _ = object {
        let omcObject = object as! OMCMobileObject
        resolve("{\"ObjectId\": \(objectWithId)}, {\"Object\":{\(omcObject.jsonObject())}}")
      }
      else {
        resolve("{\"ObjectId\": \(objectWithId)}, {\"Object\":{}}")
      }
    }, onError: { (error) in
      reject("OBJECT_FETCH_FAILED",error?.localizedDescription ?? "",error ?? nil)
    })
  }
  
  func saveFileToDirectory(mobileObject:OMCMobileObject) throws -> URL? {
    let objectsJSON = mobileObject.jsonObject()! as! [String:Any]
    if let base64FileContent = objectsJSON["FileContents"] as? String, let fileName = objectsJSON["FileName"] as? String, let AttachedDocumentId = objectsJSON["AttachedDocumentId"]{
      if let data = Data(base64Encoded: base64FileContent){
        let fm = FileManager.default
        let urls = fm.urls(for: FileManager.SearchPathDirectory.documentDirectory, in: FileManager.SearchPathDomainMask.userDomainMask)
        let documentURL = urls.first!
        let dstURL = documentURL.appendingPathComponent("\(AttachedDocumentId)_\(fileName)")
        if !fm.fileExists(atPath: dstURL.path){
          fm.createFile(atPath: dstURL.path, contents: data, attributes: nil)
        }
        return dstURL
      }
    }
    return nil
  }
  
  //MARK: fetchFile  - FETCH FILE NAME
  @objc(fetchFile:endPoint:resolve:reject:) func fetchFile(apiName:String,endPoint:String, resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
    
    let mobileEndpoint:OMCMobileEndpoint = sync.openEndpoint(mapStringToClass(endPoint: endPoint), apiName: apiName, endpointPath: endPoint)
    let builder = mobileEndpoint.fetchObjectCollectionBuilder()

    let policy = builder?.getSyncPolicy()
    policy!.fetch_Policy =  FETCH_POLICY_FETCH_FROM_SERVICE_ON_CACHE_MISS_OR_EXPIRY
    builder?.setSyncPolicy(policy)
    
    var objectsJSON = [Any]()
    builder?.executeFetch(onSuccess: { (objects:OMCMobileObjectCollection!) in
      if let objectsCollection = objects{
        for omcObject in objectsCollection.getMobileObjects() as! [OMCMobileObject]{
          if(omcObject.jsonObject() != nil){
            print(omcObject.jsonObject())
            if let url = try! self.saveFileToDirectory(mobileObject: omcObject){
              objectsJSON.append(url.absoluteString)
            }
          }
        }
      }
      else {
        objectsJSON.append("{}")
      }
      resolve(objectsJSON)
    }, onError: { (error) in
      reject("FILE_FETCH_FAILED",error?.localizedDescription ?? "",error ?? nil)
    })
  }
  
  
  //MARK: Create New File
@objc(createNewFile:fileType:filePath:apiName:endPoint:resolve:reject:) func createNewFile(fileName:String, fileType:(String), filePath:(String), apiName:String,endPoint:String, resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    
    let newFilePath  = filePath.replacingOccurrences(of: "file://", with: "")
    let url = URL(fileURLWithPath: newFilePath)
    let fileDataString = try! Data(contentsOf: url).base64EncodedString()
    
    let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
    
    //Saving the file to upload later when network connectivity is back.
    if(sync.getNetworkStatus() != SyncNetworkStatus.online && endPoint.contains("ORACO__InvoiceDSD_c") && endPoint.contains("Invoice-")){
      let mobileUID = endPoint.replacingOccurrences(of: "ORACO__InvoiceDSD_c", with: "").replacingOccurrences(of: "UploadAttachment", with: "")
      let fm = FileManager.default
      let urls = fm.urls(for: FileManager.SearchPathDirectory.documentDirectory, in: FileManager.SearchPathDomainMask.userDomainMask)
      let documentURL = urls.first!
      var isDir : ObjCBool = true
      let dstFolder = documentURL.appendingPathComponent("\(mobileUID)")
      let dstURL = dstFolder.appendingPathComponent(fileName)
      if !fm.fileExists(atPath: dstFolder.path, isDirectory:&isDir){
        try! fm.createDirectory(at: dstFolder, withIntermediateDirectories: true, attributes: nil)
      }
      try! fm.copyItem(at: url, to: dstURL)
      resolve(["success":true])
      return
    }
    
    // Open endpoint for custom api
    let mobileEndpoint:OMCMobileEndpoint = sync.openEndpoint(nil, apiName: apiName, endpointPath: endPoint)
    let mobileObject = mobileEndpoint.createObject() as! OMCMobileObject
    
    let policy = mobileObject.getCurrentSyncPolicy()
    policy!.update_Policy =  UPDATE_POLICY_QUEUE_IF_OFFLINE
    mobileObject.setSyncPolicy(policy)
    
    mobileObject.addOrUpdateJsonProperty("DatatypeCode", propertyValue: "FILE")
    mobileObject.addOrUpdateJsonProperty("FileContents", propertyValue: fileDataString)
    mobileObject.addOrUpdateJsonProperty("UploadedFileContentType", propertyValue: fileType)
    mobileObject.addOrUpdateJsonProperty("UploadedFileName", propertyValue: fileName)
    
    DispatchQueue.main.async {
      mobileObject.saveResource(onSuccess: { (object) in
        print((object as! OMCMobileObject).jsonObject())
        resolve(["success":true])
      }) { (error) in
        reject("FILE_CREATION_FAILED",error?.localizedDescription ?? "Error while creating file" ,error)
      }
    }
  }
  
  //MARK: Fetch Objects
  @objc(fetchObjects:endPoint:resolve:reject:) func fetchObjects(apiName:String,endPoint:String, resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
    

    let mobileEndpoint:OMCMobileEndpoint = sync.openEndpoint(mapStringToClass(endPoint: endPoint), apiName: apiName, endpointPath: endPoint)
    let builder = mobileEndpoint.fetchObjectCollectionBuilder()
    
    let policy = builder?.getSyncPolicy()
    policy!.fetch_Policy =  FETCH_POLICY_FETCH_FROM_SERVICE_ON_CACHE_MISS_OR_EXPIRY
    builder?.setSyncPolicy(policy)
    
    var objectsJSON = [Any]()
    builder?.executeFetch(onSuccess: { (objects) in
      if let objectsCollection = objects{
        for omcObject in objectsCollection.getMobileObjects() as! [OMCMobileObject]{
          
          if(omcObject.jsonObject() != nil){
            ///print(omcObject.jsonObject())
            objectsJSON.append(omcObject.jsonObject())
          }
        }
      }
      else {
        objectsJSON.append("{}")
      }
      resolve(objectsJSON)

    }, onError: { (error) in
      reject("OBJECT_FETCH_FAILED",error?.localizedDescription ?? "",error ?? nil)
    })
  }
  
  //MARK: Erased Local Data From App
  @objc(eraseLocalDatabase:reject:) func eraseLocalDatabase(resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock){
    let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
    sync.purge()
    self.removeAllStoredCollections()
    resolve(true)
  }
  @objc(removeAllStoredCollections)func removeAllStoredCollections(){
    UserDefaults.standard.removeObject(forKey: kSyncCollectionObject)
    UserDefaults.standard.synchronize()
  }
  
  //MARK : hasLocalRecords - Check if offline records exist to Sync.
@objc(hasLocalRecords:reject:) func hasLocalRecords(resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
    var isChecked = false
    print("Called Func")
    
    sync.loadOfflineResources(onSuccess: { (mobileResources) in
      print("Has database review")
      let count = mobileResources?.count ?? 0
      if !isChecked{
        print("Total Local Records",count)
        resolve(["LocalCounts":count > 0,"FailedCounts":self.syncFailedMobileObjects.count > 0])
        isChecked = true
      }
      return
    }) { (error) in
      reject("HAS_LOCAL_DATA_FAILED",error?.localizedDescription ?? "",error ?? nil)
    }
  }
  
 
  //MARK: Load Data Fro Entity
  @objc(loadDataForEntity:endPoint:resolve:reject:) func loadDataForEntity(apiName:String, endPoint:String, resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    //Check here for existing sync in NSUserDefaults. If found then resolve(true)
    if let objects  = UserDefaults.standard.object(forKey: kSyncCollectionObject) as? [String], objects.contains(endPoint) {
      print("Container Collection " , endPoint , objects)
      //reload from server here.
      resolve(true)
    }else{
      //Sync Data
      print("Need Collection Sync " , endPoint);
      let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
      
      let mobileEndpoint:OMCMobileEndpoint = sync.openEndpoint(mapStringToClass(endPoint: endPoint), apiName: apiName, endpointPath: endPoint)
      let builder = mobileEndpoint.fetchObjectCollectionBuilder()
      //
      // setting this sync policy will fetch the data from service when online
      //
      builder?.setSyncPolicyFetchFromServer()
      builder?.executeFetch(onSuccess: { (objects) in
        
        if let objects  = objects{
          var objectsValue = UserDefaults.standard.object(forKey: kSyncCollectionObject) as? [String] ?? [String]()
          objectsValue.append(endPoint);
          UserDefaults.standard.set(objectsValue, forKey: kSyncCollectionObject);
          UserDefaults.standard.synchronize()
          self.syncObjectCollection[endPoint] = objects;
        }else{
          print("JTI-SALES : No Collection Found");
        }
        resolve(true)
      }, onError: { (error) in
        reject("LOAD_DATA_FAILED",error?.localizedDescription ?? "",error ?? nil)
      })
    }
  }
  
  
  @objc(reload:reject:) func reload(resolve:@escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;

    if (sync.getNetworkStatus() == SyncNetworkStatus.online) {
      let queue = DispatchQueue(label:"queue:reload", qos:DispatchQoS.userInteractive)
      let serviceGroup = DispatchGroup()
      
      //
      // Download data from server, offline data is untouched
      //
      for (key, value) in self.syncObjectCollection {
        serviceGroup.wait()
        serviceGroup.enter()
        print ("Reloading: \(key)")
        queue.sync {
          value.reload(false, reloadFromService: true, onSuccess:{ (mobileResource) in
            debugPrint("Synced \(key)")
            serviceGroup.leave()
          })
        }
      }
      
      serviceGroup.notify(queue: DispatchQueue.main) {
        resolve(true)
      }
    }
  }
  

  
  
  func findObject(apiName:String,endPoint:String, key:String, value:String,completion:@escaping (([OMCMobileObject]?) -> Void)) {
    let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization()!;
    
    let mobileEndpoint:OMCMobileEndpoint = sync.openEndpoint(nil, apiName: apiName, endpointPath: endPoint)
    let builder = mobileEndpoint.fetchObjectCollectionBuilder()
    let policy = builder?.getSyncPolicy()
   // policy!.fetch_Policy =  FETCH_POLICY_FETCH_FROM_SERVICE_ON_CACHE_MISS_OR_EXPIRY
    builder?.setSyncPolicy(policy)
    builder?.executeFetch(onSuccess: { (objects) in
      if let objectsCollection = objects{
        var mobileObjects = [OMCMobileObject]()
        for omcObject in objectsCollection.getMobileObjects() as! [OMCMobileObject]{
          if let json = omcObject.jsonObject() as? [String:Any]{
            if json.contains(where: { (arg) -> Bool in
              let (dictKey, dictValue) = arg
              return dictKey == key && "\(dictValue)" == "\(value)"
            }){
              mobileObjects.append(omcObject)
            }
          }
        }
        completion(mobileObjects)
      }
    }, onError: { (error) in
      completion(nil)
    })
  }
  
  //MARK: setOfflineMode - Set SDK network status (Offline & Online)
  @objc(setOfflineMode:) func setOfflineMode(isOffline:[String:Bool]) {
    if let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization(){
      sync.setOfflineMode(!isOffline["connectivity"]!)
    }
  }
  
  //MARK: setOfflineResourceUploadingListerner - Once User Successfully LoggedIn in App.
  func setOfflineResourceUploadingListerner() {
    if let sync:OMCSynchronization = MCSSyncManager.sharedInstance.mcsSynchronization(){
      
      sync.offlineResourceSynchronized { (uri, synchronizedResource) in
        if ( synchronizedResource == nil ){
          print("Offline deleted resource:", uri ?? "", " synchronized sucessfuly.");
        }
        else{
          if let mobileObjectsCollection = synchronizedResource as? OMCMobileObjectCollection{
            if let mobileObjects = mobileObjectsCollection.getMobileObjects() as? [OMCMobileObject]{
              for mobileObject in mobileObjects{
                let priority:SyncPriority = SyncPriority.getSyncPriorityForURI(uri: mobileObject.uri)
                if mobileObject.hasOfflineUpdates{
                  let topObject = MobileObjectPriority(mobileObject: mobileObject, priority: priority)
                  topObject.getObjectCopy { (object) in
                    if let mobileObject = object{
                      mobileObject.saveResource(onSuccess: { (object) in
                        print("Failed resource synced \((object as! OMCMobileObject).jsonObject())");
                      }) { (error) in
                        print(error?.localizedDescription ?? "")
                        self.syncFailedMobileObjects.append(topObject)
                      }
                    }
                  }
                }else{
                  //Append server generated ID to children.
                  mobileObject.populateChildsWithIds()
                  if priority == .invoice{
                    self.checkForExistingInvoice(mobileObject: mobileObject)
                  }
                }
              }
            }
          }else if let mobileObject = synchronizedResource as? OMCMobileObject{
            mobileObject.populateChildsWithIds()
            let priority:SyncPriority = SyncPriority.getSyncPriorityForURI(uri: mobileObject.uri)
            if priority == .invoice{
              self.checkForExistingInvoice(mobileObject: mobileObject)
            }
          }
        }
      }
      
    }
  }
  
  //MARK: uploadOfflineResourcesToServer - Function to Upload offline Records On Server
  @objc(uploadOfflineResourcesToServer:reject:) func uploadOfflineResourcesToServer(resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    MCSSyncManager.sharedInstance.mcsSynchronization()!.setOfflineMode(false)
    self.syncNext { (success) in
      resolve(true)
    }
  }
  //MAKR: Function to Perform network Call in Sync mode.
  func syncNext(completion: @escaping ((Bool) -> Void)) {
    syncFailedMobileObjects.sort { (object1, object2) -> Bool in
      return object1.priority.rawValue < object2.priority.rawValue
    }
    if let topObject = syncFailedMobileObjects.first{
      topObject.getObjectCopy { (object) in
        if let mobileObject = object{
          mobileObject.saveResource(onSuccess: { (object) in
            print("Failed resource synced \((object as! OMCMobileObject).jsonObject())");
            if topObject.priority == .invoice{
              self.checkForExistingInvoice(mobileObject: mobileObject)
            }
            self.syncFailedMobileObjects.removeFirst()
            self.syncNext(completion: completion)
          }) { (error) in
            print(error?.localizedDescription ?? "")
            self.syncNext(completion: completion)
          }
        }else{
          self.syncFailedMobileObjects.removeFirst()
          self.syncNext(completion: completion)
        }
      }
    }else{
      print("Sync Completed")
      completion(true)
    }
  }
  
  //MARK: Check for Existing Invoice Objects
  func checkForExistingInvoice(mobileObject:OMCMobileObject) {
    if let objectJSON = mobileObject.jsonObject() as? [String:Any]{
      if let mobileUID = objectJSON["MobileUId_c"] as? String {
        let objectId = "\(objectJSON["Id"]!)"
        let endPoint = "ORACO__InvoiceDSD_c/\(objectId)/UploadAttachment"
        let fm = FileManager.default
        let urls = fm.urls(for: FileManager.SearchPathDirectory.documentDirectory, in: FileManager.SearchPathDomainMask.userDomainMask)
        let documentURL = urls.first!
        let dstFolder = documentURL.appendingPathComponent("\(mobileUID)")
        var isDir : ObjCBool = true
        if fm.fileExists(atPath: dstFolder.path, isDirectory: &isDir){
          let directoryContents = try! fm.contentsOfDirectory(at: dstFolder, includingPropertiesForKeys: nil, options: FileManager.DirectoryEnumerationOptions.skipsHiddenFiles)
          for fileURL in directoryContents{
            if fileURL.pathExtension.contains("pdf"){
              self.createNewFile(fileName: fileURL.lastPathComponent, fileType: "application/pdf", filePath: fileURL.absoluteString, apiName: "JTI_SALESPOC", endPoint: endPoint, resolve: { (response) in
                try! fm.removeItem(at: fileURL)
              }) { (code, message, error) in
                
              }
            }
          }
        }
      }
    }
  }
  
  //MARK: fetchFile  - FETCH FILE NAME
  @objc(fetchSampleBusinessRulesJSON:reject:) func fetchSampleBusinessRulesJSON(resolve: @escaping RCTPromiseResolveBlock, reject:@escaping RCTPromiseRejectBlock) {
    let jsonFilePath = Bundle.main.path(forResource: "BusinessRules", ofType: "json")
    let jsonString = try! String(contentsOfFile: jsonFilePath!)
    resolve(jsonString)
  }
  
}



