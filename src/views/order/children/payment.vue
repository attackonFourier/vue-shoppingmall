<template>
  <div class="payment">
    <headTop head-title="收银台" go-back="true">
      <span class="space" slot="space">&nbsp;</span>
    </headTop>

    <div>
      <div class="total" v-if="isWeiChat">
        <div>
          <img src="../../../images/weixin_icon.png"/>
        </div>
        <div class="content">
          <p class="top">微信支付</p>
          <p class="tip">推荐安装微信5.0及以上版本使用</p>
        </div>
        <span class="iconfont">&#xe63e;</span>
      </div>
      <div class="total" v-if="!isWeiChat">
        <div>
          <img src="../../../images/zhi_icon.png">
        </div>
        <div class="content">
          <p class="top">支付宝支付</p>
          <p class="tip">推荐有支付宝的账户使用</p>
        </div>
        <span class="iconfont">&#xe63e;</span>
      </div>
    </div>

    <nav class="footer">
      <div class="left">
        <div class="price">合计:
          <span>&yen;{{payFee}}</span>
        </div>
      </div>
      <div @click="submit" class="right">确认支付</div>
    </nav>
    <alert-tip v-if="showAlert" @closeTip="closeTipFun" :alertText="alertText"></alert-tip>
  </div>
</template>
<script>
  import headTop from '../../../components/header/head.vue'
  import {apiUrl,imageUrl} from '../../../utils/url'
  import {mapState} from 'vuex'
  import {getStore} from '../../../utils/util'
  import alertTip from '../../../components/common/alertTip.vue'

  export default{
    data(){
      return{
        isWeiChat:false,
        payFee:null,
        showAlert: false,
        alertText: null
      }
    },
    components:{
      headTop,
      alertTip
    },
    computed:{
      ...mapState([
        'orderID'
      ]),
    },
    created(){
      let ua = window.navigator.userAgent.toLowerCase();
      if(ua.match(/micromessenger/i)){
        this.isWeiChat = true;
      }
      else{
        this.isWeiChat = false;
      }
      this.initData();
    },
    methods:{
      async initData(){
        const token = getStore('memberToken').replace(/\"/g,'')
        await this.getTotal(token)
      },
      getTotal(token){
        let data = new FormData();
        data.append('memberToken',token)
        data.append('orderNumStr',this.orderID)
        fetch(apiUrl + '/v3/order/calculatePayFee',{
          method:'post',
          body:data
        }).then(response=>{
          response.json().then(res=>{
            this.payFee = res.data.payFee;
          });
        });
      },
      weiChatPay(){
        let url = encodeURIComponent("http://m.buoumall.com/pay/weixinCallback");
        window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb0b54e5c47f3ef04&redirect_uri=" +
          url + "&response_type=code&scope=snsapi_base&state=" + this.orderID + "#wechat_redirect";
      },
      AliPay(){
        window.location.href = apiUrl + "/wap/topay?payWay=alipay&orderNumber=" + this.orderID;
        const token = getStore('memberToken').replace(/\"/g,'')
        let data = new FormData();
        data.append('memberToken',token)
        data.append('payWay','alipay')
        data.append('orderNumber',this.orderID)

        fetch(apiUrl + '/wap/payQuery',{
          method:'post',
          body:data
        }).then(response=>{
          response.json().then((res)=>{
            if(res.code === 200 &&　res.data){
              this.$router.push('/cooperate/order/paySuccess');
            }
            else{
              this.showAlert = true;
              this.alertText = '支付失败,请再次尝试!';
            }
          });
        });
      },
      submit(){
        if(this.isWeiChat){
          this.weiChatPay();
        }
        else{
          this.AliPay();
        }
      },
      closeTipFun(){
        this.showAlert = false;
      }
    }
  }
</script>
<style lang="scss">
  .payment{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:#f0f0f0;
    z-index: 204;
    padding-top: 90px;
    .total{
      img{
        width:50px;
        height:44px;
      }
      display: flex;
      flex-direction: row;
      background-color:#fff;
      padding:0 20px;
      height:140px;
      line-height:140px;
      border-bottom:1px solid #e0e0e0;/*no*/
      .content{
        margin-left:20px;
        width:80%;
        display: flex;
        flex-direction: column;
        p{
          height:40px;
          line-height: 40px;
        }
        .top{
          margin-top:25px;
          font-size:28px;/*px*/
          color:#222;
        }
        .tip{
          color:#a6a6a6;
        }
      }
      span{
        font-size:48px;/*px*/
      }
    }
  }

  .footer{
    position: fixed;
    left:0;
    right:0;
    bottom:0;
    height: 130px;
    line-height: 130px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    font-size:32px;/*px*/
    background-color:#222;
  .left{
    margin-left:30px;
  .price{
    color:#ec9182;
  span{
    color:#ec9182;
  }
  }
  }
  .right{
    width:250px;
    background-color:#ec9182;
    color:#f1f1f1;
    text-align:center;
  }
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
</style>
