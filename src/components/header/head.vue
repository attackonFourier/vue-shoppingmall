<template>
  <header id='header'>
    <slot name='logo'></slot>
    <slot name='search'></slot>
    <section class="go_back" v-if="goBack" @click="$router.go(-1)">
      <span>back</span>
    </section>
    <section class="title_head ellipsis" v-if="headTitle">
      <span class="title_text">{{headTitle}}</span>
    </section>
    <slot name="edit"></slot>
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
    color:#fff;
    background-color: #222;
  }
</style>
