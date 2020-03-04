# pc-chat-app

## Project setup

```
npm install
```

### Compiles and hot-reloads for development

```
npm run serve
```

### Compiles and minifies for production

```
npm run build
```

### Lints and fixes files

```
npm run lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).



# vue-pc-chat（http://116.62.210.250:9100/#/）

【技术栈：angular + ionic + vue + mint-ui + react-native + teaset + h5plus + mui + nodejs + webpack + gulp + ES6 + vux + typescript2 + weex + weex-ui + 微信小程序 + react + ant-design + ant-design-mobile + material-ui + nervjs + taro + taro-ui + spring boot】

基于vue实现的PC端的快乐聊天页面

#### 1.技术：（Vue）

* vue-cli 构建项目
* vue-router 实现单页面跳转
* vueX  实现状态的管理
* ant-design-vue vue的UI库（可能未使用，可忽略）
  
  * 地址： https://www.antdv.com/docs/vue/introduce/ 
*  Mint UI  或ant-design-vue   vue的UI库
  
  * http://mint-ui.github.io/#!/zh-cn 
  
  * ant-design-vue最好全局引入，否则会导致某些组件需要的依赖文件没找到，就无法使用
  
  * 全局引入
  
    * ```
      import Antd from 'ant-design-vue'；
      import 'ant-design-vue/dist/antd.css'；
      Vue.use(Antd)；
      ```
  
  * 局部引入【按需加载】
  
    * 1. 安装 按需引入的插件：npm  install  babel-plugin-import  -S
  
      2. 修改 babel.config文件为
  
         ```
         plugins: [
                 [
                     "import",
                     { libraryName: "ant-design-vue", libraryDirectory: "es", style: "css" }
                 ]
             ]
         ```
  
         3.创建按需引入文件
  
         ```
         ui的按需加载
         import { Input, Icon, Tooltip, Checkbox, Button, Menu } from "ant-design-vue";
         
         let AntDesigns = [Input, Icon, Tooltip, Checkbox, Button, Menu];
         
         export default {
             install(Vue) {
                 AntDesigns.forEach(ui => {
                     Vue.component(ui.name, ui)
                 })
             }
         }
         ```
  
         4.在main.js文件中引入
  
         ```
         // 引入ui的按需加载文件
         // import uiConfig from "./ui-config";
         // 使用ant-design 中的这两个message、notification需要进行全局匹配
         // import { message } from 'ant-design-vue';
         // import "ant-design-vue/dist/antd.css"
         // Vue.prototype.$message = Antd;
         // Vue.use(message);
         
         // Antd.config({
         //     duration: 2
         // })
         // Vue.use(uiConfig);
         ```
  
* axios请求数据【 *axios*是一个库,并不是*vue*中的第三方插件,*使用*时不能通过*Vue*.use()安装插件,*需要*在原型上进行绑定: 】
* axios-vue【 vue-axios是将axios集成到Vue.js的小包装器 】
* scss实现界面的布局【注：需要安装：sass-loader和 node-sass】
* rem：单位：实现界面的自适应

#### 3.API

环信官方api【 http://docs-im.easemob.com/im/web/intro/integration 】

   

#### 2.项目初始化

* 1.安装  npm  i    easemob-websdk@1.8.3      strophe.js@1.2.16   -S

#### 3.配置文件【 https://www.easemob.com/news/882】

参考文献：【 https://www.cnblogs.com/usebtf/p/9956576.html 、 https://blog.csdn.net/web_whx/article/details/99562155 】

#### 4.VUE PC端适配方案flexible( 手淘*移动端适配方案flexible.js* )+px2remLoader  [ https://blog.csdn.net/weixin_39950595/article/details/92397358 ]

*  安装
  npm install px2rem-loader -D
  npm install lib-flexible -S 

*  参照官网配置方法 

  ```
  // 增加代码，px转rem配置（需要将px2remloader添加进loaders数组中）
    const px2remLoader = {
      loader: 'px2rem-loader',
      options: {
        remUnit: 192,  //根据视觉稿，rem为px的十分之一，1920px  192 rem
        // remPrecision: 8//换算的rem保留几位小数点
      }
    }
  ```

*  在main.js中引入 import 'flexible.js' 文件 

* 将flexible.js的部分代码改为适配pc端的代码：如下:

  * 需要注意的事，一般不对1px的边框进行换算，只需要哎样式后面添加/*no*/即可保证不被转换 

  ```
  function refreshRem(){
          var width = docEl.getBoundingClientRect().width;
          if (width / dpr > 540) {
              width = width * dpr;
          }
          var rem = width / 10;
          docEl.style.fontSize = rem + 'px';
          flexible.rem = win.rem = rem;
      }
  ```
  
  #### 5.UI库  【使用了ant-design-vue的ui库】想修改ui库的样式要去掉scoped（样式的私有化），才可以进行修改
  
* 1.安装：【-S：项目打包后该插件也会被打包，而-D：是在项目制作过程中对一些进行转译的，打包后也没什么用处，只会占据文件大小，就不会被打包，所以打包后对项目没有作用的就安装在-D中】

  * npm i  ant-design-vue --S
  * npm i  babel-plugin-import --D

* 配置 babel-plugin-import 

  * #### 使用 vue-cli 3 的小伙伴 [#](https://www.antdv.com/docs/vue/use-with-vue-cli-cn/#使用-vue-cli-3-的小伙伴)

    修改`babel.config.js`文件，配置 babel-plugin-import

    ```diff
     module.exports = {
      presets: ["@vue/app"],
    +  plugins: [
    +    [
    +      "import",
    +      { libraryName: "ant-design-vue", libraryDirectory: "es", style: true }
    +    ]
    +  ]
    };
    ```

* 按需引入使用

  * ```
    // ui的按需加载
    import { Input, Icon, Tooltip, Checkbox, Button } from "ant-design-vue";
    
    let AntDesigns = [Input, Icon, Tooltip, Checkbox, Button];
    
    export default {
        install(Vue) {
            AntDesigns.forEach(ui => {
                Vue.component(ui.name, ui)
            })
        }
    }
    ```

#### 6.登录验证：

#### 7.添加好友时要注意，在申请好友的过程中，在subscribe中要保存申请者的姓名，才能在对方通过申请是使用，直接获取申请者的姓名是不行的

#### 8.发送消息：就是在登录时，就将已有的好友添加到好友消息数组中，并添加一个存放消息的数组，然后接下来就只需要在发送时将该消息存放到消息数组中。接收消息：就是将接收到的消息放到数组中，并将消息中的是否是自己的改为false

#### 9.引入放在public文件夹中的表情图片，要通过

* 在data中定义：publicPath: process.env.BASE_URL,
  * 在src中引入，例如：`${publicPath}image/....`
* 也可通过require（）来引入

#### 10.滚动条始终定位在底部

Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。

$nextTick 是在下次 DOM 更新循环结束之后执行延迟回调，在修改数据之后使用 。

既然$nextTick是在下次DOM更新时执行的，不正好符合我们的要求嘛（小激动）。

```
//每次页面渲染完之后滚动条在最底部

