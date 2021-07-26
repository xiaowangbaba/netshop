<template>
  <div class="login_containor">
    <!--登录部分><!-->
    <div class="login_box">
      <!--头像部分><!-->
      <div class="img_box" >
       <img  src="../assets/logo.png" alt=""/>
      </div>
      <!--表单部分><!-->
      <el-form  ref="loginref" label-width="0px" class="login_form"  :model="loginform" :rules="loginrules" >
         <!--input部分><!-->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" v-model="loginform.username"></el-input>
        </el-form-item>
        <el-form-item  prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" v-model="loginform.password" type="password"></el-input>
        </el-form-item>
         <!--button部分><!-->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginvaild">登录</el-button>
          <el-button type="info" @click="loginresets">重置</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>

<script>
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
    },
    methods:{
      loginresets(){
        console.log(this);
        this.$refs.loginref.resetFields();
      },
      loginvaild(){
        this.$refs.loginref.validate(async vaild=>{
          if(!vaild) return;
          const res=await this.$http.post('login',this.loginform);
          console.log(res.data);
          if(res.data.meta.status!==200)
             this.$message.error("login failed");
           window.sessionStorage.setItem('token',res.data.data.token);
           this.$message.success("login success");
           this.$router.push('/home');

        });
      }
    }
  }
</script>

<style scoped>
 .login_containor{
   background-color:#F5F5DC;
   height: 100%;

 }
 .login_box{
   width: 500px;
   height: 300px;
   background-color: aliceblue;
   position: absolute;
   top: 50%;
   left: 50%;
   transform: translate(-50%,-50%);
 }
 .img_box{
    height: 130px;
    width: 130px;
    border-radius:50%;
    position:absolute;
    left:50%;
    transform:translate(-50%,-50%);
 }
 img{
   width: 100%;
   height: 100px;
   border-radius:50%;
   background-color:blueviolet;
 }
.btns{
  display: flex;
  justify-content: flex-end;
}
.login_form{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 50px;
  box-sizing: border-box;
}
</style>
