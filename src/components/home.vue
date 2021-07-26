<template>
   <div>
     首页
     <el-button type="info" @click="loginout">loginout</el-button>
   </div>
</template>

<script>
  export default{
    name:'home',
    methods:{
      loginout(){
        window.sessionStorage.clear();
        this.$router.push('login');
      }
    }
  }
</script>

<style>
</style>
