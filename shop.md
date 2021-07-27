#基于vue的网上商城系统#
##一、环境的配置
###此系统主要涉及的是前端，所以需要使用node模拟后端，后期springboot完善后端
###首先需要初始化一个前端项目，npm安装需要的包，这里用的技术主要由路由，axios，mysql,node.js（后两者属于后端，需要初始化）。初始化项目后，代码需要托管到github
[netshop](https://github.com/xiaowangbaba/netshop)
###之后初始化数据库，这里已经给出只需执行一次，建立netshop数据库，在给出node后台文件夹中，安装所需要的的依赖，然后执行node app.js，根据后台接口文档中的接口信息进行postman接口测试
![]('pm1.png')
<br>
##二、登录实现
###<font color=#FF0000>注意在每实现一个功能之前，需要创建一个分支，最后完成功能时将创建的分支提交到master这里登录分支为git checkout -b login创建了一个login分支</font>
###登录业务的技术点：http无状态的，通过cookie,session或者token方式维持状态，推荐后者，token使用id,时间戳和签名机制，由应用管理，不受跨域影响，而前者请求的接口与源地址需在同一域下。
###登录界面需要因引入element-ui库，安装好后，通过以下方式引入
	import ElementUi from 'element-ui'
	import 'element-ui/lib/theme-chalk/index.css'//element-ui样式组件
	Vue.use(ElementUi)//使所有<el></el>标签能被解析
###通过查看https://element.eleme.cn/#/zh-CN/component/button官网可以看见每种样式的引用方式，可直接复制进行更改，这里登录页面需要用form表单进行引用同时需要button。对于图标的使用可以使用element-ui组件的图标，如果所需要的没有，可以导入阿里的第三方图标库iconfont。
	  <el-form label-width="0px" class="login_form"  :model="loginform" :rules="loginrules" >
	         <!--input部分><!-->
	        <el-form-item prop="username">
	          <el-input prefix-icon="iconfont icon-user" v-model="loginform.username"></el-input>
	        </el-form-item>
	        <el-form-item  prop="password">
	          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginform.password" type="password"></el-input>
	        </el-form-item>
	         <!--button部分><!-->
	        <el-form-item class="btns">
	          <el-button type="primary">登录</el-button>
	          <el-button type="info">重置</el-button>
	        </el-form-item>
	      </el-form>
    export default{
    name:'login',
    data(){
      return{
        loginform:{
          username:'',
          password:''
        },
        loginrules:{
          username:[
            { required:true, message: '请输入用户名', trigger: 'blur' },
            { min:3, max:10, message: '长度在 3 到 10 个字符', trigger: 'blur' }],
          password:[
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min:6, max:15, message: '长度在 6 到 15 个字符', trigger: 'blur' }]
        }
      }
###:model="loginform"表单数据的双向绑定，:rules="loginrules"输入框验证规则，注意需要在<el-form-item prop="username">引入要验证的属性。
###表单的重置
###对重置按钮进行事件绑定，在element-ui中表单实例有个resetFields()函数实现重置，所以需要获取表单的实例，通过ref来绑定一个属性，通过this进行引用。
    <el-button type="info" @click="loginresets">重置</el-button>
     <el-form  ref="loginref" label-width="0px" class="login_form"  :model="loginform" :rules="loginrules" >
    methods:{
      loginresets(){
        console.log(this);
        this.$refs.loginref.resetFields();
      }
    }
![]('pm2.png')
###可发现this指向当前vue实例，里面有个$refs属性值为loginref,这个就是当前表单的实例
###添加路由导航和拦截器，前者是路由跳转时判断是否登录，后置是请求后台时是否携带token，在index.js中添加导航，在main.js中添加拦截器
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
	//拦截器访问后台时必须携带token与路由导航不同，路由导航是在跳转时进行判断
	axios.interceptors.request.use(config=>{
	  config.headers.Authorization=window.sessionStorage.getItem('token');
	  return config;
	})
###登录界面完成后，需要在github更新代码。本地分支为login，执行git add .将项目放到本地login分支中，然后git commit -m "login"提交到login中，git checkout切换到本地mater，git merge login合并分支，然后git push origin master推到远程主分支更新。