<template>
  <div>
    <headTop head-title="确认订单" go-back="true"></headTop>
    <div class="address">
      <span>&yen;</span>
      <div class="detail">
        <p>收件人:111</p>
        <p>收货地址:222</p>
      </div>
      <router-link to="/address" class="info-router">
        <section class="headportrait headportraitwo headportraithree">
          <span>&lt;</span>
        </section>
      </router-link>
    </div>
  </div>
</template>
<script>
  import headTop from '../../components/header/head.vue'

  export default{
    data(){
      return{

      }
    },
    components:{
      headTop
    }
  }
</script>
<style>
  .address{
    display: flex;
    flex-direction: row;
  }
</style>
