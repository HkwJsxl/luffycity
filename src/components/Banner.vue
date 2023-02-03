<template>

  <div id="banner">
    <el-carousel height="400px">
      <el-carousel-item v-for="(item, index) in banner_list" :key="index" class="el-carousel__item">
        <router-link :to="item.link">
          <img :src="item.image" :alt="item.name">
        </router-link>
      </el-carousel-item>
    </el-carousel>
  </div>

</template>

<script>
export default {
  name: "Banner",
  data() {
    return {
      banner_list: []
    }
  },
  created() {
    //当banner组件一创建，就向后台发请求，拿回轮播图数据
    this.$axios.get(this.$settings.base_url + '/home/banner/').then(response => {
      this.banner_list = response.data.data;
    }).catch(errors => {
      console.log(errors);
    })
  },

}
</script>

<style scoped>
.el-carousel__item {
  height: 400px;
  min-width: 1200px;
}

.el-carousel__item img {
  height: 400px;
  margin-left: calc(50% - 1920px / 2);
}
</style>