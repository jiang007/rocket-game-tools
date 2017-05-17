/**
 * 扑克牌
 */
cc.Class({
    extends: cc.Component,

    properties: {
        pokerSp: cc.Sprite,
        atlas: cc.SpriteAtlas,

        _poker: '',
        _bgFrame: cc.SpriteFrame,
        _pokerFrame: cc.SpriteFrame,
    },

    onLoad() {
    },

    /**
     * 设置扑克牌内容
     * @param  {int} poker
     */
    setData: function (poker) {
        this._poker = poker;
    },

    /**
     * 显示牌背还是牌面
     * @param  {boolean} isFaceUp 是否显示牌面
     */
    reveal: function (isFaceUp) {
        let frame = 'paibei'
        if (isFaceUp && this._poker) {
            frame = this._poker;
        }

        let source = cc.loader.getRes('texture/poker/' + frame);
        if (source) {
            this.pokerSp.spriteFrame = new cc.SpriteFrame(source);
            return;
        }

        cc.loader.loadRes('texture/poker/' + frame, (err, texture) => {
            if (!err) {
                this.pokerSp.spriteFrame = new cc.SpriteFrame(texture);
            }
        })
    },
});
