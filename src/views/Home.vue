<template>
  <div className="home">
    <Header/>
    <Banner/>
    <div>
      <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
    </div>
    <Footer/>
  </div>
</template>

<script>
//导入头部组件
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Banner from '@/components/Banner'

export default {
  name: "Home",
  data() {
    return {}
  },
  created() {
    this.$axios.get(this.$settings.base_url + '/home/home/').then(response => {
      console.log(response.data)  //response.data才是真正后台返回的数据
    }).catch(errors => {
      console.log(errors)
    })
  },
  components: {
    Header,
    Footer,
    Banner,
  }
}
</script>
