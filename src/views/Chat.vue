<template>
  <div class="chat-page">
    <!-- 通过群聊的抽屉面板 -->
    <a-drawer
      :title="drawerTitle+'新朋友'"
      placement="left"
      :closable="false"
      @close="onClose"
      :visible="visible"
      width="300px"
    >
      <div class="friendList" ref="friendListScroll">
        <ul class="list">
          <li
            class="applyList"
            v-for="(value, index) in teamApplyUserList"
            :key="index"
            :class="{ active: currentIndex === index }"
          >
            <div class="applyItem">
              <div class="name">
                <span>{{ value.from }}请求加入群聊~~</span>
              </div>
            </div>
            <div class="applyItem">
              <a-button
                type="normal"
                size="small"
                @click="pastApply(value.from,value.gid,index)"
                :disabled="value.isJoin"
              >{{value.isJoin?"已通过":"通过"}}</a-button>
            </div>
          </li>
        </ul>
      </div>
    </a-drawer>

    <audio src id="buttonAudio"></audio>
    <div class="chat-header">
      <div class="title fl">乐聊天</div>
      <div class="login-user fr">
        <div class="user-header fl"></div>
        <div class="user-name fl">
          <div class="name">{{ this.$router.currentRoute.params.userName }}</div>
          <div class="nickName">昵称：{{ this.$router.currentRoute.params.userName }}</div>
        </div>
      </div>
    </div>

    <div class="chat-content">
      <!-- 侧边栏 -->
      <div class="item chat-aside">
        <!-- 添加好友 -->
        <div class="add-friend" @click="showAdd" title="添加好友">
          <a-icon type="user-add" />
        </div>
        <div class="add-friend" @click="showTeamAdd" title="创建群聊">
          <a-icon type="usergroup-add" />
        </div>
        <div class="out" @click="close">退出</div>
      </div>
      <!-- 聊天类型 -->
      <div class="item chat-type">
        <a-tabs defaultActiveKey="1">
          <a-tab-pane key="1">
            <span slot="tab" @click="changeType(0)">
              <a-icon type="user" />好友列表
            </span>
            <div class="friendList" ref="friendListScroll">
              <ul class="list">
                <li
                  class="friend"
                  v-for="(item, index) in getFriendList"
                  :key="index"
                  :class="{ active: currentIndex === index }"
                >
                  <!-- dot头像上的小红点 -->
                  <a-badge class="fl">
                    <a-avatar
                      class="avatar"
                      shape="square"
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    />
                  </a-badge>

                  <div class="friendMsg fl" @click="changeChatUser(item, index)">
                    <div class="name">
                      <span>{{ item.name }}</span>
                      <span class="message-time fr">22:00</span>
                    </div>
                    <div class="Msg" v-if="friendMsgList">
                      <div v-if="friendMsgList.chat_msg.length != 0">
                      {{friendMsgList.chat_msg[friendMsgList.chat_msg.length-1].sendmessage}}
                      </div>
                      <a-badge :numberStyle="{ backgroundColor: '#52c41a' }" class="fr" />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </a-tab-pane>
          <a-tab-pane key="2">
            <span slot="tab" @click="changeType(1)">
              <a-icon type="team" />群聊
            </span>

            <a-input-search placeholder="请输入群聊ID..." @search="toAdd" size="large">
              <a-button slot="enterButton">添加</a-button>
            </a-input-search>

            <div class="friendList" ref="friendListScroll">
              <ul class="list">
                <li
                  class="teamList"
                  v-for="(value, index) in groupList"
                  :key="index"
                  :class="{ active: currentIndex === index }"
                >
                  <!-- dot头像上的小红点 -->
                  <a-badge class="teamItem">
                    <a-avatar
                      class="avatar"
                      shape="square"
                      src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
                    />
                  </a-badge>

                  <div class="teamItem itemGrow" @click="changeChatUser(value, index)">
                    <div class="name">
                      <span>{{ value.data[0].name }}&nbsp;&nbsp;({{value.data[0].affiliations_count+"人"}})</span>
                    </div>
                    <div class="Msg">
                      描述：{{value.data[0].description}}
                      id：{{value.data[0].id}}
                      <a-badge :numberStyle="{ backgroundColor: '#52c41a' }" class="fr" />
                    </div>
                  </div>
                  <div class="teamItem" v-if="value.data[0].owner == currentUser">
                    <a-button
                      type="dashed"
                      shape="circle"
                      icon="user-add"
                      size="small"
                      @click="showDrawer(value.data[0].id,value.data[0].name)"
                    />
                  </div>
                </li>
              </ul>
            </div>
          </a-tab-pane>
          <a-tab-pane key="3">
            <span slot="tab" @click="changeType(2)">
              <span class="iconfont icon-icon"></span>
              聊天室
            </span>
            <div
              class="chat-room"
              v-for="(v,i) in chatRoomList"
              :key="i"
              @click="changeChatRoom(v.name,i)"
            >{{v.name}}</div>
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="item chat-Msg">
        <div id="components-layout-demo-basic">
          <a-layout v-if="userName!==''">
            <a-layout-header>{{ userName }}</a-layout-header>
            <a-layout-content v-show="chatType==0" id="chatRecord">
              <ul v-if="friendMsgList" class="Msglist">
                <li
                  class="chat-view"
                  v-for="(value, index) in friendMsgList.chat_msg"
                  :key="index"
                  :class="{ self: value.bySelf }"
                >
                  <img class="chat-avator auto-img" src="../assets/logo.png" />
                  <p
                    class="chat-bubble"
                    v-if="!Array.isArray(value.sendmessage)"
                  >{{ value.sendmessage }}</p>
                  <p class="chat-bubble" v-if="Array.isArray(value.sendmessage)">
                    <span v-for="(tv, ti) in value.sendmessage" :key="ti">
                      <span v-if="tv.type == 'txt'">{{ tv.data }}</span>
                      <img v-if="tv.type == 'emoji'" :src="`${publicPath}${tv.data}`" />
                    </span>
                  </p>
                </li>
              </ul>
            </a-layout-content>
            <a-layout-content v-show="chatType==1" id="chatRecord">
              <ul v-if="friendMsgList" class="Msglist">
                <li
                  class="chat-view"
                  v-for="(value, index) in friendMsgList.chat_msg"
                  :key="index"
                  :class="{ self: value.bySelf }"
                >
                  <img class="chat-avator auto-img" src="../assets/logo.png" />
                  <p
                    class="chat-bubble"
                    v-if="!Array.isArray(value.sendmessage)"
                  >{{ value.sendmessage }}</p>
                  <p class="chat-bubble" v-if="Array.isArray(value.sendmessage)">
                    <span v-for="(tv, ti) in value.sendmessage" :key="ti">
                      <span v-if="tv.type == 'txt'">{{ tv.data }}</span>
                      <img v-if="tv.type == 'emoji'" :src="`${publicPath}${tv.data}`" />
                    </span>
                  </p>
                </li>
              </ul>
            </a-layout-content>
            <a-layout-content v-show="chatType==2" id="chatRecord">
              <ul v-if="friendMsgList" class="Msglist">
                <li
                  class="chat-view"
                  v-for="(value, index) in friendMsgList.chat_msg"
                  :key="index"
                  :class="{ self: value.bySelf }"
                >
                  <img class="chat-avator auto-img" src="../assets/logo.png" />
                  <p
                    class="chat-bubble"
                    v-if="!Array.isArray(value.sendmessage)"
                  >{{ value.sendmessage }}</p>
                  <p class="chat-bubble" v-if="Array.isArray(value.sendmessage)">
                    <span v-for="(tv, ti) in value.sendmessage" :key="ti">
                      <span v-if="tv.type == 'txt'">{{ tv.data }}</span>
                      <img v-if="tv.type == 'emoji'" :src="`${publicPath}${tv.data}`" />
                    </span>
                  </p>
                </li>
              </ul>
            </a-layout-content>
            <a-layout-footer class="layout-content">
              <transition name="show-biaoqing">
                <div class="biaoqing-list" v-show="isShowBiaoQing">
                  <span
                    v-for="(value, key) in emoji"
                    class="biaoqing-icon"
                    :key="key"
                    @click="biaoQing(key)"
                  >
                    <img :src="require(`../assets/image/face/${value}`)" />
                  </span>
                </div>
              </transition>
              <div class="chat-icon">
                <span class="iconfont icon-biaoqing" @click="showBiaoQingList"></span>
                <span class="iconfont icon-Group-"></span>
                <span class="iconfont icon-yuyin"></span>
                <span class="iconfont icon-video"></span>
              </div>
              <div class="sendMsg">
                <a-textarea
                  contenteditable="true"
                  ref="input_Msg"
                  class="send"
                  placeholder="请输入您要发送的消息..."
                  :rows="4"
                  @keyup.13="sendPrivateText(chatMsg, userName)"
                  v-model="chatMsg"
                />
                <a-button-group class="send">
                  <a-button class="btn" type="dashed" @click="sendPrivateText(chatMsg, userName)">
                    <span class="iconfont icon-fasong_fill"></span> 发送
                  </a-button>
                  <a-button class="btn" type="dashed">
                    <span class="iconfont icon-zhongzhi"></span> 重置
                  </a-button>
                </a-button-group>
              </div>
            </a-layout-footer>
          </a-layout>
        </div>
      </div>
    </div>
    <transition name="showAnimate">
      <AddFriends v-show="isShowAdd"></AddFriends>
    </transition>
    <transition name="showAnimate">
      <CreateTeam v-show="isShowAddTeam" @hideAddTeam="hideAddPanel"></CreateTeam>
    </transition>
    <ApplyMsg></ApplyMsg>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import WebIM from "../configuration/WebIM";
