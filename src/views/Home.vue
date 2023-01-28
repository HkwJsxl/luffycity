<template>
  <div>
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

  },
  components: {
    Header,
    Footer,
    Banner,
  }
}
</script>
