/**
 * 系统提示框，【确定】 【取消】
 */
cc.Class({
    extends: require('panel'),

    properties: {
        contentLbl: cc.Label,
        confirmBtn: cc.Button,
        cancelBtn: cc.Button,

        confirmCallback: {
            default: null,
            visible: false
        }
    },

    init(message, confirmCallback, isConfirmOnly) {
        let self = this;
        self.contentLbl.string = message;

        if (!confirmCallback) {
            self.confirmBtn.node.active = false;
            self.cancelBtn.node.active = false;
        } else {
            self.confirmCallback = confirmCallback;
            self.confirmBtn.node.on(cc.Node.EventType.TOUCH_END, self.onConfirm, self);
            self.cancelBtn.node.on(cc.Node.EventType.TOUCH_END, self.onClose, self);
        }

        if (isConfirmOnly) {
            self.cancelBtn.node.active = false;
            self.closeBtn.node.active = false;
            self.confirmBtn.node.x = 0;
        }
    },

    onConfirm(event) {
        this.confirmCallback();
        this.destroy();
    },
});
