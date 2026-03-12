import { createApp } from 'vue'
import './style.css' // Make sure this points to your Tailwind CSS file
import App from './App.vue'
import router from './router' // We will create this next

const app = createApp(App)

// Use the router
app.use(router)

// Mount the app to the DOM
app.mount('#app')