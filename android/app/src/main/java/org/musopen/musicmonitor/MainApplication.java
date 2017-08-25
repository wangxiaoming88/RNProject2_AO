package org.musopen.musicmonitor;

import android.app.Application;

import com.BV.LinearGradient.LinearGradientPackage;
import com.corbt.keepawake.KCKeepAwakePackage;
import com.facebook.react.ReactApplication;
import com.greatdroid.reactnative.media.MediaKitPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import org.wonday.pdf.RCTPdfView;
import com.zmxv.RNSound.RNSoundPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.idehub.GoogleAnalyticsBridge.GoogleAnalyticsBridgePackage;
import com.imagepicker.ImagePickerPackage;
import com.kevinejohn.RNMixpanel.RNMixpanel;
import com.magus.fblogin.FacebookLoginPackage;
import com.ocetnik.timer.BackgroundTimerPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.reactlibrary.RNBcgTimerPackage;
import com.remobile.splashscreen.RCTSplashScreenPackage;
import com.smixx.fabric.FabricPackage;
import java.util.Arrays;
import java.util.List;

import co.apptailor.googlesignin.RNGoogleSigninPackage;

public class MainApplication extends Application implements ReactApplication {
  private static final String CODEPUSH_DEPLOYMENT_KEY = "SYN7f2h50Zqp-RZENrDadrEJZ8x_E19P9kGa-";

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

//    @Override
//    protected String getJSBundleFile() {
//      return CodePush.getJSBundleFile();
//    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new RNMixpanel(), // mixpanel analytics
        new GoogleAnalyticsBridgePackage(), // google analytics
        new MainReactPackage(),
            new MediaKitPackage(),
            new RNGoogleSigninPackage(),
            new RNFetchBlobPackage(),
            new RCTPdfView(),
            new RNSoundPackage(),
        new LinearGradientPackage(),
        new FabricPackage(),
        new BackgroundTimerPackage(),
        new VectorIconsPackage(),
        new ImagePickerPackage(),
        new FacebookLoginPackage(),
        new RCTSplashScreenPackage(MainActivity.mainActivity),
        new KCKeepAwakePackage(),
        new RNBcgTimerPackage()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
      return mReactNativeHost;
  }
}
