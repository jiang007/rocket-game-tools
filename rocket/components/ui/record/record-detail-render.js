cc.Class({
    extends: cc.Component,

    properties: {
        roundNOLbl: cc.Label,
        players: cc.Node,

        _data: null,
    },

    onLoad: function () {
        this.reset();
    },

    reset() {
        this.roundNOLbl.string = '';
        for (let i = 0; i < 4; i++) {
            this.players.getChildByName(`p${i}-nickName`).getComponent(cc.Label).string = '';
            this.players.getChildByName(`p${i}-gold`).getComponent(cc.Label).string = '';
        }
        this.node.off(cc.Node.EventType.TOUCH_END, this._onSelected, this);
    },

    setContent(detail, isInteractable = true) {
        this.reset();
        this._data = detail;
        this.roundNOLbl.string = detail.gameCount;
        for (let i = 0; i < detail.winInfos.length; i++) {
            this.players.getChildByName(`p${i}-nickName`).getComponent(cc.Label).string = detail.winInfos[i].nickName;
            this.players.getChildByName(`p${i}-gold`).getComponent(cc.Label).string = detail.winInfos[i].win;
        }

        if (isInteractable) {
            this.node.on(cc.Node.EventType.TOUCH_END, this._onSelected, this);
        }
    },

    _onSelected() {
        let evt = new cc.Event.EventCustom('replay', true);
        evt.detail = this._data;
        this.node.dispatchEvent(evt);
    },

});
