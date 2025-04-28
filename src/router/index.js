import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/components/HomeView.vue';
import SignUp from '@/components/SignUp.vue';
import AboutView from '@/views/AboutView.vue';
import BoardHome from '@/components/BoardHome.vue';
import BoardPage from '@/components/BoardPage.vue'; 

const routes = [
    {
        path: '/standardBoard',
        name: 'HomeView',
        component: HomeView
    },
    {
        path: '/signup',
        name: 'SignUp',
        component: SignUp
    },
    {
        path: '/about',
        name: 'AboutView',
        component: AboutView
    },
    {
        path: '/',
        name: 'BoardHome',
        component: BoardHome
    },
    {
        path: '/board/:id',
        name: 'BoardPage',
        component: BoardPage,
        props: true
      }
   
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router
