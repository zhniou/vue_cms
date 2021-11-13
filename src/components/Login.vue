<template>
<div class="login_container">
  <div class="login_box">
    <!-- 头像区域 -->
    <div class="avator_box">
      <img src="../assets/logo.png" alt="">
    </div>

   <!-- from表单区域 -->
 <el-form class="login_from" :model="loginForm" :rules="loginFormRules" ref="loginFormRef">
  <el-form-item prop="username">
    <el-input  v-model="loginForm.username" prefix-icon="iconfont icon-users"></el-input>
  </el-form-item>
  <el-form-item prop="password">
    <el-input v-model="loginForm.password" type="password" prefix-icon="iconfont icon-Password"></el-input>
  </el-form-item>

  <!-- 按钮区域 -->
  <el-form-item  class="from_btn">
      <el-button type="primary" @click="login">登录</el-button>
       <el-button type="info" @click="resetForm">重置</el-button>
  </el-form-item>
 </el-form>
  </div>
</div>
</template>

<script>
export default {
  data () {
    return {
      // 表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      // 表单的验证规则对象
      loginFormRules: {
        username: [
          { required: true, message: '请输入登录名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 表单重置
    resetForm () {
      this.$refs.loginFormRef.resetFields()
    },
    // 表单预验证
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) {
          return false
        }
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) {
          return this.$message.error('登录失败')
        }
        this.$message.success('登录成功')
        // 登录成功之后将token序列保存到sessionStorage
        window.sessionStorage.setItem('token', res.data.token)
        // 登录成功进行页面的跳转
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
  .login_box{
    height: 300px;
    width: 450px;
    background-color: #fff;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    // 头像区域
    .avator_box{
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      position: absolute;
      left: 50%;
      transform: translate(-50%,-50%);
      background-color: #fff;
      box-sizing: border-box;
      img{
        height: 100%;
        width: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
.login_from{
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
.from_btn{
  display: flex;
  justify-content: flex-end;
}
</style>
