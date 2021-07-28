import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import user from '../components/user.vue'
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
     component:home,
     redirect:'/welcome',
     children:[
       {
         path:'/welcome',
         component:welcome
       },
       {
         path:'/users',
         component:user
       }

       ]
   }
]
const router = new VueRouter({
  routes
})
//路由导航
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
