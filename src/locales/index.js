import Vue from 'vue'
import VueI18n from 'vue-i18n'
import zh from './zh-CN.js'

Vue.use(VueI18n)

export default new VueI18n({
    // 设置默认语言
      locale: localStorage.getItem('locale') || 'zh', //语言标识
      messages: {
        zh,
        // en
      },
      fallbackLocale: 'zh', //如果在message中找不到相应的键值将回退到原本的语言
      formatFallbackMessages: true //如果在message中找不到相应的键值将回退到原本的语言
    })