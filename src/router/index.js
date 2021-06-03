import Vue from 'vue'
import Router from 'vue-router'
// import ChatApp from '@/components/index'
import QaRobot from '@/components/QaRobot'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: '/',
    //   name: 'ChatApp',
    //   component: ChatApp
    // },
    {
      path: '/',
      name: 'QaRobot',
      component: QaRobot
    }
  ],
  mode: 'history',
  base: '/'
})
