import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from "@/views/LoginView";
import ChatView from "@/views/ChatView";
import store from "@/store";
import Register from "@/views/Register";
import ProfileView from "@/views/ProfileView";
import LocationCheckView from "@/views/LocationCheckView";
import NewGroupCreateView from "@/views/NewGroupCreateView";

Vue.use(VueRouter)

store.dispatch('autologin');

const authGuard = (to, from, next) => {
  if (store.getters.isAuth) {
    console.log("authGuard " + store.getters.isAuth)
    next();
  }else {
    console.log("authGuard " + store.getters.isAuth)
    if (from.name !== 'LoginView') {
      next({name: 'LoginView'})
    }
  }
}

const notAuthGuard = (to, from, next) => {
  if (!store.getters.isAuth) {
    console.log("notAuthGuard " + store.state.isAuth)
    next();
  }else {
    console.log("notAuthGuard " + store.state.isAuth)
      next({name: 'home'})
  }
}

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'LoginView',
    component: LoginView,
    beforeEnter: notAuthGuard,
  },
  {
    path: '/locationCheck',
    name: 'LocationCheckView',
    component: LocationCheckView,
    beforeEnter: authGuard,
  },
  {
    path: '/register',
    name: 'register',
    component: Register,
    beforeEnter: notAuthGuard,
  },
  {
    path: '/chat/:personId?',
    name: 'ChatView',
    component: ChatView,
    beforeEnter: authGuard,
    props: true
  },
  {
    path: '/profile/:personId',
    name: 'ProfileView',
    component: ProfileView,
    beforeEnter: authGuard,
    props: true
  },
  {
    path: '/group-create/',
    name: 'NewGroupCreateView',
    component: NewGroupCreateView,
    beforeEnter: authGuard,
  },
  // {
  //   path: '/about',
  //   name: 'about',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
