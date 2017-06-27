<template>
  <div class="login">
    <img src="../../images/logo.png"/>
    <form>
        <section class="input">
          <input type="text" name="phone" placeholder="电话号码" v-model="phoneNumber"/>
        </section>
        <section class="input">
          <input type="text" name="phone" placeholder="验证码" v-model="codeNumber"/>
          <!--<button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}">获取验证码</button>-->
        </section>
    </form>

    <div class="doLogin" @click="login">登录</div>
  </div>
</template>
<script>
  import {mapState,mapMutations} from 'vuex'
  import { apiUrl } from '../../utils/url'
  import alertTip from '../../components/common/alertTip.vue'

  export default{
    data(){
      return{
        userInfo: null,
        phoneNumber:null,
        codeNumber:null
      }
    },
    components: {
      alertTip,
    },
    methods:{
      ...mapMutations([
        'RECORD_USERINFO'
      ]),
      login(){
        let data = new FormData();
        data.append('mobile',this.phoneNumber);
        data.append('smsCode',this.codeNumber);
        data.append('deviceCode','buoumall-h5-h5');
        fetch(apiUrl + '/v2/login/bySms', {
          body:data,
          method: 'post'
        }).then((response)=>{
          response.json().then((res)=>{
            if(200 === res.code){
              this.userInfo = res.data;
              this.RECORD_USERINFO(res.data);
              this.$router.push('/order')
            }
          });
        });
      }
    }
  }
</script>
<style lang="scss" scpoed>
  .login{
    display:flex;
    flex-direction:column;
    justify-content:center;
    align-items:center;
    height:100%;
    background:url('../../images/login_bg.png') no-repeat;
    background-size:cover;
    img{
      margin:180px 0px;
      width:160px;
      height:160px;
    }
  }
  .input{
    display:flex;
    flex-direction:row;
    justify-content: space-between;
    width:600px;
    height:70px;
    border-bottom:1px solid #f1f1f1;/*no*/
    margin-bottom:80px;
    color:#f1f1f1;
    font-size:28px;/*px*/
    button{
      background-color: transparent;
      border:none;
      color:#fff;
      font-size:28px;/*px*/
    }
  }
  input[type=text]{
    width:300px;
    line-height: 70px;
    height: 70px;
    margin-bottom: 0;
    padding: 0;
    -webkit-user-select: text;
    border: none;
    border-radius: 3px;/*no*/
    outline: 0;
    background-color: rgba(0, 0, 0, 0);
    -webkit-appearance: none;
    color:#f1f1f1;
  }
  .doLogin{
    width:600px;
    height:90px;
    line-height:90px;
    background-color:#f1f1f1;
    color:#222;
    text-align:center;
    font-size:32px;/*px*/
    border-radius:44px;/*no*/
  }
</style>
