<template>
<div>
<!-- 面包屑区域 -->
<el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>权限管理</el-breadcrumb-item>
  <el-breadcrumb-item>角色列表</el-breadcrumb-item>
</el-breadcrumb>

<!-- 卡片区域 -->
<el-card>
  <!-- 添加角色按钮 -->
    <el-button type="primary" @click="showAddRolesDialog">添加用户</el-button>

  <!-- 角色列表区域 -->
  <el-table :data="RolesList" border stripe>
    <!-- 展开列 -->
    <el-table-column type="expand">
      <template slot-scope="scope">
        <el-row :class="['bd_buttom','vcenter',index1===0?'bd_top':'']" v-for="(item1,index1) in scope.row.children" :key="item1.id">
          <!-- 一级权限 -->
          <el-col :span="5">
            <el-tag  @close="removeRolesById(scope.row,item1.id)" closable >{{item1.authName}}</el-tag>
            <i class="el-icon-caret-right"></i>
          </el-col>

          <!-- 二级权限 -->
          <el-col :span="19">
           <el-row :class="[index2===0?'':'bd_top','vcenter']" v-for="(item2,index2) in item1.children" :key="item2.id">
             <el-col :span="6">
               <el-tag type="success"  @close="removeRolesById(scope.row,item2.id)" closable >{{item2.authName}}</el-tag>
               <i class="el-icon-caret-right"></i>
             </el-col>
             <!-- 三级权限 -->
             <el-col :span="18">
                <el-tag type="warning" @close="removeRolesById(scope.row,item3.id)" closable v-for="item3 in item2.children" :key="item3.id">{{item3.authName}}</el-tag>
             </el-col>
           </el-row>
          </el-col>
        </el-row>

      </template>
    </el-table-column>
    <!-- 索引列 -->
    <el-table-column type="index"></el-table-column>
    <el-table-column label="角色名称" prop="roleName"></el-table-column>
    <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
    <el-table-column label="操作" width="300px">
      <template slot-scope="scope">
        <el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeRoles(scope.row.id)">删除</el-button>
        <el-button size="mini" type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">修改权限</el-button>
      </template>
    </el-table-column>
  </el-table>
</el-card>

  <!-- 添加角色对话框 -->
   <el-dialog title="添加角色" @close="addRolesDialogClose" :visible.sync="addRolesDialogVisible" width="50%">
    <el-form ref="addRolesFormRef" :rules="addRolesRules" :model="addRolesFromList" label-width="80px">
     <el-form-item label="角色名称"  prop="roleName">
      <el-input v-model="addRolesFromList.roleName"></el-input>
     </el-form-item>
     <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="addRolesFromList.roleDesc"></el-input>
     </el-form-item>
  </el-form>
  <!-- 底部按钮区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="addRoles">确 定</el-button>
  </span>
</el-dialog>

  <!-- 编辑角色对话框 -->
     <el-dialog title="编辑角色" @close="editRolesDialogClose" :visible.sync="editRolesDialogVisible" width="50%">
    <el-form ref="editRolesFormRef" :rules="editRolesRules" :model="editRolesList" label-width="80px">
     <el-form-item label="角色名称"  prop="roleName">
      <el-input v-model="editRolesList.roleName"></el-input>
     </el-form-item>
     <el-form-item label="角色描述" prop="roleDesc">
      <el-input v-model="editRolesList.roleDesc"></el-input>
     </el-form-item>
  </el-form>
  <!-- 底部按钮区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="editRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editRoles">确 定</el-button>
  </span>
</el-dialog>

  <!-- 分配权限对话框 -->
   <el-dialog title="提示" :visible.sync="setRightDialogVisible" @close="setRightDialogClose" width="50%">
   <!-- 树形空间 -->
  <el-tree :data="rightsList" :props="rightsTreeProps" show-checkbox node-key='id' default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>

  <!-- 底部按钮 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRightDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>

