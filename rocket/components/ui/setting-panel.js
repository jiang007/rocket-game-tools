/**
 * 设置面板
 */
cc.Class({
    extends: require('panel'),

    properties: {
        bgmToggle: cc.Toggle,
        effectToggle: cc.Toggle,
    },

    /**
     * 设置开关
     * @param  {Boolean} isMusicOn      背景音效
     * @param  {Boolean} isEffectOn     特效音效
     */
    setState(isMusicOn, isEffectOn) {
        this.bgmToggle.isChecked = isMusicOn;
        this.effectToggle.isChecked = isEffectOn;

        this._updateEffectToggle();
        this._updateBgmToggle();
    },

    getState() {
        return { bgm: this.bgmToggle.isChecked, sfx: this.effectToggle.isChecked };
    },

    changeMusicState(event) {
        this.node.emit('musicStateChanged', { isOn: this.bgmToggle.isChecked });
        this._updateBgmToggle();
    },

    changeEffectState(event) {
        this.node.emit('effectStateChanged', { isOn: this.effectToggle.isChecked });
        this._updateEffectToggle();
    },

    _updateEffectToggle() {
        this.effectToggle.node.getChildByName('Background').active = !this.effectToggle.isChecked;
        this.effectToggle.node.getChildByName('checkmark').active = this.effectToggle.isChecked;
    },

    _updateBgmToggle() {
        this.bgmToggle.node.getChildByName('Background').active = !this.bgmToggle.isChecked;
        this.bgmToggle.node.getChildByName('checkmark').active = this.bgmToggle.isChecked;
    }
});
