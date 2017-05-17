/****************************************************************************
Copyright (c) 2015 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;

import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.telephony.TelephonyManager;
import android.view.WindowManager;


import com.project.game.R;
import com.rocket.utils.Util;
import com.tencent.mm.sdk.openapi.IWXAPI;
import com.tencent.mm.sdk.openapi.SendAuth;
import com.tencent.mm.sdk.openapi.SendMessageToWX;
import com.tencent.mm.sdk.openapi.WXAPIFactory;
import com.tencent.mm.sdk.openapi.WXImageObject;
import com.tencent.mm.sdk.openapi.WXMediaMessage;
import com.tencent.mm.sdk.openapi.WXTextObject;
import com.tencent.mm.sdk.openapi.WXWebpageObject;

import java.io.File;

public class AppActivity extends Cocos2dxActivity {

    private static AppActivity app = null;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON, WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        app = this;
        SDKWrapper.getInstance().init(this);
        registerWX();
    }
	
    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

        SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView);

        return glSurfaceView;
    }

    @Override
    protected void onResume() {
        super.onResume();
        SDKWrapper.getInstance().onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        SDKWrapper.getInstance().onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        SDKWrapper.getInstance().onDestroy();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        SDKWrapper.getInstance().onStop();
    }
        
    @Override
    public void onBackPressed() {
        SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        SDKWrapper.getInstance().onStart();
        super.onStart();
    }


    /**
     * WECHAT SDK
     * ================================================
     */

    public static final String  APP_ID = "wx97433b2c2639491e";
    public static IWXAPI wxApi  = null;

    // 注册到微信
    private void registerWX() {
        // 通过WXAPIFactory工厂，获取IWXAPI的实例
        wxApi = WXAPIFactory.createWXAPI( this, APP_ID, true );

        // 将应用的APP_ID注册到微信
        wxApi.registerApp( APP_ID );
    }

    public static boolean isWxInstalled() {
        return wxApi.isWXAppInstalled();
    }

    // 微信登录
    public static void sendAuthToWX() {
        final SendAuth.Req req = new SendAuth.Req();
        req.scope = "snsapi_userinfo";
        req.state = "sunshine_zhajinhua";
        wxApi.sendReq( req );
    }

    public static void setCode(final String code) {
        app.runOnGLThread( new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString( "cc.find('Canvas').getComponent('game-scene').setCode('" + code + "')" );
            }
        });
    }

    // 微信文字分享
    public static void shareTextWithWX(String text, int scene) {
        WXTextObject textObj = new WXTextObject();
        textObj.text = text;

        WXMediaMessage msg = new WXMediaMessage();
        msg.mediaObject = textObj;
        msg.description = text;

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("text");
        req.message = msg;
        req.scene = scene;
        wxApi.sendReq(req);
    }

    public static void shareLinkWithWX(String url, String title, String description, int scene) {
        WXWebpageObject webpage = new WXWebpageObject();
        webpage.webpageUrl = url;

        WXMediaMessage msg = new WXMediaMessage(webpage);
        msg.title = title;
        msg.description = description;

//        Bitmap bmp = BitmapFactory.decodeResource(getContext().getResources(), R.mipmap.icon_108);
//        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, THUMB_SIZE, true);
//        bmp.recycle();
//        msg.thumbData = Util.bmpToByteArray(thumbBmp, true);

        SendMessageToWX.Req req = new SendMessageToWX.Req();
        req.transaction = buildTransaction("webpage");
        req.message = msg;
        req.scene = scene;
        wxApi.sendReq(req);
    }

    public static void shareImageWithWX(String path, int width, int height, int scene) {
        try{
            File file = new File(path);
            if (!file.exists()) {
                return;
            }
            Bitmap bmp = BitmapFactory.decodeFile(path);

            WXImageObject imgObj = new WXImageObject(bmp);
            //imgObj.setImagePath(path);

            WXMediaMessage msg = new WXMediaMessage();
            msg.mediaObject = imgObj;


            Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, width, height, true);
            bmp.recycle();
            msg.thumbData = Util.bmpToByteArray(thumbBmp, true);

            SendMessageToWX.Req req = new SendMessageToWX.Req();
            req.transaction = buildTransaction("img");
            req.message = msg;
            req.scene = scene;
            wxApi.sendReq(req);
        }
        catch(Exception e){
            e.printStackTrace();
        }
    }

    private static String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    //================================================================

    public static String getUUID() {
        TelephonyManager telephonyManager;
        telephonyManager  = (TelephonyManager)app.getSystemService(Context.TELEPHONY_SERVICE);
        return telephonyManager.getDeviceId();
    }

    public static String getVersion() {
        String version = null;
        try {
            PackageManager manager = app.getPackageManager();
            PackageInfo info = manager.getPackageInfo(app.getPackageName(), 0);
            version = info.versionName;
            return version;
        }catch (Exception e){
            e.printStackTrace();
            return version = "Can't to found the version!";
        }
    }

}
