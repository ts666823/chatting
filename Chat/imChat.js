import NIM from 'SDK/NIM_WEB_SDK/NIM_Web_NIM_v8.9.0'
var data = {};
// 注意这里, 当引入的SDK文件是NIM_Web_NIM_v.js时，请通过 NIM.getInstance 来初始化；当引入的SDK文件为NIM_Web_SDK_v时，请使用 SDK.NIM.getInstance 来初始化。SDK文件的选择请参见集成方式。
var nim = NIM.getInstance({
    debug: true,   // 是否开启日志，将其打印到console。集成开发阶段建议打开。
    appKey: 'cc0b4637976cccd5cb54c95758007141',
    account: '232003609854021',
    token: 'token',
    db:false, //若不要开启数据库请设置false。SDK默认为true。
    onconnect: onConnect,
    onwillreconnect: onWillReconnect,
    ondisconnect: onDisconnect,
    onerror: onError
});
function onConnect() {
    console.log('连接成功');
}
function onWillReconnect(obj) {
    // 此时说明 SDK 已经断开连接, 请开发者在界面上提示用户连接已断开, 而且正在重新建立连接
    console.log('即将重连');
    console.log(obj.retryCount);
    console.log(obj.duration);
}
function onDisconnect(error) {
    // 此时说明 SDK 处于断开状态, 开发者此时应该根据错误码提示相应的错误信息, 并且跳转到登录页面
    console.log('丢失连接');
    console.log(error);
    if (error) {
        switch (error.code) {
            // 账号或者密码错误, 请跳转到登录页面并提示错误
            case 302:
                break;
            // 重复登录, 已经在其它端登录了, 请跳转到登录页面并提示错误
            case 417:
                break;
            // 被踢, 请提示错误后跳转到登录页面
            case 'kicked':
                break;
            default:
                break;
        }
    }
}
function onError(error) {
    console.log(error);
}



