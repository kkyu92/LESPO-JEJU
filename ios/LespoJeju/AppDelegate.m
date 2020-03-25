/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <React/RCTLinkingManager.h>
#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>
#import <KakaoOpenSDK/KakaoOpenSDK.h>
#import <KakaoLink/KakaoLink.h>
#import <KakaoMessageTemplate/KakaoMessageTemplate.h>
// #import <KakaoPlusFriend/KakaoPlusFriend.h>
#import <NaverThirdPartyLogin/NaverThirdPartyLoginConnection.h>
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <GoogleMaps/GoogleMaps.h>
#import <Firebase.h> //Add This Line
#import "RNFirebaseNotifications.h" //Add This Line
#import "RNFirebaseMessaging.h"

@implementation AppDelegate
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // Firebase
  [FIRApp configure]; //Add This Line
  [RNFirebaseNotifications configure];  //Add This Line

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];
  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"LespoJeju"
                                            initialProperties:nil];

  rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  [[FBSDKApplicationDelegate sharedInstance] application:application
    didFinishLaunchingWithOptions:launchOptions];
  [GMSServices provideAPIKey:@"AIzaSyDHUfqOG16BIZHBzD7JY8oBgCTzMWSldmk"]; // add this line using the api key obtained from Google Console
  [[UNUserNotificationCenter currentNotificationCenter] setDelegate:self]; //Add This Line
  return YES;
}

// Firebase Notifications
- (void)application:(UIApplication *)application didReceiveLocalNotification:(UILocalNotification *)notification {
  [[RNFirebaseNotifications instance] didReceiveLocalNotification:notification];
}
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(nonnull NSDictionary *)userInfo
                                                       fetchCompletionHandler:(nonnull void (^)(UIBackgroundFetchResult))completionHandler{
  [[RNFirebaseNotifications instance] didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}

- (void)application:(UIApplication *)application didRegisterUserNotificationSettings:(UIUserNotificationSettings *)notificationSettings {
  [[RNFirebaseMessaging instance] didRegisterUserNotificationSettings:notificationSettings];
}

- (BOOL)application:(UIApplication *)application 
            openURL:(NSURL *)url 
            options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
              BOOL handled;
if ([url.scheme isEqualToString:@"naverlogin"]) {
    handled = [[NaverThirdPartyLoginConnection getSharedInstance] application:application openURL:url options:options];
  }
  handled =  [[FBSDKApplicationDelegate sharedInstance] application:application openURL:url options:options];
  // Add any custom logic here.
  return handled;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
                                      sourceApplication:(NSString *)sourceApplication
                                              annotation:(id)annotation {
    if ([KOSession isKakaoAccountLoginCallback:url]) {
        return [KOSession handleOpenURL:url];
    }

    return false;
}

// - (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
//  restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
// {
//  return [RCTLinkingManager application:application
//                   continueUserActivity:userActivity
//                     restorationHandler:restorationHandler];
// }

// NAVER LOGIN #4. 인증방법 적용안함
// - (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary *)options {
//    return [[NaverThirdPartyLoginConnection getSharedInstance] application:app openURL:url options:options];
// }
// - (BOOL)application:(UIApplication *)application openURL:(nonnull NSURL *)url options:(nonnull NSDictionary<NSString *,id> *)options {
//   if ([url.scheme isEqualToString:@"naverlogin"]) {
//     return [[NaverThirdPartyLoginConnection getSharedInstance] application:application openURL:url options:options];
//   }

//   return [RNGoogleSignin application:application openURL:url options:options];
// }

// - (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
//                                                options:(NSDictionary<NSString *,id> *)options {
//    if ([KOSession isKakaoAccountLoginCallback:url]) {
//        return [KOSession handleOpenURL:url];
//    }
//    return false;
// }

- (void)applicationDidBecomeActive:(UIApplication *)application
{
    [KOSession handleDidBecomeActive];
}

@end
