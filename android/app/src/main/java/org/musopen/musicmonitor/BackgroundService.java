package org.musopen.musicmonitor;

import android.app.IntentService;
import android.content.Intent;
import android.support.annotation.Nullable;
import android.util.Log;

public class BackgroundService extends IntentService {

    public BackgroundService() {
        super(BackgroundService.class.getName());
    }

//    private final String TAG = "My Service: ";
    private boolean running;

    public void onCreate() {
        super.onCreate();
//        Log.i(TAG, "onCreate");
    }

    public int onStartCommand(Intent intent, int flags, int startId) {
//        Log.d(TAG, "onStartCommand");
        go();
        return START_STICKY;
    }

    public void go() {
//        Log.d(TAG, "go");

        running = true;

        new Thread(new Thread() {
            @Override
            public void run() {
                while (running) {
                    try {
                        Thread.sleep(1000);
//                        Log.i(TAG, "go Thread GO");
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }
//                Log.i(TAG, "Thread WHILE runnung " + running);
                stopSelf();
            }
        }).start();
    }

    public void onDestroy() {
//        Log.d(TAG, "onDestroy");
        running = false;
        super.onDestroy();
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {

    }
}
