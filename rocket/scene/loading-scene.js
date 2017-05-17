var Locale = require('locale');
var Utils = require('utils');
var Rocket = require('rocket');
var HttpRequest = require('http-request');

cc.Class({
    extends: require('base-scene'),

    properties: {
        versionLbl: cc.Label,
        tipsLbl: cc.Label,
        progressBar: cc.ProgressBar,
    },

    onLoad() {
        this._super();
        this.versionLbl.string = Rocket.instance.getVersionName();

        if (cc.sys.isNative) {
            this._checkMainVersion();
            this._isGameShow = true;
            cc.game.on(cc.game.EVENT_HIDE, this._onGameHide, this);
            cc.game.on(cc.game.EVENT_SHOW, this._onGameShow, this);

        } else {
            this._loadConfig();
        }
    },

    _onGameHide(event) {
        this._isGameShow = false;
    },

    _onGameShow(event) {
        if (!this._isGameShow) {
            this._isGameShow = true;
            this._checkMainVersion();
        }
    },

    _checkMainVersion() {
        let request = new HttpRequest();
        request.onTimeout = () => {
            this._checkHotUpdate();
        };
        request.onError = () => {
            this._checkHotUpdate();
        };
        request.onSuccess = (response) => {
            if (Rocket.instance.getVersion() !== response.version) {
                let isForceUpdate = ('true' === response.isForceUpdate);
                this.createAlert(Locale.motherUpdate, true, function () {
                    cc.sys.openURL(response.url);
                }, isForceUpdate ? null : this._loadConfig.bind(this), isForceUpdate, 'update');
            } else {
                this._checkHotUpdate();
            }
        };
        request.send('GET', Rocket.instance.getUpdateURL());
    },

    _checkHotUpdate() {
        this.progressBar.progress = 0.1;
        this.getComponent('hot-update').init(this._loadConfig.bind(this));
    },

    _loadConfig() {
        this.progressBar.progress = 0.8;

        let errorHandle = () => {
            this.createAlert(Locale.networkError, true, () => {
                this._loadConfig();
            }, () => {
                cc.game.end();
            });
        }

        if (Rocket.instance.runEnv > 0) {
            let request = new HttpRequest();
            request.onTimeout = () => {
                errorHandle();
            };
            request.onError = () => {
                errorHandle();
            };
            request.onSuccess = (response) => {
                this.gotoNextScene(JSON.parse(Utils.AES.decrypt(response, 'yt3f5ee9r123g5q1')))
            };
            request.send('GET', Rocket.instance.getConfigURL());
        } else {
            // 本地测试从resources中加载配置数据
            cc.loader.loadRes('test-cases/game-info', (err, resource) => {
                if (err) {
                    errorHandle();
                } else {
                    this.gotoNextScene(resource);
                }
            });
        }
    },

    gotoNextScene(cfg) {
        cc.game.off(cc.game.EVENT_HIDE, this._onGameHide, this);
        cc.game.off(cc.game.EVENT_SHOW, this._onGameShow, this);

        Rocket.instance.setConfig(cfg);
        this.progressBar.progress = 1;
        cc.director.loadScene(this.nextScene);
    }
});
