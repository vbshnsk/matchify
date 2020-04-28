import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(Vuex)
Vue.use(VueAxios, axios);

const store = new Vuex.Store({
  state: {
    auth: false,
    username: '',
  },
  mutations: {
    getAuthentication(state, data){
      state.auth = data.authorized;
      state.username = data.username;
    }
  },
  actions: {
    async fetchSession({ commit }){
      const res = await (axios.get(process.env.VUE_APP_SERVER + '/login', {withCredentials: true}));
      commit('getAuthentication', res.data);
    }
  }
})

import Login from './components/Login'
import Register from './components/Register'
import Statistics from './components/Statistics'
import ListeningHistory from './components/History'
import Profile from './components/Profile'
import Logout from './components/Logout'
import Spotify from './components/Spotify'
import SpotifyLogin from './components/Spotify.login'
import NotFound from './components/NotFound'

const profileChildrenPaths = [
  {
    path: 'statistics', component: Statistics,
  },
  {
    path: 'history', component: ListeningHistory
  }
]

const secureProfileChildrenPaths = [
  {
    path: 'spotify', component: Spotify,
  },
  {
    path: 'spotify_back', component: SpotifyLogin,
  },
]

const routes = [
  { path: '/login', component: Login, },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile,
    children: [...profileChildrenPaths, ...secureProfileChildrenPaths],
    meta: { secure: true, root: true }},
  { path: '/profile/:username', component: Profile,
     children: profileChildrenPaths,
     meta: {root: true},
   },
  { path: '/logout', component: Logout },
  { path: '/', redirect: '/profile'},
  { path: '*', component: NotFound },
]

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch('fetchSession');
  const auth = store.state.auth;
  if(to.matched.some(r => r.meta.secure)){
    if(!auth) next('/login');
    else next();
  }
  else if (to.path === '/login' || to.path === '/register'){
    if(!auth) next();
    else next('/profile')
  }
  else next();
})


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
