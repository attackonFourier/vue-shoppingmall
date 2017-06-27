<template>
  <header id='header'>
    <slot name='logo'></slot>
    <section class="go_back" v-if="goBack" @click="$router.go(-1)">
      <span>back</span>
    </section>
    <section class="title_head ellipsis" v-if="headTitle">
      <span class="title_text">{{headTitle}}</span>
    </section>
    <slot name="add"></slot>
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
<style scoped>
  #header{
    position: fixed;
    top:0;
    left:0;
    right:0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height:90px;
    color:#fff;
    background-color: #222;
  }
</style>
