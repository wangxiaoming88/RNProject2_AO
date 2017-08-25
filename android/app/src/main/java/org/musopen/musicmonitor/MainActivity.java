package org.musopen.musicmonitor;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Log;

import com.facebook.react.ReactActivity;
import com.crashlytics.android.Crashlytics;
import io.fabric.sdk.android.Fabric;
import com.facebook.common.logging.FLog;

public class MainActivity extends ReactActivity {
    public static Activity activity;
//    private final String TAG = "My Service: ";
    public static MainActivity mainActivity = null;

    public MainActivity() {
        mainActivity = this;
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        activity = this;
        return "MusicMonitor";
    }
    
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

//        Log.i(TAG, "Life CREATE");
        Fabric.with(this, new Crashlytics());
        FLog.setLoggingDelegate(ReactNativeFabricLogger.getInstance());
    }

    protected void onResume() {
        super.onResume();
//        Log.i(TAG, "Life RESUME");
        stopService(new Intent(getBaseContext(), BackgroundService.class));
    }

    protected void onPause() {
        super.onPause();
//        Log.i(TAG, "Life PAUSE");

        SharedPreferences shared = getSharedPreferences("myData", Context.MODE_PRIVATE);
        Boolean start = shared.getBoolean("status", false);
//        Log.d(TAG, start.toString());

        if (start) {
            startService(new Intent(MainActivity.this, BackgroundService.class));
        }
    }
}
