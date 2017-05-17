/**
 * 场景
 */
cc.Class({
    extends: cc.Component,

    properties: {
        viewLayer: {
            get: function () {
                if (!this._viewLayer) {
                    this._viewLayer = cc.find('Canvas/viewLayer');
                }
                return this._viewLayer;
            },
            visible: false,
        },

        panelLayer: {
            get: function () {
                if (!this._panelLayer) {
                    this._panelLayer = cc.find('Canvas/panelLayer');
                }
                return this._panelLayer;
            },
            visible: false,
        },

        alertLayer: {
            get: function () {
                if (!this._alertLayer) {
                    this._alertLayer = cc.find('Canvas/alertLayer');
                }
                return this._alertLayer;
            },
            visible: false,
        },

        alertPrefab: cc.Prefab,

        previousScene: {
            default: '',
            tooltip: '上一个跳转场景'
        },

        nextScene: {
            default: '',
            tooltip: '下一个跳转场景'
        }
    },

    onLoad: function () {
        //设置适配策略
        cc.view.setDesignResolutionSize(this.node.width, this.node.height, cc.ResolutionPolicy.EXACT_FIT);
    },

    /**
     * 创建系统提示框
     * @param  {string} msg                 提示内容
     * @param  {boolean} isModal            设置模态
     * @param  {function} confirmFunc       确定按钮回调
     * @param  {function} closeFunc         关闭按钮回调
     * @param  {boolean} isConfirmOnly      是否只显示确定按钮
     * @param  {string} tag                 标识
     */
    createAlert: function (msg, isModal, confirmFunc, closeFunc, isConfirmOnly, tag) {
        if (!this.alertLayer.parent) return;

        let self = this,
            panel = null;

        if (self.alertPool && self.alertPool.size() > 0) {
            panel = self.alertPool.get();
        } else {
            self.alertPool = new cc.NodePool();
            panel = cc.instantiate(this.alertPrefab);
        }

        let closeCall = () => {
            if (closeFunc) {
                closeFunc()
            }
            self.removeAlert(tag);
        }
        panel.getComponent('alert-panel').create(this.alertLayer, isModal, closeCall, tag)
            .init(msg, confirmFunc, isConfirmOnly);
    },

    createAlertWithDelay(delay, msg, isModal, confirmFunc, closeFunc, isConfirmOnly, tag) {
        this.createAlert(msg, isModal, confirmFunc, closeFunc, isConfirmOnly, tag);
        setTimeout((alertTag) => {
            this.removeAlert(alertTag);
        }, delay, tag);
    },

    /**
     * 移除系统提示框
     * @param  {string} tag             提示框标识
     * @param  {boolean} cleanup=false  是否销毁
     */
    removeAlert: function (tag, cleanup = false) {
        let panel = this.alertLayer.getChildByTag(tag);
        if (panel) {
            this.alertPool.put(panel.removeFromParent(cleanup));
        }
    },

    removeAllAlert() {
        for (let i = this.alertLayer.children.length - 1; i >= 0; i--) {
            this.alertPool.put(this.alertLayer.children[i].removeFromParent());
        }
    },

    /**
     * 弹框
     * @param  {SSPane} win             弹框
     * @param  {string} script          弹框的脚本组件
     * @param  {function} closeFunc     关闭弹框回调
     * @param  {string} tag             标识
     */
    popupWindow: function (win, script, closeFunc, tag) {
        if (win) {
            win.getComponent(script).create(this.panelLayer, true, closeFunc, tag || script);
        }
    },

    /**
     * 关闭弹框
     * @param  {rocket-panel} win     弹框
     * @param  {string} script   弹框脚本
     */
    closeWindow: function (win, script) {
        if (win) {
            win.getComponent(script).onClose(null);
        }
    },

    /**
     * 通过标识关闭弹框
     * @param  {string} tag     标识 
     * @param  {string} script  弹框脚本
     */
    closeWindowByTag: function (tag, script) {
        this.closeWindow(this.panelLayer.getChildByTag(tag), script);
    },

    /**
     * 关闭全部弹框
     */
    clearPopupWindow() {
        this.panelLayer.removeAllChildren();
    },

    /**
     * 设置loading动画显示
     * @param  {boolean} isActive
     */
    setLoadingActive(isActive) {
        let loading = cc.find('Canvas/loadingLayer');
        if (loading) {
            let com = loading.getComponent('modal-ui');
            if (isActive) {
                com.onEnable();
            } else {
                com.onDisable();
            }
            loading.active = isActive;
        }
    }
});