//运行环境
var RunEnv = cc.Enum({
    LOCAL_HOST: 0,      //本地
    TEST: 1,            //内测
    RELEASE: 2,         //正式
});


module.exports = {
    RunEnv,
}