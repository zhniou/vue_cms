<template>
  <div>
    <!-- 面包屑区域 -->
   <el-breadcrumb separator="/">
   <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
   <el-breadcrumb-item>权限管理</el-breadcrumb-item>
   <el-breadcrumb-item>权限列表</el-breadcrumb-item>
   </el-breadcrumb>

   <!-- 卡片视图区域 -->
   <el-card >
     <el-table :data="RightLits" style="width: 100%" border stripe>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.level=='0'">一级</el-tag>
          <el-tag v-else-if="scope.row.level=='1'" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
      </el-table-column>
    </el-table>
   </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      RightLits: []
    }
  },
  methods: {
    // 获取权限列表
    async getPowerList () {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.RightLits = res.data
    }
  },
  created () {
    this.getPowerList()
  }
}
</script>

<style lang="less" scoped>
.el-card{
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15) !important;
}
</style>
