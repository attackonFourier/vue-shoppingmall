<template>
  <div>
   <input type="text" name="phone" placeholder="电话号码" v-model="phoneNumber"/>
    <div class="login" @click="login">登录</div>
  </div>
</template>
<script>
  import {mapState,mapMutations} from 'vuex'

  export default{
    data(){
      return{
        phoneNumber:null
      }
    },
    methods:{
      login(){
        {
          let data = new FormData();
          data.append('mobile',this.phoneNumber);
          data.append('smsCode',999999);
          data.append('deviceCode','buoumall-h5-h5');
          fetch('http://api.buoumall.com/v2/login/bySms', {
            body:data,
            method: 'post'
          }).then((response)=>{
            response.json().then((res)=>{
              if(200 === res.code){
                this.$router.push('/order')
              }
            });
          });
        }
      }
    }
  }
</script>
<style>

</style>
