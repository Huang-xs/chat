import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Chat from '../views/Chat.vue';
// import store from '../store'


Vue.use(VueRouter)

const routes = [{
        path: '/',
        name: 'login',
        component: Login
    },
    {
        path: '/register',
        name: 'register',
        component: Register
    },
    {
        path: '/chat',
        name: 'chat',
        meta: { requiresAuth: true }, //定义进入该路由是否需要登录验证
        component: Chat
    }
]

const router = new VueRouter({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes
})

// 登录验证
// router.beforeEach((to, from, next) => {
//     // console.log("to", to);
//     // console.log("from", from);
//     // console.log(store.state.isLogin);
//     if (to.meta.requiresAuth) {
//         if (store.state.isLogin) {
//             next();
//         } else {
//             // alert("请先登录");
//             next({
//                 path: "/",
//             })
//         }
//     } else {
//         next();
//     }
// })
export default router