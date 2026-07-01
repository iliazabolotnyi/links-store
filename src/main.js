import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import '@/assets/styles/main.css'
import "primeicons/primeicons.css"
import { ToastService } from 'primevue';
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
    theme: {
        preset: Aura,
        options: {
          darkModeSelector: false
        }
    }
});

app.mount('#app')
app.use(ToastService)
