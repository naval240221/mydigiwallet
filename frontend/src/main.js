import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import router from './router'


// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import TableLite from 'vue3-table-lite';

const vuetify = createVuetify({
    components,
    directives,
})

createApp(App).component('tabledata', TableLite).use(vuetify).use(router).mount('#app')