import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(VueRouter);
Vue.use(VueAxios, axios);


import Login from './components/Login'
import Register from './components/Register'
import Statistics from './components/Statistics'

const routes = [
  {path: '/login', component: Login},
  {path: '/register', component: Register},
  {path: '/statistics', component: Statistics}
]

const router = new VueRouter({
  routes
});


new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
