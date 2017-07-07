<template>
  <div class="login">
    <img src="../../images/logo.png"/>
    <form>
        <section class="input">
          <input type="text" name="phone" placeholder="电话号码" v-model="phoneNumber"/>
        </section>
        <section class="input">
          <input type="text" name="phone" placeholder="验证码" v-model="codeNumber"/>
          <button @click.prevent="getVerifyCode" :class="{right_phone_number:rightPhoneNumber}">{{computedTime}}</button>
        </section>
    </form>

    <div class="doLogin" @click="login">登录</div>
    <alert-tip v-if="showAlert" :showHide="showAlert" @closeTip="closeTip" :alertText="alertText"></alert-tip>
  </div>
</template>
<script>
  import {mapState,mapMutations} from 'vuex'
  import { apiUrl } from '../../utils/url'
  import alertTip from '../../components/common/alertTip.vue'
  import {getStore} from '../../utils/util'

  export default{
    data(){
      return{
        userInfo: null,
        phoneNumber:null,
        codeNumber:null,
        computedTime: '获取验证码', //倒数记时
        showAlert: false,
        alertText: null
      }
    },
    //判断手机号码
    computed: {
      //判断手机号码
      rightPhoneNumber(){
        return /^1\d{10}$/gi.test(this.phoneNumber)
      }
    },
    created(){
      this.shareCode = this.$route.query['shareCode'];
    },
    components: {
      alertTip,
    },
    methods:{
      ...mapMutations([
        'RECORD_USERINFO'
      ]),
      login(){
        console.log(this.shareCode)
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
              this.bindPatter();
            }
          });
        });
      },
      //获取短信验证码
      changeContent(){
          this.computedTime = 60;
          this.timer = setInterval(() => {
            this.computedTime --;
            if (this.computedTime == 0) {
              this.computedTime = '获取验证码';
              clearInterval(this.timer)
            }
          }, 1000)
      },
      async getVerifyCode(){
        let data = new FormData();
        data.append('mobile',this.phoneNumber)
        data.append('type','login')
        if (this.rightPhoneNumber) {
          fetch(apiUrl + '/v2/sms/send', {
            method: 'post',
            body: data
          }).then(response=> {
            response.json().then(res=> {
              if (200 === res.code) {
                this.showAlert = true;
                this.alertText = '短信发送成功!';
                this.changeContent()
              }
            });
          });
        }
      },
      bindPatter(){
        const token = getStore('memberToken').replace(/\"/g,'')
        let data = new FormData();
        data.append('memberToken',token)
        data.append('shareCode',this.shareCode)
          fetch(apiUrl + '/v2/login/bindPartner', {
            method: 'post',
            body: data
          }).then(response=> {
            response.json().then(res=> {
              if (200 === res.code) {
                this.$router.push('./order')
              }
            });
          });
      },
      closeTip(){
        this.showAlert = false;
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
    /*background:url('../../images/login_bg.png') no-repeat;*/
    background-size:cover;
    img{
      margin:100px 0px;
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
    border-bottom:1px solid #d7d7d7;/*no*/
    margin-bottom:80px;
    color:#f1f1f1;
    font-size:28px;/*px*/
    button{
      background-color: transparent;
      border:none;
      color:#888;
      font-size:28px;/*px*/
    }
    .right_phone_number{
      padding:0 10px;
      background-color: #222;
      color:#fff;
      border-radius: 20px;
    }
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
