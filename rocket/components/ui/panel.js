/**
 * 弹框面板
 */
cc.Class({
    extends: require('modal-ui'),

    properties: {
        closeBtn: cc.Button,
        panel: cc.Node,
    },

    onLoad() {
    },

    /**
     * 创建面板
     * @param  {cc.Node} target                 面板的容器
     * @param  {boolean} isModal=true           模态UI
     * @param  {function} closeCallback=null    关闭面板执行的回调
     * @param  {string} tag=null                标签
     */
    create(target, isModal = true, closeCallback = null, tag = null) {
        let self = this;
        self.closeCall = closeCallback;
        if (self.closeBtn) {
            self.closeBtn.active = closeCallback !== null;
        }

        if (!tag) {
            target.addChild(self.node);
        } else {
            target.addChild(self.node, 0, tag);
        }

        if (!isModal) {
            self.onDisable();
        } else {
            self.onEnable();
        }

        if (self.panel) {
            self.panel.active = false;
            self._show();
        }

        return self;
    },

    onClose(evt, isForce = false) {
        if (this.closeCall) {
            this.closeCall();
        }

        if (isForce || !this.panel) {
            this.destroy(false);
        } else {
            this._hide();
        }
    },

    destroy(isCleanup) {
        this.node.removeFromParent(isCleanup);
    },

    _show() {
        let action = cc.scaleTo(0.2, 1);
        this.panel.scale = 0.8
        this.panel.active = true;
        this.panel.runAction(action.easing(cc.easeBackOut()));
    },

    _hide() {
        let action = cc.scaleTo(0.2, 0.8);
        this.panel.runAction(cc.sequence(action.easing(cc.easeBackIn()), cc.callFunc(() => {
            this.panel.sacle = 1;
            this.destroy(false);
        }, this)));
    }
});
