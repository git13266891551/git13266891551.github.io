//index.js才是正真的入口文件
import Vue from 'vue'
import App from './app.vue'
// import './assets/css/test.css'
// import './assets/css/stylus.styl'
import './assets/css/global.styl'

const root = document.createElement('div')
document.body.appendChild(root)

new Vue({
  render:(h)=>h(App)
}).$mount(root)