import { mapState, mapActions, mapGetters } from "vuex";
import AddFriends from "../components/addFriends";
import ApplyMsg from "../components/applyMsg";
import CreateTeam from "../components/createTeam";
import * as mutationType from "../store/mutations-type";

import Emoji from "../store/face";
import store from "../store";

export default {
  data() {
    return {
      publicPath: process.env.BASE_URL,
      userName: "", //正在聊天的好友
      currentIndex: Number, //当前点击的好友的下标
      chatMsg: "", //聊天信息内容
      emoji: Emoji.obj, //聊天表情
      isShowBiaoQing: false, //显示表情
      chatType: 0, //当前聊天类型
      isShowAddTeam: false, //显示添加好友界面
      visible: false, //抽屉是否显示
      teamApplyUserList: [],
      drawerTitle: ""
    };
  },
  components: {
    AddFriends,
    ApplyMsg,
    CreateTeam
  },
  computed: {
    ...mapState([
      "currentUser",
      "getFriendList",
      "isShowAdd",
      "isShowApplyMsg",
      "messageList",
      "chatRoomList",
      "groupList",
      "teamMenberApplyList"
    ]),
    ...mapGetters(["getFriendID"]),
    friendMsgList() {
      let id = this.userName;
      return this.getFriendID(id);
    }
  },
  watch: {
    processData: "scrollToBottom",

    getFriendList() {
      let self = this;
      WebIM.conn.getRoster({
        success: roster => {
          let friendList = roster.filter(function(val) {
            return val.subscription === "both" || val.subscription === "to";
          });

          // 获取好友列表
          self.$store.commit(mutationType.GET_FRIEND_LIST, friendList);
          //  将好友用户ID添加到聊天消息的数组中
          self.$store.commit(mutationType.SET_MESSAGE_OF_USER_ID, friendList);
        }
      });
    }
  },
  methods: {
    ...mapActions(["setIsAddShow"]),
    //显示添加好友的界面
    showAdd() {
      this.setIsAddShow(true);
    },
    showTeamAdd() {
      this.isShowAddTeam = true;
    },
    hideAddPanel() {
      this.isShowAddTeam = false;
    },
    // 关闭登录连接
    close() {
      WebIM.conn.close();
      this.$router.push({ name: "login" });
    },
    // 改变聊天类型
    changeType(type) {
      this.userName = "";
      this.chatType = type;
    },
    // 改变单聊的好友
    changeChatUser(userInfo, index) {
      this.userName = userInfo.name;
      this.currentIndex = index;
    },
    // 改变聊天室的当前聊天室
    changeChatRoom(chatRoomName, index) {
      this.userName = chatRoomName;
      this.currentIndex = index;
    },
    // 好友列表滚动
    fListScroll() {
      new BScroll(this.$refs.friendListScroll, {
        scrollY: true
      });
    },

    // 单聊发送文本消息
    sendPrivateText(Msg, userName) {
      let id = WebIM.conn.getUniqueId(); // 生成本地消息id
      let msg = new WebIM.message("txt", id); // 创建文本消息
      if (Msg !== "") {
        if (this.chatType == 0) {
          // 单聊的好友消息
          msg.set({
            msg: Msg, // 消息内容
            to: userName, // 接收消息对象（用户id）
            roomType: false,
            ext: {}, //扩展消息
            success: () => {
              let messageListArr = this.messageList;
              for (let i = 0; i < messageListArr.length; i++) {
                if (messageListArr[i]._userid == userName) {
                  messageListArr[i].chat_msg.push({
                    sendmessage: Msg,
                    bySelf: true,
                    to: userName
                  });
                }
              }
            }, // 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
            fail: function(e) {
              throw e;
            } // 对失败的相关定义，sdk会将消息id登记到日志进行备份处理
          });
          WebIM.conn.send(msg.body);
        } else if (this.chatType == 2) {
          // 聊天室发送文本消息
          msg.set({
            msg: Msg, // 消息内容
            to: 99061941207041, // 接收消息对象(聊天室id)
            roomType: true, // 群聊类型，true时为聊天室，false时为群组
            ext: {}, // 扩展消息
            // 对成功的相关定义，sdk会将消息id登记到日志进行备份处理
            success: () => {
              let messageListArr = this.messageList;

              for (let i = 0; i < messageListArr.length; i++) {
                if (messageListArr[i]._userid == userName) {
                  messageListArr[i].chat_msg.push({
                    sendmessage: Msg,
                    bySelf: true,
                    to: userName
                  });
                }
              }
            }
          });

          msg.setGroup("groupchat"); // 群聊类型
          WebIM.conn.send(msg.body);
        }
      }

      this.chatMsg = "";
    },

    // 显示表情列表
    showBiaoQingList() {
      if (!this.isShowBiaoQing) {
        this.isShowBiaoQing = true;
      } else {
        this.isShowBiaoQing = false;
      }
    },
    // 表情的点击事件
    biaoQing(icon) {
      this.chatMsg += icon;
    },
    // scrollToBottom: () => {
    //   // 聊天定位到底部
    //   this.$nextTick(function() {
    //     let ele = document.getElementById("chatRecord");
    //     ele.scrollTop = ele.scrollHeight;
    //   });
    // },
    // 添加群聊
    toAdd(value) {
      WebIM.conn.joinGroup({
        groupId: value, // 群组ID
        success: function() {
          // store.commit(mutationType.ADD_TEAM_APPLY_LIST,{id:value,applyinfo:resp})
        },
        error: function(e) {
          if (e.type == 17) {
            alert("您已经在这个群组里了");
          }
        }
      });
    },
    // 抽屉事件
    showDrawer(id, teamTitle) {
      this.visible = true;
      this.teamApplyUserList = this.teamMenberApplyList[id];
      this.drawerTitle = teamTitle;
    },
    onClose() {
      this.visible = false;
    },
    pastApply(user, id, index) {
      store.commit(mutationType.CHANGE_APPLY_PAST, { user, id, index });

      if (this.teamMenberApplyList[id][index].isJoin) {
        WebIM.conn.agreeJoinGroup({
          applicant: user, // 申请加群的用户名
          groupId: id, // 群组ID
          success: function() {}
        });
      }
    }
  },
  mounted() {
    this.fListScroll();

    if (this.userName == "") {
      return;
    }
    this.scrollToBottom();
  },
  updated() {
    if (this.userName == "") {
      return;
    }
    // this.$nextTick(function() {
    //   let ele = document.getElementById("chatRecord");
    //   ele.scrollTop = ele.scrollHeight;
    // });
  }
};
</script>

