<template>
  <div>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>

  <el-card class="box-card">
       <el-row :gutter="20">
         <el-col :span="7">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
         </el-input>
         </el-col>
         <el-col :span="4">
           <el-button type="primary">添加用户</el-button>
         </el-col>
       </el-row>
       <el-table
             :data="userlist"
             style="width: 100%" border stripe>
             <el-table-column type="index"></el-table-column>
             <el-table-column
               prop="username"
               label="姓名"
                >
             </el-table-column>
             <el-table-column
               prop="role_name"
               label="角色"
                >
             </el-table-column>
             <el-table-column
               prop="mobile"
               label="电话"
                >
             </el-table-column>
             <el-table-column
               prop="email"
               label="邮箱"
                >
             </el-table-column>
              <el-table-column
               prop="mg_state"
               label="状态"
               >
               <template slot-scope="scope" >
                 <el-switch v-model="scope.row.mg_state"></el-switch>
               </template>
             </el-table-column>
             <el-table-column
               label="操作"
               width="180px"
              >
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                 <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                 <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" size="mini"></el-button></el-tooltip>
              </template>
             </el-table-column>
        </el-table>
  </el-card>
  </div>
</template>

<script>
  export default {
   data(){
     return{
       parmlist:{
         query:'',
         pagenum:1,
         pagesize:2
       },
       userlist:[],
       total:0
     }
   },
   created(){
     this.getuserlist();
   },
   methods:{
     async getuserlist(){
       const res=await this.$http.get('users',
       {
         params:this.parmlist,
         })
       if(res.data.meta.status !==200)
       return this.$message.error("getuserlist is failed");
       this.userlist=res.data.data.users;
       this.total=res.data.data.total;
       console.log(res);
     }
   }

  }
</script>

<style>
</style>
