<template>
  <div class="register-page">
    <img src="../assets/image/Bg5.jpg" class="register-img" />
    <div class="register-content">
      <div class="back" @click="goback">
        <a-icon type="arrow-left" />
      </div>
      <div class="item tip">聊天，让自己的生活更加多彩！</div>
      <div class="item content">
        <div class="register-title">用户注册</div>
        <div class="components-input-demo-presuffix">
          <a-input placeholder="昵称" v-model="nickName" ref="nickNameInput">
            <a-icon slot="prefix" type="solution" />
            <a-tooltip slot="suffix" title="昵称：必须是由6-12位字母组成">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </div>
        <div class="components-input-demo-presuffix">
          <a-input placeholder="用户名" v-model="userName" ref="userNameInput">
            <a-icon slot="prefix" type="user" />
            <a-tooltip slot="suffix" title="用户名：必须是由汉字组成">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </div>
        <div class="components-input-demo-presuffix">
          <a-input placeholder="密码" type="password" v-model="password" ref="passwordInput">
            <a-icon slot="prefix" type="lock" />
            <a-tooltip slot="suffix" title="Extra information">
              <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
          </a-input>
        </div>
        <div class="components-input-demo-presuffix">
          <a-input placeholder="确认密码" type="password" v-model="notarizePwd" ref="notarizePwdInput">
            <a-icon slot="prefix" type="check-square" />
          </a-input>
        </div>
        <div>
          <a-button type="primary" block @click="toRegister(userName,password,nickName)">注册</a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import WebIM from "../configuration/WebIM";
export default {
  data() {
    return {
      nickName: "",
      userName: "",
      password: "",
      notarizePwd: ""
    };
  },
  methods: {
    goback() {
      this.$router.go(-1);
    },
    toRegister(username, password, nickname) {
      let self = this;
      this.nickName = "";
      this.userName = "";
      this.password = "";
      this.notarizePwd = "";
      var options = {
        username: username,
        password: password,
        nickname: nickname,
        appKey: WebIM.config.appkey,
        success: () => {
          // alert("注册成功");
          self.$message.info("注册成功");
          this.$router.push({ path: "/" });
        },
        error: function() {},
        apiUrl: WebIM.config.apiURL
      };
      WebIM.conn.registerUser(options);
    }
  }
};
</script>

<style lang="scss" scoped>
.register-page {
  position: relative;

  .register-img {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: 0 auto;
    z-index: -1;
  }

  .register-content {
    position: absolute;
    width: 600px;
    height: 400px;
    left: 0;
    right: 0;
    top: -50%;
    transform: translateY(25%);
    background-color: rgba(255, 255, 254, 0.5);
    margin: 0 auto;

    .back {
      position: absolute;
      width: 20px;
      height: 20px;
      left: -5px;
      top: -5px;
      background-color: #fff;
      border-radius: 50%;
      cursor: pointer;
      color: #000;
      overflow: hidden;
      font-weight: 700;
    }

    .item {
      float: left;
      height: 100%;
    }

    .tip {
      width: 320px;
      font-size: 30px;
      text-align: left;
      padding: 20px;
      color: rgba(73, 71, 71, 0.5);
    }

    .content {
      width: 280px;
      padding: 20px 15px;
      background-color: #fff;
    }
  }

  .register-title {
    text-align: left;
    font-size: 16px;
    margin-bottom: 25px;
  }
  .components-input-demo-presuffix {
    margin-bottom: 20px;
  }
}
</style>