<style lang="scss">
@import "../assets/scss/transition.scss";
.chat-page {
  width: 100%;
  height: 100vh;
  background-color: #f0f3fa;

  .chat-header {
    width: 100%;
    height: 50px;
    background-color: rgb(92, 179, 236);
    overflow: hidden;

    .title {
      text-align: left;
      font-size: 16px;
      line-height: 50px;
      margin-left: 10px;
      background-image: -webkit-linear-gradient(
        right,
        rgb(245, 249, 250),
        rgb(225, 230, 233)
      );
      background-image: linear-gradient(
        to right,
        rgb(245, 249, 250),
        rgb(236, 240, 241)
      );
      -webkit-background-clip: text;
      color: transparent;
      font-weight: 700;
    }

    .login-user {
      position: relative;
      width: 200px;
      height: 50px;
      overflow: hidden;
    }
    .login-user::before {
      position: absolute;
      content: " ";
      border: 0.5px solid #000; /*no*/
      width: 1px;
      height: 30px;
      left: 0;
      top: 0;
      bottom: 0;
      margin: auto 0;
    }
    .user-header {
      width: 35px;
      height: 35px;
      background-color: #f0f3fa;
      border-radius: 50%;
      margin-left: 10px;
      margin-top: calc(15px / 2);
    }
    .user-name {
      margin: calc(8px / 2) 10px;
      text-align: left;
    }
    .name {
      font-size: 14px;
      color: #fff;
      font-weight: 600;
    }
    .nickName {
      color: rgb(209, 204, 204);
      font-size: 10px !important;
    }
  }

  .teamList {
    display: flex;
    border-bottom: 1px solid #ddd;
    align-items: center;
    margin: 5px 0;
    .teamItem {
      flex: 1;
    }
    .itemGrow {
      flex-grow: 5;
      text-align: left;
    }
  }

  .chat-room {
    width: 100%;
    height: 50px;
    border-top: #a2cae7 1px solid;
    border-bottom: #a2cae7 1px solid;
    line-height: 50px;
    cursor: pointer;
    font-weight: 600;
    font-size: 18px;
  }
  .chat-room:hover {
    background-color: #a2cae7;
  }
  .chat-content {
    display: flex;

    .item {
      flex: 0 0 1;
      height: calc(100vh - 90px);
      background-color: #fff;
    }
    .chat-aside {
      height: calc(100vh - 50px);
      width: 80px;

      .out {
        width: 32px;
        height: 32px;
        margin: 5px auto;
        border: 1px solid #ddd;
        border-radius: 50%;
        line-height: 32px;
        cursor: pointer;
        color: #fff;
        background-color: #5cb3ec;
      }
      .add-friend {
        font-size: 20px;
        margin-top: 10px;
        cursor: pointer;
      }
    }
    .chat-type {
      margin: 20px 0 20px 20px;
      width: calc((100% - 50px) / 2);
      // overflow-y: auto;
    }
    .friendList {
      height: 77vh;
    }
    .avatar {
      border: 1px solid #ddd;
      margin: auto 0;
    }
    .active {
      background-color: rgba(217, 217, 219, 0.5);
    }
    .friend {
      border-bottom: 1px solid #ddd;
      overflow: hidden;
      padding: 5px 3px;
      cursor: pointer;
      &:hover {
        background-color: rgba(217, 217, 219, 0.3);
      }
      .friendMsg {
        width: 85%;
        text-align: left;
        margin-left: 10px;
      }
      .name {
        font-weight: 600;
      }
      .Msg {
        font-size: 10px;
        color: #b2b2b2;
      }
    }
    .chat-Msg {
      margin: 20px;
      width: calc(100% - 50px);
    }
    //聊天视图
    .chat-view {
      display: flex;
      width: 100%;
      margin: 10px 0;
      &.self {
        flex-direction: row-reverse;
        .chat-bubble {
          background-color: aquamarine;
        }
      }
    }
    .layout-content {
      position: relative;
    }
    .biaoqing-list {
      position: absolute;
      width: 100%;
      max-height: 70px;
      background-color: rgba(191, 191, 194, 0.5);
      top: -55%;
      z-index: -100;
      text-align: left;
      padding: 3px;
      overflow-y: auto;
    }
    .biaoqing-icon {
      cursor: pointer;
    }
    .chat-avator {
      width: 30px;
      height: 30px;
      border: 1px solid #ddd;
      border-radius: 50%;
      margin: 0 10px;
    }
    .chat-bubble {
      line-height: 25px;
      color: #000;
      margin-bottom: 0;
      border-radius: 10px;
      border: 1px solid #ddd;
      padding: 0 5px;
      background-color: #a2cae7;
      max-width: 50%;
      min-height: 30px;
      text-align: left;
    }
    .chat-icon {
      width: 100%;
      height: 30px;
      background-color: #f0f3fa;
      text-align: left;
      color: #000;
      font-size: 19px;
      font-weight: 700;
      padding-left: 10px;
      .iconfont {
        cursor: pointer;
      }
      .iconfont:not(:first-child) {
        margin-left: 20px;
      }
    }
    .sendMsg {
      display: flex;
      .send:first-child {
        flex: 0 0 1;
        resize: none;
        height: 97px;
      }
      .send:last-child {
        background-color: #fff;
      }
      .btn {
        margin-top: 11px;
      }
    }
  }
}

