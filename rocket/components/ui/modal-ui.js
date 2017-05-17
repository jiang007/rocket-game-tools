/**
 * 模态UI
 */
cc.Class({
    extends: cc.Component,

    properties: {
        mask: cc.Node
    },

   onEnable: function () {
        this.mask.active = true;
        this.mask.on('touchstart', this.stopPropagation, this, true);
        this.mask.on('touchend', this.stopPropagation, this, true);
    },

    onDisable: function () {
        this.mask.active = false;
        this.mask.off('touchstart', this.stopPropagation, this, true);
        this.mask.off('touchend', this.stopPropagation, this, true);
    },

    stopPropagation(event) {
        event.stopPropagation();
    }
});
