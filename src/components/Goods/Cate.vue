<template>
  <div>
    <!--面包屑导航区域-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图区域-->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!--  表格区域-->
      <tree-table :columns="cateColumns" :data="cateList"
                  :expand-type="false"
                  :selection-type="false"
                  :show-index="true"
                  :show-row-hover="true"
                  border
                  class="tree-table"
                  index-text="#">
        <!-- 第一个模板: 是否有效-->
        <template slot="isOk" slot-scope="scope">
          <i v-if="scope.row.cat_deleted === false"
             class="el-icon-success"
             style="color: lightgreen"></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>

        <!-- 第二个模板: 排序-->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
          <el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
          <el-tag v-else size="mini" type="warning">三级</el-tag>
        </template>

        <!-- 第二个模板: 操作-->
        <template slot="opt" slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="showEditDialog(scope.row.cat_id)">编辑
          </el-button>
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeCateById(scope.row.cat_id)">删除
          </el-button>
        </template>
      </tree-table>

      <!--  分页区域-->
      <el-pagination
        :current-page="this.queryInfo.pagenum"
        :page-size="this.queryInfo.pagesize"
        :page-sizes="[3,5,10,15]"
        :total="this.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange">
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog :visible.sync="addCateDialogVisible" title="添加分类" @close="addCateDialogClosed">
      <el-form ref="addCateFormRef" :model="addCateForm" label-width="100px">
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类: ">
          <!-- options 用来指定数据源
          cascadeProps 用来指定配置对象
          -->
          <el-cascader
            v-model="selectedKeys"
            :change-on-select="true"
            :options="parentCateList"
            :props="cascadeProps"
            clearable
            @change="parentCateChanged"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 修改分类的对话框 -->
    <el-dialog title="修改分类" :visible.sync="editCateDialogVisible" @close="editCateDialogClose" width="50%">
     <el-form ref="editCateRef" :model="editCateForm" :rules="editCateFormRules" label-width="80px">
      <el-form-item label="活动名称" prop="cat_name">
       <el-input v-model="editCateForm.cat_name"></el-input>
     </el-form-item>
   </el-form>
  <!-- 底部按钮 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="editCateDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="editCate">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
  name: 'Cate',
  data () {
    return {
      // 查询条件
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      // 商品分类的数据列表, 默认为空
      cateList: [],
      // 总数据条数
      total: 0,
      // 为table指定列的定义
      cateColumns: [
        {
          label: '分类名称',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          // 表示, 将当前列定义为模板列
          type: 'template',
          // 表示当前列使用模板名称
          template: 'isOk'
        },
        {
          label: '排序',
          // 表示, 将当前列定义为模板列
          type: 'template',
          // 表示当前列使用模板名称
          template: 'order'
        },
        {
          label: '操作',
          // 表示, 将当前列定义为模板列
          type: 'template',
          // 表示当前列使用模板名称
          template: 'opt'
        }
      ],
      // 控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单数据对象
      addCateForm: {
        // 将要添加的分类的名称
        cat_name: '',
        // 父级分类的Id
        cat_pid: 0,
        // 分类的等级, 默认要添加的是一级分类
        cat_level: 0
      },
      // 添加分类表单的校验规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 编辑分类表单的校验规则对象
      editCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' }
        ]
      },
      // 父级分类的列表
      parentCateList: [],
      // 指定级联选择器的配置对象
      cascadeProps: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children',
        // 从el-cascader标签的属性,中移动到这个cascadeProps中
        expandTrigger: 'hover'
      },
      // 选中的父级分类的Id数组
      selectedKeys: [],
      // 控制修改分类对话框的显示与隐藏
      editCateDialogVisible: false,
      // 修改分类的表单数据对象
      editCateForm: {}
    }
  },
  created () {
    this.getCateList()
  },
  methods: {
    // 获取所有商品分类
    async getCateList () {
      const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败!')
      } else {
        // 把数据列表, 赋值给cateList
        this.cateList = res.data.result
        // 为总数据条数赋值
        this.total = res.data.total
      }
    },
    //  监听pagesize改变
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getCateList()
    },
    //  监听pagenum改变
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getCateList()
    },
    //  点击按钮, 展示
    showAddCateDialog () {
      // 先获取父级分类的数据列表
      this.getParentCateList()
      // 再展示出对话框
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList () {
      // type : 2 表示实现两层的分类列表
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取父级数据失败!')
      }
      this.parentCateList = res.data
    },
    // 选择项发生变化触发这个函数
    parentCateChanged () {
      // 如果 selectedKeys数组中的length 大于 0, 证明选中的父级分类
      // 反之, 就说明没有选中任何父级分类
      if (this.selectedKeys.length > 0) {
        // 父级分类的Id
        this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = this.selectedKeys.length
      } else {
        // 父级分类的Id
        this.addCateForm.cat_pid = 0
        // 为当前分类的等级赋值
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮, 添加新的分类
    async addCate () {
      this.$refs.addCateFormRef.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('categories', this.addCateForm)

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        } else {
          this.addCateDialogVisible = false
          this.getCateList()
          this.$message.success('添加分类成功')
        }
      })
    },
    // 监听添加分类对话框的关闭事件, 重置表单数据
    addCateDialogClosed () {
      this.$refs.addCateFormRef.resetFields()
      // 重置下拉框和表单里面的数据
      this.selectedKeys = []
      this.addCateForm.cat_level = 0
      this.addCateForm.cat_pid = 0
    },
    // 监听编辑按钮
    async showEditDialog (id) {
      this.editCateDialogVisible = true
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取分类名称失败！')
      }
      this.editCateForm = res.data
    },
    // 确定按钮 提交编辑分类
    editCate () {
      this.$refs.editCateRef.validate(async valid => {
        // 如果校验不通过
        if (!valid) return
        // 校验通过 发起请求
        const { data: res } = await this.$http.put(`categories/${this.editCateForm.cat_id}`, {
          cat_name: this.editCateForm.cat_name
        })
        if (res.meta.status !== 200) {
          return this.$message.error('更新分类失败！')
        }
        // 重新渲染页面
        this.getCateList()
        // 关闭编辑分类对话框
        this.editCateDialogVisible = false
        return this.$message.success('更新分类成功！')
      })
    },
    // 展现编辑对话框的显示与隐藏
    editCateDialogClose () {
      this.$refs.editCateRef.resetFields()
    },
    // 根据id删除分类
    async removeCateById (id) {
      const result = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (result !== 'confirm') {
        return this.$message.info('已取消删除!')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除失败！')
      }
      this.$message.success('成功删除该分类！')
      // 重新渲染页面
      this.getCateList()
    }
  }
}
</script>

<style lang="less" scoped>
.tree-table {
  margin-top: 15px;
  font-size: 13px;
}
.el-cascader {
  width: 100%;
}

</style>
