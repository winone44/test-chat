import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from "@/views/LoginView";
import ChatView from "@/views/ChatView";
import store from "@/store";
import Register from "@/views/RegisterView.vue";
import ProfileView from "@/views/ProfileView";
import LocationCheckView from "@/views/LocationCheckView";
import NewGroupCreateView from "@/views/NewGroupCreateView";
import NewAlertCreateView from "@/views/NewAlertCreateView";
import JoinGroupView from "@/views/JoinGroupView";
import ProfileSettingsView from "@/views/ProfileSettingsView.vue";

Vue.use(VueRouter)

store.dispatch('autologin');
store.dispatch('setLastLocale');

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
    name: 'HomeView',
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
    name: 'RegisterView',
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
    path: '/settings',
    name: 'ProfileSettingsView',
    component: ProfileSettingsView,
    beforeEnter: authGuard,
  },
  {
    path: '/group-create/',
    name: 'NewGroupCreateView',
    component: NewGroupCreateView,
    beforeEnter: authGuard,
  },
  {
    path: '/alert-create/',
    name: 'NewAlertCreateView',
    component: NewAlertCreateView,
    beforeEnter: authGuard,
  },
  {
    path: '/join-to-group/:groupId',
    name: 'JoinGroup',
    component: JoinGroupView,
    beforeEnter: authGuard,
    props: true
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
  mode: process.env.VUE_APP_API_ROUTER_MODE,
  base: process.env.BASE_URL,
  routes
})

export default router
