<template>
  <div>
  <!-- 面包屑区域 -->
   <el-breadcrumb separator="/">
   <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
   <el-breadcrumb-item>订单管理</el-breadcrumb-item>
   <el-breadcrumb-item>订单列表</el-breadcrumb-item>
   </el-breadcrumb>

   <!-- 卡片区域 -->
   <el-card>
     <!-- 搜索框 -->
     <el-row>
       <el-col :span="8">
        <el-input placeholder="请输入内容" v-model="queryInfo.query" clearableclass="input-with-select" @keyup.enter.native="getOrdersList">
        <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
        </el-input>
       </el-col>
     </el-row>

     <!-- 表格区域 -->
    <el-table :data="ordersList" style="width: 100%" border stripe>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="订单编号" prop="order_number" ></el-table-column>
      <el-table-column label="订单价格" prop="order_price" width="100px"></el-table-column>

      <el-table-column label="是否付款" width="100px">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="是否发货" prop="is_send" width="100px"></el-table-column>

      <el-table-column label="下单时间">
        <template slot-scope="scope">
          {{scope.row.create_time|dataFormat}}
        </template>
      </el-table-column>

      <el-table-column label="操作" width="150px">
        <template>
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditPositonDialog"></el-button>
          <el-button type="success" size="mini" icon="el-icon-location" @click="showProggressDialog"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 底部分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[5, 10, 15, 20]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

   </el-card>

    <!-- 修改地址对话框 -->
   <el-dialog :visible.sync="addressVisible" title="修改地址" width="50%" @close="addressDialogClosed">
      <el-form ref="addressFormRef" :model="addressForm" :rules="addressFormRules" label-width="100px">

        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addressForm.address1"
            :options="cityData"
            :props="cityProps"
            clearable
            expand-trigger="hover"
          ></el-cascader>
        </el-form-item>

        <el-form-item label="详细地址" prop="detailAdd">
          <el-input v-model="addressForm.detailAdd"></el-input>
        </el-form-item>

      </el-form>
    </el-dialog>

    <!-- 物流进度对话框 -->
     <el-dialog title="物流进度" :visible.sync="progressDialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.ftime"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>

  </div>
</template>

<script>
import cityData from './citydata.js'
export default {
  data () {
    return {
      // 请求参数
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      // 订单列表
      ordersList: [],
      // 控制修改地址对话框隐藏显示
      addressVisible: false,
      // 修改地址表单
      addressForm: {
        address1: '',
        detailAdd: ''
      },
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' }
        ],
        detailAdd: [
          { required: true, message: '请输入详细地址', trigger: 'blur' }
        ]
      },
      cityProps: {
        expandTrigger: 'hover'
      },
      cityData: cityData,
      // 展示物流对话框
      progressDialogVisible: false,
      // 物流信息
      progressInfo: []
    }
  },
  methods: {
    // 获取订单数据
    async getOrdersList () {
      const { data: res } = await this.$http.get('orders', { params: this.queryInfo })

      if (res.meta.status !== 200) {
        return this.$message.error('获取订单数据失败！')
      }

      this.ordersList = res.data.goods
      this.total = res.data.total
    },
    // pageSize 改变时会触发
    handleSizeChange (newSize) {
      this.queryInfo.pagesize = newSize
      this.getOrdersList()
    },
    // currentPage 改变时会触发
    handleCurrentChange (newPage) {
      this.queryInfo.pagenum = newPage
      this.getOrdersList()
    },
    // 展示修改地址对话框
    showEditPositonDialog () {
      this.addressVisible = true
    },
    // 监听添加地址对话框关闭
    addressDialogClosed () {
      this.$refs.addressFormRef.resetFields()
    },
    // 展示物流进度对话框
    async showProggressDialog () {
      // 这部分有问题
      // const { data: res } = await this.$http.get('/kuaidi/804909574412544580')
      // if (res.meta.status !== 200) {
      //   return this.$http.error('获取物流信息失败')
      // }

      this.progressInfo = [
        {
          time: '2018-05-10 09:39:00',
          ftime: '2018-05-10 09:39:00',
          context: '已签收,感谢使用顺丰,期待再次为您服务',
          location: ''
        },
        {
          time: '2018-05-10 08:23:00',
          ftime: '2018-05-10 08:23:00',
          context: '[北京市]北京海淀育新小区营业点派件员 顺丰速运 95338正在为您派件',
          location: ''
        },
        {
          time: '2018-05-10 07:32:00',
          ftime: '2018-05-10 07:32:00',
          context: '快件到达 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-10 02:03:00',
          ftime: '2018-05-10 02:03:00',
          context: '快件在[北京顺义集散中心]已装车,准备发往 [北京海淀育新小区营业点]',
          location: ''
        },
        {
          time: '2018-05-09 23:05:00',
          ftime: '2018-05-09 23:05:00',
          context: '快件到达 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 21:21:00',
          ftime: '2018-05-09 21:21:00',
          context: '快件在[北京宝胜营业点]已装车,准备发往 [北京顺义集散中心]',
          location: ''
        },
        {
          time: '2018-05-09 13:07:00',
          ftime: '2018-05-09 13:07:00',
          context: '顺丰速运 已收取快件',
          location: ''
        },
        {
          time: '2018-05-09 12:25:03',
          ftime: '2018-05-09 12:25:03',
          context: '卖家发货',
          location: ''
        },
        {
          time: '2018-05-09 12:22:24',
          ftime: '2018-05-09 12:22:24',
          context: '您的订单将由HLA（北京海淀区清河中街店）门店安排发货。',
          location: ''
        },
        {
          time: '2018-05-08 21:36:04',
          ftime: '2018-05-08 21:36:04',
          context: '商品已经下单',
          location: ''
        }
      ]
      console.log(this.progressInfo)
      this.progressDialogVisible = true
    }
  },
  created () {
    this.getOrdersList()
  }
}
</script>

<style lang="less" scoped>
.el-button{
  margin-left: 8px;
}
.el-cascader{
  width: 100%;
}
</style>
