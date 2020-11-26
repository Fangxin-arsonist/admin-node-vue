import {login, logout, getInfo} from '@/api/user'
import {getToken, setToken, removeToken} from '@/utils/auth'
import router, {resetRouter} from '@/router'

const state = {
  token: getToken(),
  name: '',
  roles_id: '',
  avatar: '',
  introduction: '',
  roles: []
}

const mutations = {
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLES_ID: (state, ROLES_ID) => {
    state.ROLES_ID = ROLES_ID
  }
}

const actions = {
  //用户登录
  login({commit}, userInfo) {
    const {username, password} = userInfo;
    return new Promise((resolve, reject) => {
      login({username: username.trim(), password: password}).then(response => {
        const {data} = response;
        commit('SET_TOKEN', data.token);
        setToken(data.token);
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  //获取用户信息
  getInfo({commit, state}) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const {data} = response;
        const menus = data;
        console.log("getinfo 获取的数据");
        console.log(data);
        if (!data) {
          reject('Verification failed, please Login again.')
        }
        const {roles,name, avatar, introduction} = data;
        const {ROLES_ID} = data.user;
        const {USER_NAME} = data.user;
        if (!roles || roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        console.log(roles);
        commit('SET_ROLES_ID', ROLES_ID);
        commit('SET_ROLES', roles);
        commit('SET_NAME', USER_NAME);
        commit('SET_AVATAR', avatar);
        commit('SET_INTRODUCTION', introduction);
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({commit, state, dispatch}) {
    return new Promise((resolve, reject) => {
      try {
        commit('SET_TOKEN', '');
        commit('SET_ROLES', []);
        removeToken();
        resetRouter();
        dispatch('tagsView/delAllViews', null, {root: true});
        resolve()
      } catch (e) {
        reject(e)
      }
    })
  },

  // remove token
  resetToken({commit}) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  async changeRoles({commit, dispatch}, role) {
    const token = role + '-token';
    commit('SET_TOKEN', token);
    setToken(token);
    const {roles} = await dispatch('getInfo');
    resetRouter();
    const accessRoutes = await dispatch('permission/generateRoutes', roles, {root: true});
    console.log("accessroute")
    console.log(accessRoutes)
    router.addRoutes(accessRoutes);
    dispatch('tagsView/delAllViews', null, {root: true})
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
