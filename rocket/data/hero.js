var Hero = cc.Class({
    name: 'Hero',
    properties: {
        uid: NaN,
        sex: 1,
        account: null,
        nickName: null,
        roomCard: NaN,
        headImg: null,
        ipAdd: null,
        playing: null,
    },
    statics: {
        instance: null,

        getInstance() {
            return this.instance || new Hero();
        }
    },
    ctor() {
        Hero.instance = this;
        this.playing = {};
    },

    getAccount() {
        if (!this.account) {
            this.account = cc.sys.localStorage.getItem('account');
        }
        return this.account;
    },

    saveAccount(account) {
        this.account = account;
        cc.sys.localStorage.setItem('account', account);
    },

    saveUUID(uuid) {
        cc.sys.localStorage.setItem('uuid', uuid);
    },

    getUUID() {
        return cc.sys.localStorage.getItem('uuid');
    }
})

module.exports = Hero;