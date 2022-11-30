// import { createApp } from 'vue'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

import './assets/main.css'

const app = createApp({
  ...App
  // methods: {
  //   log: function (data) {
  //     console.log(data);
  //   }
  // }
})
app.use(router)

app.mount('#app')

