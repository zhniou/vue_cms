<template>
  <div>
  <!-- 面包屑区域 -->
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>商品列表</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <el-row :gutter="20">
      <el-col :span="8">
       <el-input placeholder="请输入内容" v-model="queryInfo.query" class="input-with-select" clearable>
       <el-button slot="append" icon="el-icon-search" @click="searchGoods"></el-button>
       </el-input>
      </el-col>
      <el-col :span="4">
        <el-button type="primary" @click="goAddPage">添家商品</el-button>
      </el-col>
    </el-row>

    <!-- 表格区域 -->
    <el-table :data="googsList" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="商品名称" prop="goods_name"></el-table-column>
      <el-table-column label="商品价格（元）" prop="goods_price" width="90px"></el-table-column>
      <el-table-column label="商品重量" prop="goods_weight" width="80px"></el-table-column>
      <el-table-column label="创建时间" prop="add_time" width="170px">
        <template slot-scope="scope">
          {{scope.row.add_time|dataFormat}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="190px">
        <template slot-scope="scope">
         <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
         <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeGoods(scope.row.goods_id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 20, 30]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 请求商品参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      googsList: []
    }
  },
  methods: {
    // 获取商品列表
    async getGoodsList () {
      const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message('获取商品数据失败！')
      }

      this.googsList = res.data.goods
      this.total = res.data.total
    },
    // pageSize 改变时会触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getGoodsList()
    },
    // currentPage 改变时会触发
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getGoodsList()
    },
    // 根据id查询商品
    searchGoods () {
      this.getGoodsList()
    },
    // 删除商品
    async removeGoods (goodsId) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)

      if (result !== 'confirm') {
        return this.$message.info('已取消删除！')
      }

      const { data: res } = await this.$http.delete(`goods/${goodsId}`)

      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败！')
      }

      this.$message.success('删除商品成功！')
      this.getGoodsList()
    },
    // 前往添加商品页面
    goAddPage () {
      this.$router.push('/goods/add')
    }
  },
  created () {
    this.getGoodsList()
  }
}
</script>

<style lang="less" scoped>

</style>
