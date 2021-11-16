<template>
  <div>
    <!-- 面包屑导航区域 -->
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>用户管理</el-breadcrumb-item>
  <el-breadcrumb-item>用户列表</el-breadcrumb-item>
</el-breadcrumb>

     <!-- 卡片视图 -->
<el-card class="box-card">
  <el-row :gutter=20>
     <!-- 搜索与添加区域 -->
    <el-col :span="9">
       <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserInfo">
        <el-button slot="append" icon="el-icon-search" @click="getUserInfo"></el-button>
       </el-input>
    </el-col>
    <!-- 添加用户按钮 -->
    <el-col :span="4">
      <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
    </el-col>
  </el-row>

    <!-- 表格区域 -->
    <el-table :data="userList" stripe border>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="姓名" prop="username"></el-table-column>
      <el-table-column label="邮箱" prop="email"></el-table-column>
      <el-table-column label="电话" prop="mobile"></el-table-column>
      <el-table-column label="角色" prop="role_name"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.mg_state" @change="userStatusChange(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px">
        <template slot-scope="scope">
          <!-- 修改按钮 -->
          <el-button @click="showEditDialog(scope.row.id)" type="primary" size="mini" icon="el-icon-edit"></el-button>
          <!-- 删除按钮 -->
          <el-button @click="removeUser(scope.row.id)" type="danger" size="mini" icon="el-icon-delete"></el-button>
          <!-- 分配角色按钮 -->
          <el-tooltip effect="dark" content="分配角色"  placement="top" :enterable="false">
           <el-button type="warning" size="mini" icon="el-icon-setting" @click="showsetRolesDialog(scope.row)"></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部分页区域 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 3, 4]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="dialogClose">
    <!-- 主体信息 -->
    <el-form ref="userFromRef" :rules="addUserFormrules" :model="addUserFrom" label-width="80px">
     <el-form-item label="用户名称" prop="username">
      <el-input v-model="addUserFrom.username"></el-input>
    </el-form-item>
     <el-form-item label="密码" prop="password">
      <el-input v-model="addUserFrom.password"></el-input>
    </el-form-item>
     <el-form-item label="邮箱" prop="email">
      <el-input v-model="addUserFrom.email"></el-input>
    </el-form-item>
     <el-form-item label="电话" prop="mobile">
      <el-input v-model="addUserFrom.mobile"></el-input>
    </el-form-item>
    </el-form>
    <!-- 底部按钮 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUser" >确 定</el-button>
  </span>
    </el-dialog>

    <!-- 修改用户信息对话框 -->
  <el-dialog title="修改信息" :visible.sync="editDialogVisible" width="50%" @close="editUserDialogClose">
   <el-form ref="editUserFromRef" :rules="editUserFormRules" :model="editUserForm" label-width="70px">
    <el-form-item label="姓名">
     <el-input v-model="editUserForm.username" disabled></el-input>
    </el-form-item>
    <el-form-item label="邮箱"  prop="email">
     <el-input v-model="editUserForm.email"></el-input>
    </el-form-item>
    <el-form-item label="手机" prop="mobile">
     <el-input v-model="editUserForm.mobile" ></el-input>
    </el-form-item>
   </el-form>
   <span slot="footer" class="dialog-footer">
    <el-button @click="editDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUser">确 定</el-button>
   </span>
  </el-dialog>

    <!-- 分配角色对话框 -->
  <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" width="50%" @close="setRoleDialogClosed">
    <p>当前的用户：{{userInfo.username}}</p>
    <p>当前的角色：{{userInfo.role_name}}</p>
    <p>分配新角色：
    <el-select v-model="selectedRoleId" placeholder="请选择">
       <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
     </el-option>
    </el-select>
    </p>
    <span slot="footer" class="dialog-footer">
    <el-button @click="setRoleDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    // 校验邮箱的规则
    var checkEmail = (rule, value, callback) => {
      const regEmail = /^[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*@[a-zA-Z0-9]+([-_.][a-zA-Z0-9]+)*\.[a-z]{2,}$/
      if (regEmail.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法邮箱'))
    }
    // 校验手机规则
    var checkMobile = (rule, value, callback) => {
      const regMobile = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
      if (regMobile.test(value)) {
        return callback()
      }
      callback(new Error('请输入合法的手机号'))
    }
    return {
      // 请求数据的参数
      queryInfo: {
        query: '',
        // 当前的页数
        pagenum: 1,
        // 每页显示的数据
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 控制添加用户对话框是否可见
      addDialogVisible: false,
      // 控制修改用户信息对话框是否可见
      editDialogVisible: false,
      // 控制分配角色对话框是否显示
      setRoleDialogVisible: false,
      // 添加用户表单
      addUserFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 查询用户表单
      editUserForm: {},
      // 角色列表
      rolesList: [],
      // 需要被分配角色的用户
      userInfo: {},

      selectedRoleId: {},
      // 添加用户表单验证对象
      addUserFormrules: {
        username: [
          { required: true, message: '请输入名称', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },
      // 修改用户表单验证对象
      editUserFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入电话', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      const { data: res } = await this.$http.get('users', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.userList = res.data.users
      this.total = res.data.total
    },
    // 监听pagesize事件
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getUserInfo()
    },
    // 监听 页码值 变化
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getUserInfo()
    },
    // 监听状态改变事件
    async userStatusChange (userinfo) {
      const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
      console.log(res)
      if (res.meta.status !== 200) {
        userinfo.mg_status = !userinfo.mg_status
        return this.$message.error('更新用户状态失败！')
      }
      this.$message.success('更新用户状态成功！')
    },
    // 监听添加用户对话框关闭
    dialogClose () {
      this.$refs.userFromRef.resetFields()
    },
    // 监听用户编辑对话框关闭
    editUserDialogClose () {
      this.$refs.editUserFromRef.resetFields()
    },
    // 监控编辑用户对话框
    async showEditDialog (id) {
      this.editDialogVisible = true
      // 查询用户信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      console.log(res.data)
      this.editUserForm = res.data
    },
    // 点击添加用户确定按钮 表单预验证 添加用户
    addUser () {
      this.$refs.userFromRef.validate(async vaild => {
        // 表单验证不通过
        if (!vaild) return
        // 表单验证通过，可以发起添加用户请求
        const { data: res } = await this.$http.post('users', this.addUserFrom)
        if (res.meta.status !== 201) {
          return this.$message.error('添加管理员失败')
        }
        this.$message.success('添加管理员成功！')
        // 隐藏添加用户对话框
        this.addDialogVisible = false
        // 重新获取用户列表数据
        this.getUserInfo()
      })
    },
    // 编辑用户信息 表单预验证 编辑用户信息
    editUser () {
      // 表单预验证
      this.$refs.editUserFromRef.validate(async (valid) => {
        if (!valid) return
        // 表单预验证通过，发起编辑用户的请求
        const { data: res } = await this.$http.put('users/' + this.editUserForm.id, { email: this.editUserForm.email, mobile: this.editUserForm.mobile })
        if (res.meta.status !== 200) {
          return this.$message.error('更新用户信息失败！')
        }
        // 关闭编辑用户信息对话框
        this.editDialogVisible = false
        // 重新渲染页面
        this.getUserInfo()
        this.$message.success('更新用户信息成功！')
      })
    },
    // 删除用户
    async removeUser (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'cancel') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('user/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('删除用户失败')
      }
      // 刷新数据列表
      this.getUserInfo()
      this.$message.success('已删除该用户')
    },
    // 监控分配角色按钮
    async showsetRolesDialog (userInfo) {
      this.userInfo = userInfo
      this.setRoleDialogVisible = true
      // 获取角色列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败！')
      }
      this.rolesList = res.data
    },
    // 点击按钮 分配角色
    async saveRoleInfo () {
      console.log(this.selectedRoleId)
      if (!this.selectedRoleId) {
        return this.$message.error('请选择分配的角色！')
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId
        }
      )
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败！')
      }

      this.$message.success('更新角色成功！')
      // 重新渲染页面
      this.getUserInfo()
      this.setRoleDialogVisible = false
    },
    // 关闭分配角色的对话框 重置 也就是将当前选择项清空 不然下次打开这个对话框还是选择的这个
    setRoleDialogClosed () {
      this.selectedRoleId = ''
      this.userInfo = {}
    }
  },
  created () {
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.el-breadcrumb{
  margin-bottom: 15px;
}
.el-card{
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15) !important;
}
.el-table{
  margin-top: 15px;
  font-size: 12px;
}
.el-pagination{
  margin-top: 15px;
}
</style>
