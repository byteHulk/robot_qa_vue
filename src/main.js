// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import QaRobot from '@/components/QaRobot'

import router from './router'
import jQuery from 'jquery'
import VueI18n from 'vue-i18n'
import i18n from './locales'

// Vue.use(VueI18n)

// require('@/ui/index')

Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#_robot',
  i18n,
  // router,
  components: { QaRobot },
  template: '<QaRobot/>'
})
