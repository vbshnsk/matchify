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


import Login from './components/Login'
import Register from './components/Register'
import Statistics from './components/Statistics'
import Logout from './components/Logout'
import Spotify from './components/Spotify'
import SpotifyLogin from './components/Spotify.login'

const routes = [
  {path: '/login', component: Login},
  {path: '/register', component: Register},
  {path: '/statistics', component: Statistics},
  {path: '/spotify', component: Spotify},
  {path: '/spotify_back', component: SpotifyLogin},
  {path: '/logout', component: Logout},
]

// const store = new Vuex.Store({
//   state: {
//     apiHost: 'http://localhost:3000'
//   }
// })

const router = new VueRouter({
  mode: 'history',
  routes
});


new Vue({
  router,
  //store,
  render: h => h(App),
}).$mount('#app')
