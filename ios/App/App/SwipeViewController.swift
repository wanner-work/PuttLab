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
        webView!.allowsBackForwardNavigationGestures = true
    }
}
