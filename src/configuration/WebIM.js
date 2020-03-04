// 引入配置文件
import config from "./webim.config";
import Vue from "vue";
import websdk from "easemob-websdk";
import store from "../store"
import * as mutationType from "../store/mutations-type";
import Axios from "axios";
// import Axios from "axios";

// import {mapState} from "vuex";
// 创建连接
// 考虑兼容性的问题，将之前的conn={}改成WebIM = {}
var WebIM = {};
WebIM = window.WebIM = websdk;
WebIM.config = config;
WebIM.conn = new WebIM.connection({
    appKey: WebIM.config.appkey,
    isHttpDNS: WebIM.config.isHttpDNS,
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    https: WebIM.config.https,
    url: WebIM.config.xmppURL,
    apiUrl: WebIM.config.apiURL,
    isAutoLogin: WebIM.config.isAutoLogin,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    autoReconnectInterval: WebIM.config.autoReconnectInterval,
    isStropheLog: WebIM.config.isStropheLog,
    delivery: WebIM.config.delivery
})

// 注册监听回调
WebIM.conn.listen({
    //连接成功回调
    onOpened: function() {
        // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
        // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
        // 则无需调用conn.setPresence();     
        // 获取好友列表
        WebIM.conn.getRoster({
            success: roster => {
                let friendList = roster.filter(function(val) {
                    return val.subscription === 'both' || val.subscription === 'to'
                })


                // 获取好友列表
                store.commit(mutationType.GET_FRIEND_LIST, friendList);
                //  将好友用户ID添加到聊天消息的数组中
                store.commit(mutationType.SET_MESSAGE_OF_USER_ID, friendList);
            },
            error: function(error) {
                throw error;
            }
        });

        WebIM.conn.getGroup({
            success: function(resp) {
                let arr = [];
                for (var i = 0; i < resp.data.length; i++) {
                    WebIM.conn.getGroupInfo({
                        groupId: resp.data[i].groupid, //群组id
                        success: function(resp) {
                            arr.push(resp)
                        }
                    });
                }
                store.commit(mutationType.GET_TEAM_GROUP, arr);
            }
        })

        // 获取聊天室列表
        WebIM.conn.getChatRooms({
            apiUrl: 'https://a1.easemob.com',
            pagenum: 1, // 页数
            pagesize: 20, // 每页个数
            success: function(list) {
                store.commit(mutationType.GET_CHATROOM_LIST, list.data);
                store.commit(mutationType.SET_MESSAGE_OF_USER_ID, list.data);
            }
        })
    },
    //连接关闭回调
    onClosed: () => {
        confirm("确认退出？")
    },
    //收到文本消息
    onTextMessage: async message => {
        if (message.to !== "99061941207041") {
            store.commit(mutationType.UPDATE_MESSAGE, {
                to: message.to,
                from: message.from,
                sendmessage: message.data,
                bySelf: false,
                read: false
            });
            Vue.prototype.clickButton();

        } else {
            let data = await Axios.post("/robot", {
                info: message.data,
                key: store.state.key,
            });

            store.commit(mutationType.UPDATE_MESSAGE, {
                // to: message.to,
                from: "机器人聊天室",
                sendmessage: data.data.text,
                bySelf: false,
                // read: false
            });
        }
        // 判断当前是接收方还是发送方
    },
    onEmojiMessage: function(message) {
        store.commit(mutationType.UPDATE_MESSAGE, {
            to: message.to,
            from: message.from,
            sendmessage: message.data,
            bySelf: false,
            read: false
        });
        Vue.prototype.clickButton();

    }, //收到表情消息
    // onPictureMessage: function(message) {  }, //收到图片消息
    // onCmdMessage: function(message) {  }, //收到命令消息
    // onAudioMessage: function(message) {  }, //收到音频消息
    // onLocationMessage: function(message) {  }, //收到位置消息
    // onFileMessage: function(message) {  }, //收到文件消息
    // onVideoMessage: function(message) {
    //     var node = document.getElementById('privateVideo');
    //     var option = {
    //         url: message.url,
    //         headers: {
    //             'Accept': 'audio/mp4'
    //         },
    //         onFileDownloadComplete: function(response) {
    //             var objectURL = WebIM.utils.parseDownloadResponse.call(WebIM.conn, response);
    //             node.src = objectURL;
    //         },
    //         onFileDownloadError: function() {
    //         }
    //     };
    //     WebIM.utils.download.call(WebIM.conn, option);
    // }, //收到视频消息
    onPresence: function(e) {

        if (e.type === 'subscribe') {

            /*同意添加好友操作的实现方法*/
            if (!store.state.isShowApplyMsg) {
                store.commit(mutationType.SHOW_APPLY, true);
                store.commit(mutationType.GET_FRIEND_NAME, e.from)
                store.commit(mutationType.SET_PASS_USERNAME, e.to)
            }

        } else if (e.type === 'subscribed') {

            WebIM.conn.getRoster({
                success: roster => {
                    store.commit(mutationType.GET_FRIEND_LIST,
                        roster.filter(function(val) {
                            return val.subscription === 'both' || val.subscription === 'to'
                        })
                    );
                }
            });
        } else if (e.type === "joinGroupNotifications") {
            e["isJoin"] = false;
            store.commit(mutationType.ADD_TEAM_APPLY_LIST, { id: e.gid, applyinfo: e })
        } else if (e.type === "joinPublicGroupSuccess" || e.type === "memberJoinPublicGroupSuccess") {
            WebIM.conn.getGroup({
                success: function(resp) {
                    let arr = [];
                    for (var i = 0; i < resp.data.length; i++) {
                        WebIM.conn.getGroupInfo({
                            groupId: resp.data[i].groupid, //群组id
                            success: function(resp) {
                                arr.push(resp)
                            }
                        })
                    }
                    store.commit(mutationType.GET_TEAM_GROUP, arr);
                }
            })
        }
    }, //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息

    onError: function(message) {
        alert("登录失败", message)
    }, //失败回调
    // onRoster: function(message) {}, //处理好友申请
    // onInviteMessage: function(message) {}, //处理群组邀请
    // onOnline: function() {}, //本机网络连接成功
    // onOffline: function() {}, //本机网络掉线
    // onBlacklistUpdate: function(list) { //黑名单变动
    //     // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
    // },
    // onReceivedMessage: function(message) {}, //收到消息送达服务器回执
    // onDeliveredMessage: function(message) {}, //收到消息送达客户端回执
    // onReadMessage: function(message) {}, //收到消息已读回执
    // onCreateGroup: function(message) {}, //创建群组成功回执（需调用createGroupNew）
    // onMutedMessage: function(message) {} //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
});

// 将配置公开出去
export default WebIM;