.applyList {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 5px;
  .applyItem {
    flex: 1;
    &:first-child {
      flex-grow: 3;
    }
  }
}
// ui框架组件样式
.ant-dropdown-link {
  width: 100% !important;
  border: 1px solid #ddd;
}
.ant-dropdown-trigger {
  width: 100% !important;
}
.ant-tabs-nav {
  z-index: 50;
  background-color: #fff;
}
#components-layout-demo-basic .ant-layout-header {
  height: 48px;
  line-height: 48px;
  background-color: #7dbcea;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
}
#components-layout-demo-basic .ant-layout-content {
  background: rgb(255, 255, 255);
  color: #fff;
  height: 60vh;
  border-bottom: 1px solid #b2b2b2;
  overflow-y: auto;
  .msgcontent {
    height: 60vh;
  }
}
.ant-layout-content::-webkit-scrollbar,
.biaoqing-list::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 1px; /*高宽分别对应横竖滚动条的尺寸*/
}
.ant-layout-content::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 1px;
  background: rgba(0, 0, 0, 0.4);
}
.ant-layout-content::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  border-radius: 0;
  background: rgba(0, 0, 0, 0.2);
}
#components-layout-demo-basic .ant-layout-footer {
  background-color: rgb(255, 255, 255);
  height: 127px;
  color: #fff;
  padding: 0;
  z-index: 50;
}
</style>
