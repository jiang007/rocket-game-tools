/**
 * 全局事件处理
 */
var SSNotification = function() {};

SSNotification._instance = null;
SSNotification.getInstance = function() {
    if (!SSNotification._instance) {
        SSNotification._instance = new SSNotification();
    }
    return SSNotification._instance;
}

cc.js.mixin(SSNotification.prototype, {
    _handles: {},

    //发送事件
    emit: function(eventName, data) {
        var returns = [] //返回值

        data.eventName = eventName //保存一下事件名字

        for (var findEvenName in this._handles) {
            if (findEvenName == eventName) {
                for (var i = 0; i < this._handles[findEvenName].length; i++) {
                    var returnValue = this._handles[findEvenName][i](data)
                    returns.push(returnValue)
                }
            }
        }

        return returns
    },

    //添加普通事件
    on: function(eventName, callback, target) {
        // console.log('收到事件', eventName);
        this._handles[eventName] = this._handles[eventName] || []

        this._handles[eventName].push(callback.bind(target))
    },

    //通过事件名和target移除一个监听器
    off: function(eventName) {
        for (var i = 0; i < this._handles[eventName].length; i++) {
            this._handles[eventName][i] = null
        }
    },
});

module.exports = SSNotification;
