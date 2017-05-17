
/**
 * SFSClient
 */
var SFS = function () {
    this._cmdHandles = null;
    this._pingTarget = null;
    this._room = null;
    this._sfs = null;
    this._pingTimeoutCount = 0;
    this._pingConfig = null;
    this.onLogin = null;
    this.onLoginTimeout = null;
    this.onConnectionLost = null;
    this.zone = null;
};

cc.js.mixin(SFS.prototype, {
    consturctor: SFS,

    /**
     * 初始化
     * @param  {[Object]} pingTarget        [schedule对象]
     * @param  {[Number]} pingDelay         [延迟间隔]
     * @param  {[Number]} pingTimeoutMax    [ping最大超时次数]
     * @param  {[String]} pingCmd           [指令]
     * @return
     */
    init: function (pingCfg, pingTarget) {
        this._pingConfig = pingCfg;
        this._pingTarget = pingTarget;
        this._cmdHandles = {};
        this._loginTimeout = -1;
    },

    /**
     * 连接服务器
     * @param  {[String]} loginName             [用户名]
     * @param  {[String]} loginParam            [参数]
     * @param  {[String]} address               [服务器ip]
     * @param  {[String]} serverZone            [域]
     * @param  {[Number]} socketType            [0：websocket 1：socket]
     * @param  {[Boolean]} [debug=false}={}]    [是否开启调试模式]
     * @return
     */
    connect: function (loginName, loginParam, address, serverZone, socketType = 0, debug = false, loginTimeout = 8000) {
        let self = this;
        self.zone = serverZone;
        self._sfs = new SFS2X.SmartFox({ debug: debug });
        self._sfs.addEventListener(SFS2X.SFSEvent.CONNECTION, function (event) {
            if (event.success) {
                self._loginTimeout = setTimeout(() => {
                    self.disconnect();
                    if (self.onLoginTimeout) {
                        self.onLoginTimeout();
                    }
                }, loginTimeout);
                var request = new SFS2X.Requests.System.LoginRequest(loginName, "", loginParam, serverZone);
                self._sfs.send(request);
            } else {
                self._onConnectionLost(null);
            }
        }, self);
        self._sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_LOST, self._onConnectionLost, self);
        self._sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_RETRY, self._onConnectionRetry, self);
        self._sfs.addEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, self._onConnectionResume, self);
        self._sfs.addEventListener(SFS2X.SFSEvent.LOGIN, self._onLogin, self);
        self._sfs.addEventListener(SFS2X.SFSEvent.LOGIN_ERROR, self._onLoginError, self);
        self._sfs.addEventListener(SFS2X.SFSEvent.ROOM_JOIN, self._onJoinRoom, self);
        self._sfs.addEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, self._onExtensionResponse, self);
        let addr = address.split(':');
        self._sfs.connect(addr[0], parseInt(addr[socketType + 1]));
    },

    disconnect: function () {
        let self = this;
        self._stopPingSchedule();
        if (self._sfs) {
            self._sfs.removeEventListener(SFS2X.SFSEvent.CONNECTION_LOST, self._onConnectionLost);
            self._sfs.removeEventListener(SFS2X.SFSEvent.CONNECTION_RETRY, self._onConnectionRetry);
            self._sfs.removeEventListener(SFS2X.SFSEvent.CONNECTION_RESUME, self._onConnectionResume);
            self._sfs.removeEventListener(SFS2X.SFSEvent.LOGIN, self._onLogin);
            self._sfs.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, self._onLoginError);
            self._sfs.removeEventListener(SFS2X.SFSEvent.ROOM_JOIN, self._onJoinRoom);
            self._sfs.removeEventListener(SFS2X.SFSEvent.EXTENSION_RESPONSE, self._onExtensionResponse);

            if (self._sfs.isConnected) {
                self._sfs.disconnect();
            }
            this._sfs = null;
        }

        self._room = null;
        self._cmdHandlers = {};
        self._pingTimeoutCount = 0;
    },

    destroy: function () {
        this.disconnect();
        this._cmdHandles = null;
        this._pingTarget = null;
        this._pingConfig = null;
        this.zone = null;
        this.onLogin = null;
        this.onConnectionLost = null;
    },

    _onConnectionLost: function (event) {
        cc.log(this.zone + '>>>>>>>>>> lost | param: ', event);

        this._stopPingSchedule();
        if (this.onConnectionLost) {
            this.onConnectionLost();
        }
    },

    _onConnectionRetry: function (event) {
        cc.log('connection retry...');
    },

    _onConnectionResume: function (event) {
        cc.log('connection resume...');
    },

    _onLogin: function (event) {
        let self = this;
        if (self._loginTimeout != -1) {
            clearTimeout(self._loginTimeout);
        }
        if (self.onLogin) {
            self.onLogin(true, event.data);
        }
        self._sfs.removeEventListener(SFS2X.SFSEvent.LOGIN, self._onLogin);
        self._sfs.removeEventListener(SFS2X.SFSEvent.LOGIN_ERROR, self._onLoginError);
        self._startPingSchedule();
    },

    _onLoginError: function (event) {
        if (this._loginTimeout != -1) {
            clearTimeout(this._loginTimeout);
        }
        if (this.onLogin) {
            this.onLogin(false, { error: event.errorMessage });
        }
        this.disconnect();
        this._stopPingSchedule();
    },

    _onJoinRoom: function (event) {
        this._room = event.room;
    },

    _onExtensionResponse: function (event) {
        let cmd = event.cmd;
        if (this._cmdHandles.hasOwnProperty(cmd)) {
            this._cmdHandles[cmd].handler.call(this._cmdHandles[cmd].target, event.params);
        }
    },

    isConnected: function () {
        return this._sfs && this._sfs.isConnected();
    },

    /**
     * 发送指令
     * @param  {[string]}  cmd                [指令]
     * @param  {[Object]}  param              [参数]
     * @param  {Boolean} [isInRoom=false}={}] [是否发送到房间Ext]
     * @return
     */
    send: function (cmd, param, isInRoom) {
        let self = this;
        if (self.isConnected()) {
            self._sfs.send(new SFS2X.Requests.System.ExtensionRequest(cmd, param, !isInRoom ? null : self._room));
        }
    },

    /**
     * 注册指令
     * @param  {[string]}    message [指令]
     * @param  {[function]}  handler [处理函数]
     * @param  {[object]}    target  [scope]
     * @return
     */
    registerCommand: function (cmd, handler, target) {
        this._cmdHandles[cmd] = { handler: handler, target: target };
    },

    /**
     * 解除注册指令
     * @param  {[string]} cmd [指令]
     * @return
     */
    unregisterCommand: function (cmd) {
        if (this.hasCommand(cmd)) {
            delete this._cmdHandles[cmd];
        }
    },

    hasCommand(cmd) {
        return this._cmdHandles && this._cmdHandles.hasOwnProperty(cmd);
    },

    clearAllCmd: function () {
        this._cmdHandles = {};
    },

    /**
     * 心跳检测
     */
    _startPingSchedule: function () {
        let self = this;
        self._pingTimeoutCount = 0;
        self.registerCommand(self._pingConfig.cmd, self._pong, self);
        self._pingTarget.schedule(self._ping.bind(self), self._pingConfig.delay, cc.macro.REPEAT_FOREVER);
    },

    _stopPingSchedule: function () {
        if (this._pingTarget) {
            this._pingTarget.unscheduleAllCallbacks();
        }
    },

    _ping: function () {
        cc.log(this.zone + '--------------------------------> ping')

        let self = this;
        if (++self._pingTimeoutCount > self._pingConfig.timeoutMax) {
            cc.log(self.zone + '-------------------------->ping timeout')
            self._onConnectionLost(null);
            self.disconnect();
        } else {
            self.send(self._pingConfig.cmd);
        }
    },

    _pong: function (data) {
        this._pingTimeoutCount = 0;
    },
});

module.exports = SFS;
