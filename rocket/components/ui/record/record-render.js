cc.Class({
    extends: cc.Component,

    properties: {
        noLbl: cc.Label,
        roundLbl: cc.Label,
        timeLbl: cc.Label,
        players: cc.Node,

        _record: null,
    },

    onLoad: function () {
        this.reset();
    },

    reset() {
        this.noLbl.string = '';
        this.roundLbl.string = '';
        this.timeLbl.string = '';
        for (let i = this.players.children.length - 1; i >= 0; i--) {
            this.players.children[i].getComponent(cc.Label).string = '';
        }
    },

    setContent(no, record) {
        if (this._record) {
            this.reset();
        }
        this._record = record;
        this.noLbl.string = String(no);
        this.roundLbl.string = '局号:' + record.roomNo;
        this.timeLbl.string = record.time;
        for (let i = 0; i < record.playerWinInfos.length; i++) {
            this.players.children[i].getComponent(cc.Label).string = record.playerWinInfos[i].nickName + ':' + record.playerWinInfos[i].totalWin;
        }
    },

    onDetail(event) {
        let evt = new cc.Event.EventCustom('record-detail', true);
        evt.detail = this._record;
        this.node.dispatchEvent(evt)
    }

});
