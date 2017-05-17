var loadNative = function (url, callback) {
    var dirpath = jsb.fileUtils.getWritablePath() + 'img/';
    var filepath = dirpath + MD5(url) + '.png';

    function loadEnd() {
        cc.loader.load(filepath, function (err, tex) {
            if (err) {
                cc.error(err);
            } else {
                var spriteFrame = new cc.SpriteFrame(tex);
                if (spriteFrame) {
                    spriteFrame.retain();
                    callback(spriteFrame);
                }
            }
        });

    }

    if (jsb.fileUtils.isFileExist(filepath)) {
        cc.log('Remote is find' + filepath);
        loadEnd();
        return;
    }

    var saveFile = function (data) {
        if (typeof data !== 'undefined') {
            if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
                jsb.fileUtils.createDirectory(dirpath);
            }

            if (jsb.fileUtils.writeDataToFile(new Uint8Array(data), filepath)) {
                cc.log('Remote write file succeed.');
                loadEnd();
            } else {
                cc.log('Remote write file failed.');
            }
        } else {
            cc.log('Remote download file failed.');
        }
    };

    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function () {
        cc.log("xhr.readyState  " + xhr.readyState);
        cc.log("xhr.status  " + xhr.status);
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                xhr.responseType = 'arraybuffer';
                saveFile(xhr.response);
            } else {
                saveFile(null);
            }
        }
    }.bind(this);
    xhr.open("GET", url, true);
    xhr.send();
};

/**
 * 截屏
 * @param  {[function]} func 回调函数
 * @return
 */
var screenShoot = function (func, thumbHeight = 100) {
    if (!cc.sys.isNative) return;
    let dirpath = jsb.fileUtils.getWritablePath() + 'ScreenShoot/';
    if (!jsb.fileUtils.isDirectoryExist(dirpath)) {
        jsb.fileUtils.createDirectory(dirpath);
    }

    let name = 'ScreenShoot-' + (new Date()).valueOf() + '.png';
    let filepath = dirpath + name;
    let size = cc.winSize;
    let h = thumbHeight;
    let scale = h / size.height;
    let w = Math.floor(size.width * scale);

    let rt = cc.RenderTexture.create(size.width, size.height, cc.Texture2D.PIXEL_FORMAT_RGBA8888, gl.DEPTH24_STENCIL8_OES);
    cc.director.getScene()._sgNode.addChild(rt);
    rt.setVisible(false);
    rt.begin();
    cc.director.getScene()._sgNode.visit();
    rt.end();
    rt.saveToFile('ScreenShoot/' + name, cc.ImageFormat.PNG, true, function () {
        cc.log('save succ');
        rt.removeFromParent();
        if (func) {
            func(filepath, w, h);
        }
    });
};

/**
 * AES
 */
var CryptoJS = require("crypto-js");
var AES = function () { }
AES.decrypt = function (data, key, iv) {
    let decrypted = ''
    if (key) {
        iv = iv || key;
        decrypted = CryptoJS.AES.decrypt(data.toString(), CryptoJS.enc.Utf8.parse(key), {
            iv: CryptoJS.enc.Utf8.parse(iv),
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        decrypted = CryptoJS.enc.Utf8.stringify(decrypted);
    }
    return decrypted;
}

/**
 * 格式化点数,以万为单位
 * @param  {Number} gold    点数
 * @param  {Number} precision 精度
 */
var formatGold = function (gold, precision, limit) {
    let goldNum = Math.abs(parseInt(gold)),
        transMin = limit || 100000,
        transBase = gold >= 100000000 ? 100000000 : 10000,
        result = null;

    if (goldNum < transMin) {
        return gold;
    }

    if (isNaN(precision)) {
        precision = 2;
    }

    goldNum /= transBase;

    if (goldNum % 1 > Math.pow(0.1, precision)) {
        let num = goldNum * Math.pow(10, precision);
        result = (Number.isFinite(num) ? Math.round(num) : Math.floor(num)) / Math.pow(10, precision);
    } else {
        result = parseInt(goldNum);
    }

    return result + (transBase === 10000 ? '万' : '亿');
}

/**
 * 计算下注筹码
 * @param  {Number} gold    下注金币
 * @param  {Array} chipOptions 筹码选择列表
 */
var getChips = function (gold, chipOptions) {
    let chips = [];
    while (gold > 0) {
        for (let i = chipOptions.length - 1; i >= 0; i--) {
            let count = Math.floor(gold / chipOptions[i].value);
            for (let j = count - 1; j >= 0; j--) {
                chips.push(chipOptions[i]);
            }
            gold -= count * chipOptions[i].value;

            if (gold > 0 && gold < chipOptions[0].value) {
                chips.push(chipOptions[i]);
                gold = 0;
            }

            if (gold <= 0) {
                break;
            }
        }
    }
    return chips;
}

var generateUniqueID = function (len) {
    var rdmString = "";
    for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
    return rdmString.substr(0, len);
}

var getStringByteLength = function (val) {
    let len = 0;
    for (var i = 0; i < val.length; i++) {
        if (val[i].match(/[^x00-xff]/ig) !== null) {
            len += 2;
        } else {
            len += 1;
        }
    }
    return len;
}

var getStringByLength = function (str, num) {
    let len = getStringByteLength(str);
    if (len >= num) {
        let newStr = '',
            count = 0;
        for (var i = 0; i < str.length; i++) {
            if (str[i].match(/[^x00-xff]/ig) !== null) {
                count += 2;
            } else {
                count += 1;
            }
            if (count < num) {
                newStr += str[i];
            } else {
                break;
            }
        }
        str = newStr + "...";
    }
    return str;
}

module.exports = {
    loadNative,
    screenShoot,
    AES,
    formatGold,
    getChips,
    generateUniqueID,
    getStringByteLength,
    getStringByLength,
};
