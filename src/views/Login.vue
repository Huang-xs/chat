<template>
  <div class="login-page">
    <div class="login-bg">
      <img src="../assets/image/Bg5.jpg" class="img" />
    </div>
    <div class="login-content">
      <div class="header-box">
        <div class="header-img">
          <div class="iconfont icon-yonghu-tianchong size"></div>
        </div>
      </div>
      <div class="login-user">Clown-z</div>
      <div class="login-hello">早上好，欢迎光临！</div>

      <div class="components-input-demo-presuffix">
        <a-input placeholder="用户名" v-model="user" ref="userNameInput">
          <a-icon slot="prefix" type="user" />
          <a-tooltip slot="suffix" title="Extra information">
            <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
          </a-tooltip>
        </a-input>
      </div>
      <div class="components-input-demo-presuffix">
        <a-input placeholder="密码" type="password" v-model="password" ref="userNameInput">
          <a-icon slot="prefix" type="lock" />
          <a-tooltip slot="suffix" title="Extra information">
            <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
          </a-tooltip>
        </a-input>
      </div>
      <div class="login-other">
        <a-checkbox class="fl">记住密码</a-checkbox>
        <div class="forget_register fr">
          <div class="forget fl">忘记密码</div>
          <div class="register fr" @click="toRegister">立即注册</div>
        </div>
      </div>

      <a-button block @click="toLogin(user,password)">登录</a-button>
    </div>
  </div>
</template>
<script>
import WebIM from "../configuration/WebIM";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      user: "",
      password: ""
    };
  },
  methods: {
    // 辅助函数
    ...mapActions(["onLogin"]),

    toLogin(userName, password) {
      // 判断是否为登录状态
      let self = this;
      this.onLogin(userName);

      this.user = "";
      this.password = "";
      if (userName == "" && password == "") {
        return;
      }
      var options = {
        apiUrl: WebIM.config.apiURL,
        user: userName,
        pwd: password,
        appKey: WebIM.config.appkey,
        success: token => {
          self.$message.info("欢迎加入");
          this.$router.push({ name: "chat", params: { userName } });
          token = token.access_token;
          WebIM.utils.setCookie("webim_" + userName, token, 1);
        },
        error: function() {}
      };
      WebIM.conn.open(options);
    },

    toRegister() {
      this.$router.push("/register");
    }
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  font-size: 16px;
  .login-bg {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -1;
  }
  .login-content {
    position: absolute;
    width: 340px;
    height: 350px;
    left: 0;
    top: 50%;
    right: 0;
    transform: translateY(-50%);
    background-color: #fff;
    margin: auto;
    border-radius: 10px;
    padding: 0 30px;
    & > div {
      margin-bottom: 8px;
    }
    .size {
      font-size: 35px;
      color: #4bc7fc;
    }
    .header-box {
      position: relative;
      height: 30px;
      .header-img {
        position: absolute;
        width: 60px;
        height: 60px;
        left: 0;
        right: 0;
        top: -30px;
        background-color: antiquewhite;
        border: 1px solid rgb(215, 238, 174);
        border-radius: 50%;
        -moz-box-shadow: 0px 1px 4px #4bc7fc;
        -webkit-box-shadow: 0px 1px 4px #4bc7fc;
        box-shadow: 0px 1px 4px #4bc7fc;
        margin: 0 auto;
      }
    }
    .login-hello {
      font-size: 12px;
      color: #b2b2b2;
    }
    .login-other {
      overflow: hidden;
      font-size: 14px;
      & > div {
        cursor: pointer;
      }
    }
    .register {
      color: #1890ff;
      font-size: 14px;
      margin-left: 10px;
    }
    .ant-btn {
      margin-top: 20px;
    }
    .ant-btn:hover {
      color: #fff;
      background-color: #1890ff;
    }
  }
  .components-input-demo-presuffix {
    margin: 20px 0;
  }
  .components-input-demo-presuffix .anticon-close-circle {
    cursor: pointer;
    color: #ccc;
    transition: color 0.3s;
    font-size: 12px;
  }
  .components-input-demo-presuffix .anticon-close-circle:hover {
    color: #999;
  }
  .components-input-demo-presuffix .anticon-close-circle:active {
    color: #666;
  }
}
</style>