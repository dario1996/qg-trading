import "bootstrap/dist/css/bootstrap.min.css"
import { createApp } from 'vue'
import {createRouter, createWebHistory} from 'vue-router'
import OperationsSummary from './components/OperationsSummary.vue';
import AddOperation from './components/AddOperation.vue';
import OperationDetails from './components/OperationDetails.vue';
import HomeDashboard from './components/HomeDashboard.vue';
import EditOperation from './components/EditOperation.vue';
import App from './App.vue'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {path: '/', redirect: '/dashboard'},
        {path: '/dashboard', component: HomeDashboard},
        {path: '/operation/add', component: AddOperation},
        {path: '/operations', component: OperationsSummary},
        {path: '/operation/details/:id', name: 'Detail', component: OperationDetails, props: true},
        {path: '/operation/edit/:id', name: 'Edit', component: EditOperation, props: true}
    ]
})
const app = createApp(App);

app.use(router);

app.mount('#app');
//import "boostrap/dist/js/bootstrap.js";