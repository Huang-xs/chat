import * as mutationType from "./mutations-type";

export default {
    onLogin({ commit }, name) {
        commit(mutationType.TO_LOGIN, { isLogin: true, userName: name });
    },
    setIsAddShow({ commit }, isShow) {
        commit(mutationType.SHOW_ADD, isShow);
    },
    setIsShowApply({ commit }, isShowApply) {
        commit(mutationType.SHOW_APPLY, isShowApply);
    }
}