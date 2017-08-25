/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

#import "AppDelegate.h"

#import "RCTBundleURLProvider.h"
#import "RCTRootView.h"
#import "RNGoogleSignin.h"
#import <FBSDKCoreKit/FBSDKCoreKit.h>
#import <FBSDKLoginKit/FBSDKLoginKit.h>
#import "RCTSplashScreen.h"
#import <AVFoundation/AVFoundation.h>
//#import "Mixpanel.h" // mix panel
#import <Fabric/Fabric.h>
#import <Crashlytics/Crashlytics.h>

#import <asl.h>
#import "RCTLog.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // need for CrashLytics
  [Fabric with:@[[Crashlytics class]]];
  RCTSetLogThreshold(RCTLogLevelInfo);
  RCTSetLogFunction(CrashlyticsReactLogFunction);
  
  NSURL *jsCodeLocation;
  //[[RCTBundleURLProvider sharedSettings] setDefaults];
 //jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
   jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index.ios" fallbackResource:nil];

  // simulator bundle local
  // jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];

//#ifdef DEBUG
//    jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
//#else
  //jsCodeLocation = [CodePush bundleURL];
//#endif
  self.flag = false;
  // WebView audio enable
  AVAudioSession *audioSession = [AVAudioSession sharedInstance];
  NSError *setCategoryError = nil;
  [audioSession setCategory:AVAudioSessionCategoryPlayback
                      error:&setCategoryError];
  
  RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                                      moduleName:@"MusicMonitor"
                                               initialProperties:nil
                                                   launchOptions:launchOptions];
  // rootView.backgroundColor = [[UIColor alloc] initWithRed:1.0f green:1.0f blue:1.0f alpha:1];
  [RCTSplashScreen show:rootView];
  
  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  
   return YES;
//  return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                    didFinishLaunchingWithOptions:launchOptions];
}

//- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
//  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
//
//  // return [RNGoogleSignin application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
//  return ([[FBSDKApplicationDelegate sharedInstance] application:application
//                                                          openURL:url
//                                                sourceApplication:sourceApplication
//                                                       annotation:annotation] ||
//          [RNGoogleSignin application:application openURL:url sourceApplication:sourceApplication annotation:annotation]);
//}

// Facebook SDK
//- (void)applicationDidBecomeActive:(UIApplication *)application {
//    [FBSDKAppEvents activateApp];
//}
//- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
//  return [[FBSDKApplicationDelegate sharedInstance] application:application
//                                                        openURL:url
//                                              sourceApplication:sourceApplication
//                                                     annotation:annotation];
//}

// Google SDK + Facebook
//- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url
//  sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
//  
//  return [RNGoogleSignin application:application openURL:url sourceApplication:sourceApplication annotation:annotation];
//}

- (void)methodToRepeatEveryOneSecond
{
  NSLog(@"methodToRepeatEveryOneSecond");
  if (self.flag) {
   dispatch_queue_t q_background = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0);
   double delayInSeconds = 1.0;
   dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, delayInSeconds * NSEC_PER_SEC);
   dispatch_after(popTime, q_background, ^(void){
     [self methodToRepeatEveryOneSecond];
   });
  }
}

-(void)applicationDidEnterBackground:(UIApplication *)application{
  NSLog(@"applicationDidEnterBackground");
  
  NSUserDefaults* def = [[NSUserDefaults alloc] init];
  NSLog(@"%@ current", [def valueForKey:@"status" ]);
  if ( [[def valueForKey:@"status" ] boolValue]) {
    self.flag = true;
    dispatch_queue_t q_background = dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_BACKGROUND, 0);
    dispatch_async(q_background, ^{
      [self methodToRepeatEveryOneSecond];
    });
  }
}

-(void)applicationWillEnterForeground:(UIApplication *)application{
  self.flag = false;
  NSLog(@"applicationWillEnterForeground");
}

-(void)applicationDidBecomeActive:(UIApplication *)application{
  NSLog(@"applicationDidBecomeActive");
}


- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url sourceApplication:(NSString *)sourceApplication annotation:(id)annotation {
  if([[FBSDKApplicationDelegate sharedInstance] application:application
                                                    openURL:url
                                          sourceApplication:sourceApplication
                                                 annotation:annotation])
  {
    return YES;
  }
  
  return [RNGoogleSignin application:application
                             openURL:url
                   sourceApplication:sourceApplication
                          annotation:annotation];
}

RCTLogFunction CrashlyticsReactLogFunction = ^(
                                               RCTLogLevel level,
                                               __unused RCTLogSource source,
                                               NSString *fileName,
                                               NSNumber *lineNumber,
                                               NSString *message
                                               )
{
  NSString *log = RCTFormatLog([NSDate date], level, fileName, lineNumber, message);
  
#ifdef DEBUG
  CLS_LOG(@"REACT LOG: %s", log.UTF8String);
  fprintf(stderr, "%s\n", log.UTF8String);
  fflush(stderr);
#else
  CLS_LOG(@"REACT LOG: %s", log.UTF8String);
#endif
  
  int aslLevel;
  switch(level) {
    case RCTLogLevelTrace:
      aslLevel = ASL_LEVEL_DEBUG;
      break;
    case RCTLogLevelInfo:
      aslLevel = ASL_LEVEL_NOTICE;
      break;
    case RCTLogLevelWarning:
      aslLevel = ASL_LEVEL_WARNING;
      break;
    case RCTLogLevelError:
      aslLevel = ASL_LEVEL_ERR;
      break;
    case RCTLogLevelFatal:
      aslLevel = ASL_LEVEL_CRIT;
      break;
  }
  asl_log(NULL, NULL, aslLevel, "%s", message.UTF8String);
  
  
};

@end
