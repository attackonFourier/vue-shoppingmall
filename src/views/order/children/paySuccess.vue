<template>
  <div class="success">
    <img src="../../../images/paySuccess.png"/>
    <p class="tips">恭喜你购买成功！</p>
    <div class="btn" @click="confirm">确定</div>
  </div>
</template>
<script>
  export default{
    data(){
      return{}
    },
    methods:{
      confirm(){
        window.close();
      }
    }
  }
</script>
<style lang="scss" scoped>
  .success{
    display:flex;
    flex-direction: column;
    align-items:center;
    .tips{
      font-size:28px;/*px*/
      text-align:center;
    }
    .btn{
      background-color: #ec9182;
      padding:10px 20px;
      color:#fff;
      text-align: center;
    }
  }
</style>
