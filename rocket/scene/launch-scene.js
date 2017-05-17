cc.Class({
    extends: require('base-scene'),

    properties: {
        splashSp: cc.Sprite,
        splashFrames: [cc.SpriteFrame],

        animate: cc.Animation,
        clipURL: '',
    },

    onLoad() {
        this._super();

        if ('true' == cc.sys.localStorage.getItem('hotUpdate')) {
            this.splashSp.spriteFrame = this.splashFrames[1];
            cc.sys.localStorage.setItem('hotUpdate', 'false');
            cc.director.loadScene(this.nextScene);
            return;
        }

        this.splashSp.spriteFrame = this.splashFrames[0];
        cc.loader.loadRes(this.clipURL, (err, anim) => {
            this.splashSp.node.active = false;
            if (!err) {
                this.animate.addClip(anim);
                this.animate.on('finished', () => {
                    cc.director.loadScene(this.nextScene);
                }, this);
                this.animate.play('launch');
            } else {
                this.onFinished(null);
            }
        });
    },
});

