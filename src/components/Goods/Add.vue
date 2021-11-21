<template>
  <div>
  <!-- 面包屑区域 -->
  <el-breadcrumb separator="/">
  <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
  <el-breadcrumb-item>商品管理</el-breadcrumb-item>
  <el-breadcrumb-item>添加商品</el-breadcrumb-item>
  </el-breadcrumb>

  <!-- 卡片视图 -->
  <el-card>
    <!-- 消息提示 -->
    <el-alert
    title="添加商品信息"
    type="info"
    center
    :closable="false"
    show-icon>
  </el-alert>

    <!-- 步骤条 -->
    <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>
   <!-- Tab栏区域 -->
  <el-form :model="addForm" :rules="addRules" ref="addFormRef" label-width="100px" label-position="top">
  <el-tabs v-model="activeIndex" :tab-position="'left'" :before-leave="beforeTabLeave" @tab-click="TabClicked">
    <!-- tab栏第一页 基本信息 -->
    <el-tab-pane label="基本信息" name="0">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="addForm.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input v-model="addForm.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
        <el-input v-model="addForm.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input v-model="addForm.goods_number"></el-input>
      </el-form-item>
       <el-form-item label="商品分类" prop="goods_cat">
         <!-- 级联选择器 -->
        <el-cascader
         v-model="addForm.goods_cat"
         :options="CateList"
         :props="props"
         @change="handleChange"></el-cascader>
      </el-form-item>
    </el-tab-pane>

    <!-- tab栏第二页 参数信息 -->
    <el-tab-pane label="参数信息" name="1">
     <el-form-item :label="item.attr_name" v-for="item in manyTabData" :key="item.attr_id">
       <!-- 复选框组 -->
      <el-checkbox-group v-model="item.attr_vals">
      <el-checkbox :label="cb" v-for="(cb, i) in item.attr_vals" :key="i" border checked></el-checkbox>
      </el-checkbox-group>
     </el-form-item>
    </el-tab-pane>

    <!-- tab栏第三页 商品属性 -->
    <el-tab-pane label="商品属性" name="2">
      <el-form-item :label="item.attr_name" v-for="item in onlyTabData" :key="item.attr_id">
        <el-input v-model="item.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>

    <!-- tab栏第四页 商品图片 -->
    <el-tab-pane label="商品图片" name="3">
      <el-upload
       class="upload-demo"
       :action="uploadURL"
       :on-preview="handlePreview"
       :on-remove="handleRemove"
       :headers="headersObj"
       :on-success="handleSuccess"
       list-type="picture">
       <el-button size="small" type="primary">点击上传</el-button>
       </el-upload>
     </el-tab-pane>
     <!-- tab栏第四页 商品内容 -->
    <el-tab-pane label="商品内容" name="4">
      <!-- 富文本编辑器 -->
      <quill-editor
       ref="myQuillEditor"
       v-model="addForm.goods_introduce"
       ></quill-editor>
       <el-button class="add" type="primary" @click="add">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
  </el-form>
  </el-card>

  <!-- 图片预览对话框 -->
   <el-dialog
    title="图片预览"
    :visible.sync="previewDialogVisible"
    width="50%">
    <img :src="this.previewPath" class="prrviewImg" alt="">
  </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      // 添加的表单数据
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      // 基本信息验证表单
      addRules: {
        goods_name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        goods_price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        goods_weight: [{ required: true, message: '请输入商品重量', trigger: 'blur' }],
        goods_number: [{ required: true, message: '请输入商品数量', trigger: 'blur' }],
        goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
      },
      // 商品分类列表
      CateList: [],
      // 级联选择器的配置选项
      props: {
        expandTrigger: 'hover',
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 商品动态参数
      manyTabData: [],
      // 商品静态属性
      onlyTabData: [],
      // 图片上传地址
      uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传headers请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      // 图片预览地址
      previewPath: '',
      // 控制图片预览对话框是否可见
      previewDialogVisible: false
    }
  },
  methods: {
    // 获取商品分类列表
    async getCateList () {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类失败！')
      }
      this.CateList = res.data
    },
    // 获取商品分类参数列表
    async getmanyParamsList () {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品动态参数失败！')
      }

      // 字符串转化为数组
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
      })

      this.manyTabData = res.data
    },
    // 获取静态属性列表
    async getonlyparamsList () {
      const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })

      if (res.meta.status !== 200) {
        return this.$message.error('获取静态属性失败！')
      }

      this.onlyTabData = res.data
    },
    // 当级联选择器选择项发生变化
    handleChange () {
      // 当选择不是三级参数时 清空
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // 切换tab栏触发
    beforeTabLeave (activeName, oldActiveName) {
      // 如果没有选择商品分类
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请选择商品分类')
        return false
      }
    },
    // 切换tab栏触发
    TabClicked () {
      if (this.activeIndex === '1') {
        // 获取动态参数
        this.getmanyParamsList()
      } else if (this.activeIndex === '2') {
        // 获取静态参数
        this.getonlyparamsList()
      }
    },
    // 图片预览
    handlePreview (file) {
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },
    // 图片移除
    handleRemove (file) {
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值 x是数组pics里的每一项 匹配上了findIndex就把索引值返回
      const i = this.addForm.pics.findIndex(x => x.pic === filePath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
    },
    // 图片上传成功时触发
    handleSuccess (response) {
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象存储到pics数组中
      this.addForm.pics.push(picInfo)
    },
    add () {
      // 先进行预验证
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项！')
        }
        // 发送前先处理格式问题：
        // 1.处理级联选择器的goods_cat
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')

        // 2.处理动态参数 即先把存放在数据里的相应数据（attr_vals）改为数组再存放到参数对象里
        this.manyTabData.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })

        // 处理静态属性 这个attr_vals不用处理 因为静态属性的attr_vals本来就是字符串
        this.onlyTabData.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })

        // 把addForm里推进去的attrs复制给新拷贝出来的form 再发送请求
        form.attrs = this.addForm.attrs

        // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    }

  },
  created () {
    this.getCateList()
  },
  computed: {
    cateId () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag{
  margin: 10px;
}
.el-checkbox {
  margin: 10px;
}
.prrviewImg{
  width: 100%;
}
.add{
  margin-top: 15px;
}
</style>
