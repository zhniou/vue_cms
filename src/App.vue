<template>
<<<<<<< HEAD
<div id="app">
  <!-- 路由站位符 -->
  <router-view></router-view>
</div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>

=======
  <div>
    <router-view></router-view>
    <Player v-show="showPlayer&&$route.path !== '/fm'"></Player>
  </div>
</template>

<script>
import Player from '@/components/Player/Player'
import { mapState } from 'vuex'
export default {
  components: {
    Player
  },
  computed: {
    ...mapState({
      showPlayer: state => (state.currentIndex >= 0)
    })
  }

}
</script>

<style lang="less" scoped>
div{
  // background-color: #f1f3f4;
}
>>>>>>> 2b029d5 (20200609)
</style>
