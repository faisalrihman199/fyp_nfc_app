package com.washow.nfcopenrewriter;

import android.telephony.SmsManager;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class SmsModule extends ReactContextBaseJavaModule {

    SmsModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "SmsModule"; // This name must match the one used in JS
    }

    @ReactMethod
    public void sendSms(String phoneNumber, String message, Callback callback) {
        try {
            if (phoneNumber != null && message != null) {
                SmsManager smsManager = SmsManager.getDefault();
                smsManager.sendTextMessage(phoneNumber, null, message, null, null);
                callback.invoke("SMS sent successfully");
            } else {
                callback.invoke("Error: Invalid phone number or message");
            }
        } catch (Exception e) {
            callback.invoke("Error: " + e.getMessage());
        }
    }
}