</div>
</template>
<script>
export default {
  data () {
    return {
      RolesList: [],
      // 控制添加角色对话框是否
      addRolesDialogVisible: false,
      // 控制编辑角色对话框是否可见
      editRolesDialogVisible: false,
      // 控制分配角色对话框是是否可见
      setRightDialogVisible: false,
      // 添加角色列表
      addRolesFromList: {
        roleName: '',
        roleDesc: ''
      },
      // 编辑角色列表
      editRolesList: {},
      // 添加角色表单预验证
      addRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      },
      // 权限列表
      rightsList: [],
      // 默认展开节点的数组
      defKeys: [],
      // 当前即将分配权限的角色
      roleId: '',
      rightsTreeProps: {
        // 展示的数据
        label: 'authName',
        // 子节点
        children: 'children'

      },
      // 编辑表单验证
      editRolesRules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'blur' }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 获取角色列表
    async getRolesList () {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('请求角色列表失败！')
      }
      this.RolesList = res.data
    },
    // 监听关闭添加角色对话框
    addRolesDialogClose () {
      this.$refs.addRolesFormRef.resetFields()
    },
    // 监听关闭编辑角色对话框
    editRolesDialogClose () {
      this.$refs.editRolesFormRef.resetFields()
    },
    // 监听添加角色按钮
    showAddRolesDialog () {
      this.addRolesDialogVisible = true
    },
    // 添加角色 表单预验证
    addRoles () {
      this.$refs.addRolesFormRef.validate(async valid => {
        // 表单预验证不通过
        if (!valid) return
        // 表单预验证通过 可以发起请求
        const { data: res } = await this.$http.post('roles', this.addRolesFromList)
        if (res.meta.status !== 201) {
          return this.$message.error('添加角色失败！')
        }
        // 重新渲染页面
        this.getRolesList()
        // 关闭添加角色对话框
        this.addRolesDialogVisible = false
        this.$message.success('添加角色成功！')
      })
    },
    // 监控编辑角色按钮
    async showEditDialog (id) {
      this.editRolesDialogVisible = true
      // 查询用户信息
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败！')
      }
      this.editRolesList = res.data
    },
    // 编辑角色
    editRoles () {
      // 编辑表单预校验
      this.$refs.editRolesFormRef.validate(async valid => {
        // 表单预验证不通过
        if (!valid) return
        // 表单验证通过 发起编辑用户请求
        const { data: res } = await this.$http.put('roles/' + this.editRolesList.roleId, { id: this.editRolesList.roleId, roleName: this.editRolesList.roleName, roleDesc: this.editRolesList.roleDesc })

        if (res.meta.status !== 200) {
          return this.$message.error('更新角色失败！')
        }
        // 关闭编辑角色对话框
        this.editRolesDialogVisible = false
        //  重新渲染页面
        this.getRolesList()
        this.$message.success('更新角色成功！')
      })
    },
    // 删除角色
    async removeRoles (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult === 'cancel') {
        return this.$message.info('已取消删除')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        this.$message.error('删除用户失败')
      }
      // 刷新数据列表
      this.getRolesList()
      this.$message.success('已删除该用户')
    },
    // 通过id移除删除角色指定权限
    async removeRolesById (role, rightsId) {
      // 消息框弹出
      const Result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (Result !== 'confirm') {
        return this.$message.info('已取消删除')
      }
      // 发起删除请求
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightsId}`)
      if (res.meta.status !== 200) {
        return this.$message.success('成功删除！')
      }
      // 不用全部重新渲染页面 修改当前角色的内容
      role.children = res.data
    },
    // 监听分配权限按钮
    async showSetRightDialog (role) {
      this.roleId = role.id
      // 获取所有权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('请求权限数据失败')
      }
      this.rightsList = res.data
      // 递归获取三级节点的Id并保存到defKeys数组中  这样一打开分配对话框就会把数组里的id给勾选上 关闭还要把数组清空 要不然下次打开会累加
      this.getLeafKeys(role, this.defKeys)
      this.setRightDialogVisible = true
    },
    // 通过递归的形式，获取角色下所有三级权限的id，并保存到arr数组中 使得一打开分配列表就会将他们勾选上
    getLeafKeys (node, arr) {
      // 如果当前 node 节点不包含 children 属性，则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }

      // 不是三级节点 递归调用
      node.children.forEach(item => this.getLeafKeys(item, arr))
    },
    // 监听关闭权限分配对话框
    setRightDialogClose () {
      this.defKeys = []
    },
    // 分配权限
    async allotRights () {
      // 得到勾选的权限id
      const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedKeys()]
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配权限失败')
      }
      // 重新渲染页面
      this.getRolesList()
      this.setRightDialogVisible = false
      this.$message.success('分配权限成功！')
    }
  },
  created () {
    this.getRolesList()
  }
}
</script>

<style lang="less" scoped>

.el-tag{
 margin: 10px;
 margin-left: 30px;
}
.bd_top{
  border-top: 1px solid #eee;
}
.bd_buttom{
  border-top: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>
