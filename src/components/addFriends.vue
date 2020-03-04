<template>
  <div class="addFriends">
    <div class="addFriends-box">
      <h1>添加好友</h1>
      <a-input placeholder="请输入好友ID..." v-model="friendID" />

      <a-button-group class="btn">
        <a-button type="primary" @click="cancel">
          <a-icon type="close-circle" />取消
        </a-button>
        <a-button type="primary" @click="addFriends(friendID)">
          添加
          <a-icon type="plus-circle" />
        </a-button>
      </a-button-group>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import WebIM from "../configuration/WebIM";
export default {
  data() {
    return {
      friendID: ""
    };
  },

  methods: {
    ...mapActions(["setIsAddShow"]),
    cancel() {
      this.setIsAddShow(false);
      this.friendID = "";
    },
    addFriends() {
      let self = this;
      if (self.friendID !== "") {
        WebIM.conn.subscribe({
          to: self.friendID,
          message: "加个好友呗!"
        });
        this.setIsAddShow(false);
      } else {
        self.$message.info("请输入好友ID");
      }
      this.friendID = "";
    }
  }
};
</script>
<style lang="scss" scoped>
.addFriends {
  position: fixed;
  width: 100%;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 50;
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