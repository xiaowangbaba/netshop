import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
Vue.use(VueRouter)

const routes = [
   {
     path:'/',
     redirect:'/login'
   },
   {
     path:'/login',
     name:'login',
     component:login
   },
   {
     path:'/home',
     name:'home',
     component:home
   }
]
const router = new VueRouter({
  routes
})
router.beforeEach((to,from,next)=>{
  if(to.path=='/login')
    return next();
  const istoken=window.sessionStorage.getItem('token');
  if(!istoken){
    return next('/login');
  }
  next();
})
export default router
