<template>
  <div class="create-team-page">
    <div class="addFriends-box">
      <h1>创建群聊</h1>
      <a-input placeholder="请输入群名称" v-model="teamID" />
      <a-input placeholder="请输入群描述" v-model="teamdesc" />

      <a-button-group class="btn">
        <a-button type="primary" @click="cancel">
          <a-icon type="close-circle" />取消
        </a-button>
        <a-button type="primary" @click="createTeam">
          创建
          <a-icon type="plus-circle" />
        </a-button>
      </a-button-group>
    </div>
  </div>
</template>

<script>
import WebIM from "../configuration/WebIM";
import store from "../store";
import * as mutationType from "../store/mutations-type";

export default {
  data() {
    return {
      teamID: "",
      teamdesc: "",
      teamMember: []
    };
  },
  methods: {
    cancel() {
      this.$emit("hideAddTeam");
    },
    createTeam() {
      var options = {
        data: {
          groupname: this.teamID, // 群组名
          desc: this.teamdesc, // 群组描述
          members: this.teamMember, // 用户名组成的数组
          public: true, // pub等于true时，创建为公开群
          approval: true, // approval为true，加群需审批，为false时加群无需审批
          allowinvites: false //是否允许群成员邀请别人加入此群
        },
        success: function(respData) {
          WebIM.conn.getGroupInfo({
            groupId: respData.data.groupid, //群组id
            success: function(resp) {
              store.commit(mutationType.GET_TEAM_GROUP, resp);
            }
          });
        },
        error: function() {}
      };
      WebIM.conn.createGroupNew(options);
      this.$emit("hideAddTeam");
    }
  }
};
</script>

<style lang="scss" scoped>
.create-team-page {
  width: 100%;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 0;
  z-index: 70;
  background-color: rgba(0, 0, 0, 0.5);

  .addFriends-box {
    width: 400px;
    background-color: #fff;
    margin: 150px auto 0;
    border-radius: 10px;
    padding: 10px;
    h1 {
      font-size: 16px;
      margin: 10px;
    }
    .btn {
      margin: 30px 0;
    }
  }
}
</style>