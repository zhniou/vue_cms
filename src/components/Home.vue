<template>
<div class="home_container">
  <el-button type="info" @click="loginout">退出登录</el-button>
</div>
</template>

<script>
export default {
  methods: {
    loginout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>

<style lang="less" scoped>

</style>
