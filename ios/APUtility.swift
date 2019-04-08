//
//  APUtility.swift
//  JTISales
//
//  Created by umangshu on 07/08/18.
//  Copyright © 2018 Facebook. All rights reserved.
//

import UIKit

class APUtility: NSObject {
  
  // Returns the most recently presented UIViewController (visible)
  class func getCurrentViewController() -> UIViewController? {
    
    // If the root view is a navigation controller, we can just return the visible ViewController
    if let navigationController = getNavigationController() {
      
      return navigationController.visibleViewController
    }
    
    // Otherwise, we must get the root UIViewController and iterate through presented views
    if let rootController = UIApplication.shared.keyWindow?.rootViewController {
      
      var currentController: UIViewController! = rootController
      
      // Each ViewController keeps track of the view it has presented, so we
      // can move from the head to the tail, which will always be the current view
      while( currentController.presentedViewController != nil ) {
        
        currentController = currentController.presentedViewController
      }
      return currentController
    }
    return nil
  }
  
  // Returns the navigation controller if it exists
  class func getNavigationController() -> UINavigationController? {
    
    if let navigationController = UIApplication.shared.keyWindow?.rootViewController  {
      
      return navigationController as? UINavigationController
    }
    return nil
  }
  
}
