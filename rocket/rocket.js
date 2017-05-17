var Native = require('native-extend');
var Enums = require('custom-enum');
var VO = require('custom-vo');
var AudioCtrl = require('audio-ctrl');
var VoiceCtrl = require('voice-ctrl');

var RunEnv = Enums.RunEnv;
var PingVO = VO.PingVO;

var rocket = cc.Class({
    extends: cc.Component,

    properties: {
        appName: '',              //应用名称
        build: '1',                 //热更版本信息
        updateURLs: [cc.String],    //更新地址列表
        confingURLs: [cc.String],   //游戏配置地址列表

        runEnv: {   //运行环境
            default: RunEnv.TEST,
            type: RunEnv,
        },

        ping: {
            default: null,
            type: PingVO,
        },

        isTestLogin: false, //测试账号登录
        isMusicOn: true,
        isEffectOn: true,


        _version: null,
        _config: null,
    },

    statics: {
        instance: null,
    },

    onLoad() {
        rocket.instance = this;
        cc.game.addPersistRootNode(this.node);
        this.init();
    },

    getVersion() {
        if (!this._version) {
            this._version = cc.sys.isNative ? Native.getVersion() : '1.0.0';
        }
        return this._version;
    },

    getVersionName() {
        return 'v ' + this.getVersion() + '.' + this.build;
    },

    getUpdateURL() {
        return (this.updateURLs[this.runEnv - 1] + '/app/native/{os}/version.json').replace('{os}', cc.sys.os.toLocaleLowerCase());
    },

    getDownloadURL() {
        return this.updateURLs[this.runEnv - 1];
    },

    getConfigURL() {
        return this.confingURLs[this.runEnv - 1] + '/game/info';
    },

    setConfig(data) {
        this._config = data;
    },

    getServerByName(gameName) {
        return this._config[gameName];
    },

    isGuestAllowded() {
        return this._config && this._config.visitor === true;
    },

    init() {
        //初始化音效组件
        AudioCtrl.getInstance().init(this.isMusicOn, this.isEffectOn);
        VoiceCtrl.getInstance().init();
    }
});
