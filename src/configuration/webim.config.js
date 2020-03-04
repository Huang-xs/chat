// WebIM的配置
// function getUrl() {
//     var apiUrl = (window.location.protocol === "https:" ? "https:" : "http:") + "//a1-hsb.easemob.com"
//     var xmppUrl = "im-api.easemob.com"
//     if (window.location.href.indexOf("webim-h5.easemob.com") !== -1 || window.location.href.indexOf("localhost") !== -1 || window.location.href.indexOf("172.17.2.168") !== -1) {
//         apiUrl = (window.location.protocol === "https:" ? "https:" : "http:") + "//a1-hsb-ly.easemob.com"
//         xmppUrl = "im-api.easemob.com"
//     } else if (window.location.href.indexOf("webim-hsb.easemob.com") !== -1) {
//         apiUrl = (window.location.protocol === "https:" ? "https:" : "http:") + "//a1-hsb.easemob.com"
//         xmppUrl = "im-api-hsb.easemob.com"
//     }
//     return {
//         apiUrl: apiUrl,
//         xmppUrl: xmppUrl
//     }
// }



const config = {
        xmppURL: 'im-api.easemob.com', // xmpp Server地址，对于在console.easemob.com创建的appKey，固定为该值

        apiURL: 'http://a1.easemob.com', // rest Server地址，对于在console.easemob.com创建的appkey，固定为该值

        appkey: '1164190806047596#chat-room1', // App key

        https: false, // 是否使用https

        isHttpDNS: true, //防止DNS劫持从服务端获取XMPPUrl、restUrl

        isMultiLoginSessions: false, // 是否开启多页面同步收消息，注意，需要先联系商务开通此功能

        isAutoLogin: true, // 自动出席，（如设置为false，则表示离线，无法收消息，需要在登录成功后手动调用conn.setPresence()才可以收消息）

        isDebug: false, // 打开调试，会自动打印log，在控制台的console中查看log

        autoReconnectNumMax: 2, // 断线重连最大次数

        autoReconnectInterval: 2, // 断线重连时间间隔

        heartBeatWait: 4500, // 使用webrtc（视频聊天）时发送心跳包的时间间隔，单位ms

        delivery: true, // 是否发送已读回执
    }
    // 将配置文件公开出去
export default config;