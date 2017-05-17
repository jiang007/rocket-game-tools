cc.Class({
    extends: cc.Component,

    properties: {
        roomNOLbl: cc.Label,
        timeLbl: cc.Label,
        container: cc.Node,
        scrollView: cc.ScrollView,

        renderPrefab: cc.Prefab,

        _renderPool: null,
    },

    onLoad: function () {
        this._renderPool = new cc.NodePool();
    },

    setContent(round, time, detail) {
        this.reset();
        this.roomNOLbl.string = round;
        this.timeLbl.string = time;

        if (detail) {
            detail.sort((a, b) => a.gameCount > b.gameCount);
            for (let i = 0; i < detail.length; i++) {
                let render = this._renderPool.get();
                if (!render) {
                    render = cc.instantiate(this.renderPrefab);
                }
                render.parent = this.container;
                render.getComponent('record-detail-render').setContent(detail[i]);
            }
        }

        this.scrollView.scrollToTop(0);
    },

    reset() {
        for (let i = this.container.children.length - 1; i >= 0; i--) {
            this._renderPool.put(this.container.children[i].removeFromParent());
        }
    },
});
