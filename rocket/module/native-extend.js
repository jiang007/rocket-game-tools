/**
 * 与原生环境做交互
 */


var Caller = {
    'ios': 'AppController',
    'android': 'org/cocos2dx/javascript/AppActivity'
};

/**
 * Social========================================
 */

var Social = function() {};

Social.shareLinkWithWX = function(url, title, description, scene) {
    if (!cc.sys.isNative) {
        cc.log(url, title, description, scene);
    } else {
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(Caller.ios, 'shareLinkWithWX:title:description:scene:', url, title, description, scene);
        } else {
            jsb.reflection.callStaticMethod(Caller.android, 'shareLinkWithWX', '(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;I)V',
                url, title, description, scene);
        }
    }
};

/**
 * 微信-发送超链接给好友
 * @param {[string]} url   [超链接]
 * @param {[string]} title [标题]
 * @param {[string]} description [描述]
 */
Social.shareLinkToFriendWithWX = function(url, title, description) {
    Social.shareLinkWithWX(url, title, description, 0);
};

/**
 * 微信-发送超链接给朋友圈
 * @param {[string]} url   [超链接]
 * @param {[string]} title [标题]
 * @param {[string]} description [描述]
 */
Social.shareLinkToTimelineWithWX = function(url, title, description) {
    Social.shareLinkWithWX(url, title, description, 1);
};

Social.shareTextToFriendWithWX = function(text) {
    Social.shareTextWithWX(text, 0);
};

Social.shareTextToTimelineWithWX = function(text) {
    Social.shareTextToTimelineWithWX(text, 1);
};

/**
 * 微信分享文字
 * @param  {[string]} text  [内容]
 * @param  {[int]}    scene [场景]
 * @return
 */
Social.shareTextWithWX = function(text, scene) {
    if (!cc.sys.isNative) {
        cc.log(text, scene);
    } else {
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(Caller.ios, 'shareTextWithWX:scene:', text, scene);
        } else {
            jsb.reflection.callStaticMethod(Caller.android, 'shareTextWithWX', '(Ljava/lang/String;I)V', text, scene);
        }
    }
};

Social.shareImageToFriendWithWX = function(path, width, height) {
    Social.shareImageWithWX(path,width, height, 0);
};

Social.shareImageToTimelineWithWX = function(path,width, height) {
    Social.shareImageWithWX(path, 1);
};

/**
 * 微信分享照片
 * @param  {[string]} path  [图片路径]
 * @param  {[int]}    scene [场景]
 * @return
 */
Social.shareImageWithWX = function(path, width, height,scene) {
    if (!cc.sys.isNative) {
        cc.log(path, scene);
    } else {
        if (cc.sys.os === cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod(Caller.ios, 'shareImageWithWX:scene:', path, scene);
        } else {
            jsb.reflection.callStaticMethod(Caller.android, 'shareImageWithWX', '(Ljava/lang/String;III)V', path, width, height,scene);
        }
    }
};

/**
 * 微信-登录授权
 */
Social.sendAuthToWX = function() {
    if (cc.sys.os === cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod(Caller.ios, 'sendAuthToWX');
    } else {
        jsb.reflection.callStaticMethod(Caller.android, 'sendAuthToWX', '()V');
    }
};

Social.isWXInstalled = function () {
    if (!cc.sys.isNative) {
        return false;
    }
    
    if (cc.sys.os === cc.sys.OS_IOS) {
        return jsb.reflection.callStaticMethod(Caller.ios, 'isWxInstalled');
    } else {
        return jsb.reflection.callStaticMethod(Caller.android, 'isWxInstalled', '()Z');
    }
}

//===============================================


/**
 * 获取机器uuid
 * @return {[string]} uuid
 */
var getUUID = function() {
    let uuid = 'xxx';
    if (cc.sys.isNative) {
        if (cc.sys.os === cc.sys.OS_IOS) {
            uuid = jsb.reflection.callStaticMethod(Caller.ios, 'getUUID');
        } else {
            uuid = jsb.reflection.callStaticMethod(Caller.android, 'getUUID', '()Ljava/lang/String;');
        }
    }
    return uuid;
};

// 获取版本号
var getVersion = function () {
    let version = '1.0.0';
    if (cc.sys.isNative) {
        if (cc.sys.os === cc.sys.OS_IOS) {
            version = jsb.reflection.callStaticMethod(Caller.ios, 'getVersion');
        } else {
            version = jsb.reflection.callStaticMethod(Caller.android, 'getVersion', '()Ljava/lang/String;');
        }
    }
    return version;
}

module.exports = {
    Social,
    getUUID,
    getVersion,
}
