cc.Class({
    extends: cc.Component,

    properties: {
        bgNode: cc.Node,
        contentLbl: cc.Label,
    },

    onLoad: function () {
    },

    setContent(content) {
        this.contentLbl.string = content||'';
        this.bgNode.width = this.contentLbl.node.width + 80;
        this.bgNode.height = this.contentLbl.node.height + 40;
    },

});