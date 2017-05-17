cc.Class({
    extends: cc.Component,

    properties: {
        popupContainer: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
    },

    setPopupContainer(layer) {
        this.popupContainer = layer;
    },

    getPopupContainer() {
        if (!this.popupContainer) {
            this.popupContainer = this.node;
        }
        return this.popupContainer;
    },

    popupWindow: function (win, script, closeFunc, tag) {
        if (win) {
            win.getComponent(script).create(this.getPopupContainer(), true, closeFunc, tag || script);
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
});
