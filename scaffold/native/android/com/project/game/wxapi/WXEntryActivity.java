package com.project.game.wxapi;

//android包
import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

//微信包
import com.tencent.mm.sdk.openapi.BaseReq;
import com.tencent.mm.sdk.openapi.BaseResp;
import com.tencent.mm.sdk.openapi.SendAuth;
import com.tencent.mm.sdk.openapi.ConstantsAPI;
import com.tencent.mm.sdk.openapi.IWXAPIEventHandler;


import org.cocos2dx.javascript.AppActivity;


public class WXEntryActivity extends Activity implements IWXAPIEventHandler {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_main);

        // 关于微信
        AppActivity.wxApi.handleIntent(getIntent(), this);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        AppActivity.wxApi.handleIntent(intent, this);
    }

    // 微信发送请求到第三方应用时，会回调到该方法
    @Override
    public void onReq(BaseReq req) {
        switch (req.getType()) {
            case ConstantsAPI.COMMAND_GETMESSAGE_FROM_WX:
                break;
            case ConstantsAPI.COMMAND_SHOWMESSAGE_FROM_WX:
                break;
            default:
                break;
        }
        finish();
    }

    // 第三方应用发送到微信的请求处理后的响应结果，会回调到该方法
    @Override
    public void onResp(BaseResp resp) {
        switch (resp.errCode) {
            case BaseResp.ErrCode.ERR_OK:
                switch (resp.getType()) {
                    case ConstantsAPI.COMMAND_SENDAUTH:
                        //登录回调,处理登录成功的逻辑
                        final String code = ((SendAuth.Resp)resp).token; //即为所需的code
                        AppActivity.setCode( code );
                        break;
                    case ConstantsAPI.COMMAND_SENDMESSAGE_TO_WX:
                        //分享回调,处理分享成功后的逻辑
                        break;
                    default:
                        break;
                }
                break;
            case BaseResp.ErrCode.ERR_USER_CANCEL:
                break;
            case BaseResp.ErrCode.ERR_AUTH_DENIED:
                break;
            default:
                break;
        }
        finish();
    }
}
