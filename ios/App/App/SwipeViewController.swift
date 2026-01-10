//
//  SwipeViewController.swift
//  App
//
//  Created by Jonas  Wanner on 22.10.2025.
//

import UIKit
import Capacitor

class SwipeViewController: CAPBridgeViewController {

    override func viewDidLoad() {
        super.viewDidLoad()
        
        // uncomment to enable back and forward navigation
        // currently disabled because it doesn't "feel" like a how a real app should behave.
    
        // webView!.allowsBackForwardNavigationGestures = true
    }
}
