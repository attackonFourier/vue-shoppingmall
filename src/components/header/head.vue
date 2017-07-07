<template>
  <header id='header'>
    <slot name='logo'></slot>
    <section class="go_back" v-if="goBack" @click="$router.go(-1)">
      <span class="iconfont">&#xe664;</span>
    </section>
    <section class="title_center ellipsis" v-if="headTitle">
      <span class="title_text">{{headTitle}}</span>
    </section>
    <slot name="add"></slot>
    <slot name="save"></slot>
    <slot name="space"></slot>
    <slot name="title"></slot>
  </header>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  export default {
    data(){
      return{
      }
    },
    mounted(){
      //获取用户信息
      //this.getUserInfo();
    },
    props: ['headTitle', 'goBack'],
    computed: {
      /*...mapState([
       'userInfo'
       ]),*/
    },
    methods: {
      /*...mapActions([
       'getUserInfo'
       ]),*/
    },
  }
</script>
<style lang="scss" scoped>
  #header{
    position: fixed;
    top:0;
    left:0;
    right:0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding:0 20px;
    width:100%;
    height:90px;
    line-height: 90px;
    color:#fff;
    background-color: #222;
    font-size:32px;/*px*/
    z-index: 100;
    .go_back{
        span{
          font-size:48px;/*px*/
          color:#fff;
        }
    }
    .title_center{
      .title_text{
        color:#fff;
      }
    }
    .title{
      span{
        color:#fff;
      }
    }
  }
</style>
