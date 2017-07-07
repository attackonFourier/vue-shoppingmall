<template>
  <div class="alet_container">
    <section class="tip_text_container">
      <!--<div class="tip_icon">
        <span></span>
        <span></span>
      </div>-->
      <p class="tip_text">{{alertText}}</p>
      <div class="confrim" @click="closeTip">确认</div>
    </section>
  </div>
</template>

<script>
  export default {
    data(){
      return{
        positionY: 0,
        timer: null,
      }
    },
    mounted(){

    },
    props: ['alertText'],
    methods: {
      closeTip(){
        this.$emit('closeTip')
      }
    }
  }
</script>

<style lang="scss" scoped>
  @keyframes tipMove{
    0%   { transform: scale(1) }
    35%  { transform: scale(.8) }
    70%  { transform: scale(1.1) }
    100% { transform: scale(1) }
  }
  .alet_container{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 200;
  }
  .tip_text_container{
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -150px;
    margin-left: -150px;
    width: 300px;
    animation: tipMove .4s ;
    background-color: rgba(255,255,255,1);
    border: 1px;/*no*/
    padding-top: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px;/*no*/
    border-radius: 5px;/*no*/
  .tip_icon{
    border: 10px solid #f8cb86;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  span:nth-of-type(1){
    background-color: #f8cb86;
  }
  span:nth-of-type(2){
    border: 1px;/*no*/
    border-radius: 50%;
    margin-top: 20px;
    background-color: #f8cb86;
  }
  }
  .tip_text{
    line-height: 60px;
    text-align: center;
    margin-top: 30px;
    padding: 0 20px;
  }
  .confrim{
    font-weight: bold;
    margin-top: 20px;
    background-color: #ec9182;
    width: 100%;
    text-align: center;
    line-height: 60px;
    color:#fff;
    border: 1px;
    border-bottom-left-radius: 5px;/*no*/
    border-bottom-right-radius: 5px;/*no*/
  }
  }


</style>
