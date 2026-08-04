import App from './App.vue'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'

export function createApp() {
  const app = createSSRApp(App)
  app.use(createPinia())
  return {
    app
  }
}
// #endif
