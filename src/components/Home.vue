<template>
<!-- 头部区域 -->
<el-container class="home_container">
  <el-header>
    <div>
      <img src="../assets/电商.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="loginout">退出登录</el-button>
  </el-header>

  <!-- 页面主体区 -->
  <el-container>
  <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-btn" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" unique-opened :collapse="isCollapse" :collapse-transition="false" router :default-active='activePath'>
          <!-- 一级菜单 -->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item @click="getActivePath('/' + subItem.path)" :index="'/' + subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

    <!-- 主体内容 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>

<script>
export default {
  created () {
    this.getMenuList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  data () {
    return {
      // 左侧菜单数据
      menuList: [],
      iconsObj: {
        125: 'iconfont icon-users',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpinguanli',
        102: 'iconfont icon-danju-xianxing',
        145: 'iconfont icon-quxiantu'

      },
      isCollapse: false,
      activePath: ''
    }
  },
  methods: {
    // 退出登录
    loginout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    // 获取左侧菜单数据
    async getMenuList () {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menuList = res.data
    },
    // 点击按钮 切换菜单展开或者隐藏
    toggleCollapse () {
      this.isCollapse = !this.isCollapse
    },
    // 高亮
    getActivePath (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }
  }
}
</script>

<style lang="less" scoped>
.home_container{
  height: 100%;
}
.el-header{
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  >div{
    display: flex;
    align-items: center;
    span{
      margin-left: 10px;
    }
  }
  img{
    width: 50px;
    height: 50px;
  }
}
.el-aside{
background-color: #333744;
.el-menu{
  border: none;
}
}
.el-main{
background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
.toggle-btn{
  background-color: #4a5064;
  color: #fff;
  text-align: center;
  font-size: 10px;
  line-height: 24px;
  letter-spacing: 0.2rem;
  cursor: pointer;
}
</style>
