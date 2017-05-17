var PingVO = cc.Class({
    name: 'PingVO',
    properties: {
        delay: {
            default: 8,
            tooltip: '延迟间隔'
        },
        timeoutMax: {
            default: 3,
            tooltip: '最大超时次数'
        },
        cmd: {
            default: '101',
            tooltip: '指令'
        },
    }
});

module.exports = {
    PingVO,
}