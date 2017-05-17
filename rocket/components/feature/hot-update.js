/**
 * 热更组件
 */
cc.Class({
    extends: cc.Component,

    properties: {
        manifestUrl: {
            default: null,
            url: cc.RawAsset
        },

        pathName: {
            default: '',
            tooltip: 'path'
        }
    },

    checkCb: function(event) {
        cc.log('Code: ' + event.getEventCode());
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log("No local manifest file found, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log("Fail to download manifest file, hot update skipped.");
                cc.eventManager.removeListener(this._checkListener);
                this._completeCall();
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log("Already up to date with the latest remote version.");
                cc.eventManager.removeListener(this._checkListener);
                this._completeCall();
                break;
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                this._needUpdate = true;
                cc.eventManager.removeListener(this._checkListener);
                cc.log('new version found')
                setTimeout(this.hotUpdate.bind(this), 1000);
                break;
            default:
                break;
        }
    },

    updateCb: function(event) {
        var needRestart = false;
        var failed = false;
        switch (event.getEventCode()) {
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                cc.log('>No local manifest file found, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                var percent = event.getPercent();
                var percentByFile = event.getPercentByFile();

                var msg = event.getMessage();
                if (msg) {
                    cc.log(msg);
                }
                cc.log(percent.toFixed(2) + '%');
                break;
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                cc.log('>Fail to download manifest file, hot update skipped.');
                failed = true;
                break;
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                cc.log('>Already up to date with the latest remote version.');
                failed = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                cc.log('>Update finished. ' + event.getMessage());

                needRestart = true;
                break;
            case jsb.EventAssetsManager.UPDATE_FAILED:
                cc.log('>Update failed. ' + event.getMessage());

                this._failCount++;
                if (this._failCount < 5) {
                    this._am.downloadFailedAssets();
                } else {
                    cc.log('>Reach maximum fail count, exit update process');
                    this._failCount = 0;
                    failed = true;
                }
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                cc.log('>Asset update error: ' + event.getAssetId() + ', ' + event.getMessage());
                break;
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                cc.log(event.getMessage());
                break;
            default:
                break;
        }

        if (failed) {
            cc.eventManager.removeListener(this._updateListener);
            this._completeCall();
        }

        if (needRestart) {
            cc.eventManager.removeListener(this._updateListener);
            // Prepend the manifest's search path
            var searchPaths = jsb.fileUtils.getSearchPaths();
            var newPaths = this._am.getLocalManifest().getSearchPaths();
            Array.prototype.unshift(searchPaths, newPaths);
            // This value will be retrieved and appended to the default search path during game startup,
            // please refer to samples/js-tests/main.js for detailed usage.
            // !!! Re-add the search paths in main.js is very important, otherwise, new scripts won't take effect.
            cc.sys.localStorage.setItem('hotUpdate', 'true');
            cc.sys.localStorage.setItem('HotUpdateSearchPaths', JSON.stringify(searchPaths));
            cc.log('<<<<', cc.sys.localStorage.getItem('HotUpdateSearchPaths'));
            jsb.fileUtils.setSearchPaths(searchPaths);

            cc.game.restart();
        }
    },

    hotUpdate: function() {
        if (this._am && this._needUpdate) {
            this._updateListener = new jsb.EventListenerAssetsManager(this._am, this.updateCb.bind(this));
            cc.eventManager.addListener(this._updateListener, 1);

            this._failCount = 0;
            this._am.update();
        }
    },

    init: function(completeCall) {
        this._completeCall = completeCall;

        // Hot update is only available in Native build
        if (!cc.sys.isNative) {
            this._completeCall();
            return;
        }
        var storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + this.pathName);
        cc.log('Storage path for remote asset : ' + storagePath);

        // cc.log('Local manifest URL : ' + this.manifestUrl);
        this._am = new jsb.AssetsManager(this.manifestUrl, storagePath);
        this._am.retain();

        this._needUpdate = false;
        if (this._am.getLocalManifest().isLoaded()) {
            this._checkListener = new jsb.EventListenerAssetsManager(this._am, this.checkCb.bind(this));
            cc.eventManager.addListener(this._checkListener, 1);

            this._am.checkUpdate();
        }
    },

    // use this for initialization
    onLoad: function() {},

    onDestroy: function() {
        this._am && this._am.release();
    }
});
