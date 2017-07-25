<template>
  <footer>
    <router-link to="/index">
      <span class="iconfont">&#xe685;</span>
      <span>首页</span>
    </router-link>
    <router-link to="/designer">
      <span class="iconfont">&#xe684;</span>
      <span>设计师</span>
    </router-link>
    <router-link :to="'./shop'">
      <span class="iconfont">&#xe688;</span>
      <span>商城</span>
    </router-link>
    <router-link to="profile">
      <span class="iconfont">&#xe687;</span>
      <span>我</span>
    </router-link>
  </footer>
</template>
<style lang="scss" scoped>
  footer{
    position: fixed;
    left:0px;
    right:0px;
    bottom:0px;
    display:flex;
    flex-direction:row;
    align-items: center;
    height:100px;
    background-color:#fff;
    a{
      display:flex;
      flex-direction:column;
      width:25%;
      text-align: center;
      span{
        color:#929292;
      }
    }
      .iconfont{
        font-size: 48px;/*px*/
      }
    }
    .router-link-active{
    span{
      color:#ec9182;
    }
  }
</style>
