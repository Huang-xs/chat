import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';

import VueAxios from 'vue-axios'
import axios from 'axios';

// 引入手淘的flexible适配(rem)
import 'lib-flexible/flexible';

// ant-design 的完整引入
import Antd from 'ant-design-vue';
import "ant-design-vue/dist/antd.css"
Vue.use(VueAxios, axios);
Vue.use(Antd);

// 引入音频
import audio from "./assets/8868.mp3";

Vue.prototype.clickButton = () => {
    let buttonAudio = document.getElementById('buttonAudio');
    buttonAudio.setAttribute('src', audio);
    //重复播放
    buttonAudio.play();
    //开始播放
}
document.body.addEventListener('click', function(e) {
    let event = e || window.event;
    let target = event.target || event.srcElement;
    let clickMusic = target.getAttribute('clickMusic')
    if (clickMusic === 'true') Vue.prototype.clickButton()
    else return false;
})

// 引入环信即时通信的配置文件
import "./configuration/WebIM"
import WebIM from "easemob-websdk"
// Vue.prototype.$webim = WebIM;


// 导入第三方表情包
WebIM.Emoji = {
    path: 'image/face/' /*表情包路径*/ ,
    map: {
        "[):]": "ee_1.png",
        "[:D]": "ee_2.png",
        "[;)]": "ee_3.png",
        "[:-o]": "ee_4.png",
        "[:p]": "ee_5.png",
        "[(H)]": "ee_6.png",
        "[:@]": "ee_7.png",
        "[:s]": "ee_8.png",
        "[:$]": "ee_9.png",
        "[:(]": "ee_10.png",
        "[:'(]": "ee_11.png",
        "[:|]": "ee_18.png",
        "[(a)]": "ee_13.png",
        "[8o|]": "ee_14.png",
        "[8-|]": "ee_15.png",
        "[+o(]": "ee_16.png",
        "[<o)]": "ee_12.png",
        "[|-)]": "ee_17.png",
        "[*-)]": "ee_19.png",
        "[:-#]": "ee_20.png",
        "[:-*]": "ee_22.png",
        "[^o)]": "ee_21.png",
        "[8-)]": "ee_23.png",
        "[(|)]": "ee_24.png",
        "[(u)]": "ee_25.png",
        "[(S)]": "ee_26.png",
        "[(*)]": "ee_27.png",
        "[(#)]": "ee_28.png",
        "[(R)]": "ee_29.png",
        "[({)]": "ee_30.png",
        "[(})]": "ee_31.png",
        "[(k)]": "ee_32.png",
        "[(F)]": "ee_33.png",
        "[(W)]": "ee_34.png",
        "[(D)]": "ee_35.png"
    }
};

Vue.config.productionTip = false
new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');