import * as mutationtypes from "./mutations-type";

export default {
    [mutationtypes.TO_LOGIN](state, obj) {
        state.isLogin = obj.isLogin;
        state.currentUser = obj.userName;
    },
    [mutationtypes.GET_FRIEND_LIST](state, roster) {

        state.getFriendList = roster;
    },
    [mutationtypes.SHOW_ADD](state, isShow) {
        state.isShowAdd = isShow; //显示添加好友界面
    },
    [mutationtypes.SHOW_APPLY](state, isShowApply) {
        state.isShowApplyMsg = isShowApply;
    },
    [mutationtypes.GET_FRIEND_NAME](state, name) {
        state.addUserName = name;
    },
    [mutationtypes.SET_PASS_USERNAME](state, name) {
        state.passUserName = name;
    },
    // 为聊天消息的数组添加聊天的用户id
    [mutationtypes.SET_MESSAGE_OF_USER_ID](state, userId) {
        userId.forEach(val => {
            state.messageList.push({ _userid: val.name, chat_msg: [] });
        })
    },
    [mutationtypes.UPDATE_MESSAGE](state, updateMsg) {
        state.messageList.forEach((val, index) => {
            if (val._userid == updateMsg.from) {
                state.messageList[index].chat_msg.push(updateMsg)
            }
        })
    },
    // 获取聊天室列表
    [mutationtypes.GET_CHATROOM_LIST](state, chatRoomObj) {
        state.chatRoomList = chatRoomObj;
    },
    [mutationtypes.GET_TEAM_GROUP](state, teamList) {
        if (Object.prototype.toString.call(teamList) == "[object Array]") {
            state.groupList = teamList;
        } else {
            state.groupList.push(teamList);
        }
    },
    [mutationtypes.ADD_TEAM_APPLY_LIST](state, obj) {
        if (!(state.teamMenberApplyList.hasOwnProperty(obj.id))) {
            state.teamMenberApplyList[obj.id] = [];
        }
        state.teamMenberApplyList[obj.id].push(obj.applyinfo);
    },
    [mutationtypes.CHANGE_APPLY_PAST](state, obj) {
        state.teamMenberApplyList[obj.id].map(function(value, index) {
            if (index == obj.index) {
                value.isJoin = true;
            }
        })
    }
}