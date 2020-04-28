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

const routes = [
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile,
    children: profileChildrenPaths },
  { path: '/profile/:username', component: Profile,
     children: profileChildrenPaths },
  { path: '/spotify', component: Spotify },
  { path: '/spotify_back', component: SpotifyLogin },
  { path: '/logout', component: Logout },
  { path: '*', component: NotFound },
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
