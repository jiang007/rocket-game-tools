/**
 * 跑马灯
 */
cc.Class({
    extends: cc.Component,

    properties: {
        bgSp: cc.Node,
        contentLbl: cc.Label,
        speed: 20,  //移动速度
    },

    onLoad: function () {
        this.contentLbl.string = '';
    },

    setContent: function(value) {
        value = value || ''
        this.contentLbl.string = value.trim();
        this._resetContentPos();
    },

    play: function() {
        this.stop();
        if (this.contentLbl.string.length === 0) {
            return;
        }
        let contentW = this.contentLbl.node.width;
        let speed = Math.ceil(contentW / this.speed);
        let moveAction = cc.moveTo(speed, cc.p(-this.bgSp.width/2, 0));
        let placeAction = cc.place(cc.p(this.bgSp.width/2 + contentW, 0));
        this.contentLbl.node.runAction(cc.repeatForever(cc.sequence(moveAction, placeAction)));
    },

    stop: function() {
        this.contentLbl.node.stopAllActions();
        this._resetContentPos();
    },

    _resetContentPos: function() {
        this.contentLbl.node.setPositionX(this.bgSp.width/2 + this.contentLbl.node.width);
    }

});
