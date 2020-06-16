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

import Login from './components/account/Login'
import Register from './components/account/Register'
import Logout from './components/account/Logout'  
//import Images from './components/PhotoUpload'
import NotFound from './components/NotFound'
import ProfileRoutes from './routes/profile'


const routes = [
  ...ProfileRoutes,
  { path: '/login', component: Login, },
  { path: '/register', component: Register },
  { path: '/logout', component: Logout },
  { path: '/', redirect: '/profile' },
  //{path: '/test', component: Images },
  { path: '*', component: NotFound },
]

const router = new VueRouter({
  mode: 'history',
  routes
});

router.beforeEach(async (to, from, next) => {
  await store.dispatch('fetchSession');
  const auth = store.state.auth;

  if(to.matched.some(r => r.meta.profileMustExist)){
    if(to.params.username === store.state.username) next('/profile');
    else
      try{
        await axios.get(process.env.VUE_APP_SERVER + '/profile/' + to.params.username);
        next();
      }
      catch(error){
        next('/404');
      }
  }
  else if(to.matched.some(r => r.meta.secure)){
    if(!auth) next('/login');
    else next();
  }
  else if (to.path === '/login' || to.path === '/register'){
    if(!auth) next();
    else next('/profile');
  }
  else next();
})


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
