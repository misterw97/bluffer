import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Welcome from '../views/Welcome.vue'
import Game from '../views/Game.vue'

Vue.use(VueRouter)

  const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/game/:game/user/:user',
    name: 'Game',
    component: Game
  }
]

const router = new VueRouter({
  routes
})

export default router
