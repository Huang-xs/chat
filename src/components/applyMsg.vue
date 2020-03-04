<template>
  <a-modal v-model="isShowApplyMsg" title="Title">
    <template slot="footer">
      <a-button key="back" @click="handleCancel">拒绝</a-button>
      <a-button key="submit" type="primary" @click="handleOk">通过</a-button>
    </template>
    <p>{{addUserName}}&nbsp;&nbsp;请求添加为好友！</p>
  </a-modal>
</template>

<script>
import { mapState, mapActions } from "vuex";
import WebIM from "../configuration/WebIM";

export default {
  data() {
    return {
      visible: false
    };
  },
  computed: {
    ...mapState(["isShowApplyMsg", "isAdd", "addUserName", "passUserName"])
  },
  methods: {
    ...mapActions(["setIsShowApply"]),
    handleOk() {
      // let arr= [];
      this.setIsShowApply(false);
      // 是否添加为好友
      let self = this;
      WebIM.conn.subscribed({
        to: self.$store.state.addUserName,
        message: "[resp:true]"
      });
      // let obj = {name:this.passUserName};
      //   arr.push(obj)

      // this.$store.commit(mutationType.SET_MESSAGE_OF_USER_ID, arr);
    },
    handleCancel() {
      this.setIsShowApply(false);
    }
  }
};
</script>

<style lang="scss" scoped>
.apply-page {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 50;
}
</style>