updated:function(){

  this.$nextTick(function(){

  var p = document.getElementById('dialogue_box');

  p.scrollTop = p.scrollHeight;

  })

 }


//第一次页面渲染完之后滚动条在最底部

methods:function(){

 

  this.$nextTick(function(){

  var p = document.getElementById('dialogue_box');

  p.scrollTop = p.scrollHeight;

  })

 }
```

#### 11.项目打包部署到服务器

​    1.将开发好的vue项目打包（npm run build打包）

​	2.打包后的项目，如果用到了外部的api，会出现跨域的现象，要通过nginx做反向代理来解决跨域

​	存在的问题：项目中使用的是proxy代理，通过axios请求，但打包后还会出现跨域

```
配置：
devServer: {
        proxy: {
            "/robot": {
                target: "http://116.62.210.250:9000/openapi/api",
                changeOrigin: true,
                secure: false,
                pathRewrite: { // 路径重写
                    '^/robot': ''
                }
            }
        }
    }
    
   
   访问：
   let data = await Axios.post("/robot", {
                info: message.data,
                key: store.state.key,
            });
            这样打包后访问的链接是：http://127.0.0.1:8080/robot,就会访问不到
            
```



​	解决办法：

​		通过在服务器的nginx中添加反向代理

	server
	{
		listen       9100;
	    server_name  116.62.210.250;
	    
	    location / {
	    	root /www/wwwroot/chat-dist;
	        index index.html;
	    }
	    
	    location /robot{
	        proxy_pass   http://www.tuling123.com/openapi/api;
	    }
	    add_header  'Access-Control-Allow-Origin' *;
	    default_type 'text/html';
	    charset utf-8;
	}