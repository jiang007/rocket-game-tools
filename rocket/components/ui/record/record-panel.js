const AudioCtrl = require('audio-ctrl');

cc.Class({
    extends: require('panel'),

    properties: {
        renderPrefab: cc.Prefab,
        scrollView: cc.ScrollView,
        container: cc.Node,
        listView: cc.Node,
        detailView: cc.Node,

        _renderPool: cc.NodePool,
    },

    onLoad: function () {
        this._renderPool = new cc.NodePool();
    },

    playBtnAudio() {
        // AudioCtrl.getInstance().playSFX(cc.url.raw('resources/audio/button.mp3'));
    },

    reset() {
        for (let i = this.container.children.length - 1; i >= 0; i--) {
            let renderItem = this.container.children[i];
            renderItem.getComponent('record-render').reset();
            this._renderPool.put(renderItem.removeFromParent());
        }
    },

    setContent(records) {
        this.reset();

        if (records) {
            let recordCount = records.length;
            for (let i = 0; i < recordCount; i++) {
                let renderItem = this._getRender();
                renderItem.parent = this.container;
                renderItem.getComponent('record-render').setContent(i + 1, records[i]);
            }
        }
        this.node.on('record-detail', this._showDetail, this);
        this.scrollView.scrollToTop(0);
    },

    _getRender() {
        let renderItem = null;
        if (this._renderPool.size() > 0) {
            renderItem = this._renderPool.get();
        } else {
            renderItem = cc.instantiate(this.renderPrefab);
        }
        return renderItem;
    },

    _showDetail(event) {
        this.playBtnAudio();
        this.listView.active = false;
        this.detailView.active = true;

        let record = event.detail;
        this.detailView.getComponent('record-detail-view').setContent(record.roomNo, record.time, record.allGameCount);
    },

    onCloseDetail() {
        this.playBtnAudio();
        this.listView.active = true;
        this.detailView.active = false;
    },
});
