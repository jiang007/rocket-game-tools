/**
 * 微信分享面板
 */
cc.Class({
    extends: require('panel'),

    properties: {
    },

    onShareToFriend(event) {
        this._emitEvent(0);
    },

    onShareToTimeline(event) {
        this._emitEvent(1);
    },

    _emitEvent(scene) {
        this.node.emit('share', { type: 'text', scene: scene });
    }
});
