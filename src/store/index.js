import Vue from 'vue';
import Vuex from 'vuex';
import getters from "./getters"
import mutations from "./mutations";
import actions from "./actions";

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        key: "069e90c4262243bf964ad95014371384", // 图灵机器人秘钥
        isLogin: false, //判断当前是否登录
        token: "", //用于判断,
        currentUser: "",
        getFriendList: [], //获取好友列表
        isShowAdd: false, //是否显示添加好友界面
        isShowApplyMsg: false, //是否显示好友申请界面
        addUserName: "", //是否添加为好友
        passUserName: "", //通过申请的好友（即被申请者）
        messageList: [], //好友消息

        // 聊天室列表
        chatRoomList: [],
        groupList: [],

        // 对应群的好友加群申请列表
        teamMenberApplyList: {}
    },
    mutations,
    getters,
    actions
})