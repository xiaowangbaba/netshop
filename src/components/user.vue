<template>
  <div>
   <!--添加头部面包屑-->
  <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>用户列表</el-breadcrumb-item>
  </el-breadcrumb>
  <!--添加卡片容器，所有信息在这容器内显示-->
  <el-card class="box-card">
    <!--layout布局el-row添加一行。el-col添加列gutter指定列间距-->
	  <!-- 绑定用户点击查询事件,clearable表示可以清空，@clear是输入框事件，表示清空后需要的操作-->
       <el-row :gutter="20">
         <el-col :span="7">

          <el-input placeholder="请输入内容" v-model="parmlist.query" clearable @clear="getuserlist">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist" ></el-button>
         </el-input>
         </el-col>
         <el-col :span="4">
           <el-button type="primary" @click="adduser=true">添加用户</el-button>
         </el-col>
       </el-row>
       <!--table表格 data绑定数据-->
       <el-table
             :data="userlist"
             style="width: 100%" border stripe>
             <!--索引列-->
             <el-table-column type="index"></el-table-column>
             <!--通过props引用userlist中返回的属性名 label是列名称-->
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
             <!--这里状态是以按钮形式显示，所以需要转化一下，首先需要取到其值，通过模板插槽取到这一行的所有值，然后绑定这个状态值-->
              <el-table-column
               prop="mg_state"
               label="状态"
               >
               <!--模板插槽取这一行的值 el-switch开关-->
			    <!--el-switch开关更改用户状态写入数据库，监听scope.row.mg_state是否更改，提交到数据库中-->
               <template slot-scope="scope" >
                 <el-switch v-model="scope.row.mg_state" @change="userstagechange(scope.row)"></el-switch>
               </template>
             </el-table-column>
             <el-table-column
               label="操作"
               width="180px"
              >
              <!--同样的方法-->
              <template slot-scope="scope">
                <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                 <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                 <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                  <el-button type="warning" icon="el-icon-setting" size="mini"></el-button></el-tooltip>
              </template>
             </el-table-column>
        </el-table>
        <!--分页 @size-change监听页面大小的改变 @current-change监听当前页面的改变-->
         <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="parmlist.pagenum"
              :page-sizes="[1, 2, 3, 4]"
              :page-size="parmlist.pagesize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
  </el-card>
  <!--添加对话框，点击添加用户显示，默认绑定的adduser值为false,@close表单关闭进行重置-->
  <el-dialog
    title="添加用户"
    :visible.sync="adduser"
    width="50%" @close="resetform">
    <!--添加表单验证-->
   <el-form :model="addForm" :rules="addFormrules" ref="ruleFormref" label-width="100px"  >
     <el-form-item label="用户名" prop="username">
       <el-input v-model="addForm.username"></el-input>
     </el-form-item>
     <el-form-item label="密码" prop="password">
       <el-input v-model="addForm.password"></el-input>
     </el-form-item>
     <el-form-item label="邮箱" prop="email">
       <el-input v-model="addForm.email"></el-input>
     </el-form-item>
     <el-form-item label="电话" prop="mobile">
       <el-input v-model="addForm.mobile"></el-input>
     </el-form-item>
    <el-form-item >
      <el-button @click="resetform">重置</el-button>
    </el-form-item>
     </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="adduser = false">取 消</el-button>
      <el-button type="primary" @click="adduservaild">确 定</el-button>
    </span>
  </el-dialog>
  </div>
</template>

<script>
  export default {
   //自定义电话和邮箱校验规则通过addFormrules中的validator引用
   data(){
     var isregemobile=(ruler,value,cb)=>{
       const regemobile=/^[1][3,4,5,7,8][0-9]{9}$/;
       if(regemobile.test(value)){
         return cb();
       }
         cb(new Error('请输入合法的电话'));
     };
     var isregeemail=(ruler,value,cb)=>{
       const regeemail=/^([a-zA-Z0-9]+[-%|\._]?)+[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
       if(regeemail.test(value)){
         return cb();
       }
       cb(new Error('请输入合法的邮箱'));
     };
     return{
       parmlist:{
         query:'',
         pagenum:1,
         pagesize:2
       },
       userlist:[],
       total:0,
       adduser:false,
       addForm:{
         username:'',
         password:'',
         email:'',
         mobile:''
       },
       addFormrules:{
         username:[
           {required:true,message:'请输入用户名',trigger:'blur'},
           {min:3,max:10,message:'长度为3-10位',trigger:'blur'}
         ],
         password:[
           {required:true,message:'请输入密码',trigger:'blur'},
            {min:6,max:15,message:'长度为6-15位',trigger:'blur'}
         ],
         email:[
            {required:true,message:'请输入邮箱',trigger:'blur'},
            {validator:isregeemail,trigger:'blur'}
         ],
         mobile:[
            {required:true,message:'请输入点电话',trigger:'blur'},
            {validator: isregemobile,trigger:'blur'}
         ]
       }
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
     },
     handleSizeChange(newpagesize){
       this.parmlist.pagesize=newpagesize;
       this.getuserlist();
     },
     handleCurrentChange(newcurpage){
       this.parmlist.pagenum=newcurpage;
       this.getuserlist();
     },
     async userstagechange(userinfo){
       console.log(userinfo);
       const res= await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`);
	  if(res.data.meta.status!==200){
		  userinfo.mg_status=! userinfo.mg_status;
		  return this.$message.error("用户状态更改失败");
	  }
	  this.$message.success("用户状态更改成功");
     },
     resetform(){
       this.$refs.ruleFormref.resetFields();
     },
     adduservaild(){
       console.log(this);
       this.$refs.ruleFormref.validate(async vaild=>{
          if(!vaild) return;
          const {data:res}=await this.$http.post('users',this.addForm);
          console.log(res.meta.status);
          if(res.meta.status!==201)
           return this.$message.error('添加用户失败');
          this.$message.success('添加用户成功');
          this.adduser=false;
          this.getuserlist();
          console.log(res.data);
       })
     }

   }

  }
</script>

<style>
</style>
