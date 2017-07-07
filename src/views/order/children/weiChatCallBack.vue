<template>
  <div>
    <alert-tip v-if="showAlert" @closeTip="closeTipFun" :alertText="alertText"></alert-tip>
  </div>
</template>
<script>
  import {apiUrl,imageUrl} from '../../../utils/url'
  import alertTip from '../../../components/common/alertTip.vue'

  export default{
    data(){
      return {
        orderNumber:null,
        code:null,
        showAlert: false,
        alertText: null
      }
    },
    components: {
      alertTip,
    },
    created(){
      this.initData();
    },
    methods:{
      async initData(){
        await this.pay();
      },
      closeTipFun(){
        this.showAlert = false;
        if (this.gotoOrders) {
          this.$router.push('/order');
        }
      },
      pay(){
        this.orderNumber = this.$route.query.state;
        this.code = this.$route.query.code;
        let data = new FormData();
        data.append('code',this.code)
        fetch(apiUrl + '/weixin/getAccessToken',{
          method:'post',
          body:data
        }).then((response)=>{
          response.json().then(res=>{
            if(200 === res.code){
              let ua = window.navigator.userAgent;
              if(ua.indexOf('Android') > -1 || ua.indexOf('Linux') > -1){
                setTimeout(()=>{
                  this.toPay(res.data.openid);
                }, 1e3);
              }
              else{
                this.toPay(res.data.openid);
              }
            }
          })
        });
      },
      topay(openId){
        let data = new FormData();
        data.append('payWay','weixin')
        data.append('orderNumber',this.orderNumber)
        data.append('openId',openId)
        fetch(apiUrl + '/wap/topay',{
          method:'post',
          body:data
        }).then(response=>{
          response.json().then(res=>{
            if(200 === res.code){
              let obj = JSON.parse(res.data);
              this.onBridgeReady(obj.appId,obj.timeStamp,obj.nonceStr,obj.package,obj.signType,obj.paySign);
            }
          });
        });
      },
      onBridgeReady(appId,timeStamp,nonceStr,packages,signType,paySign){
        WeixinJSBridge.invoke(
          'getBrandWCPayRequest', {
            "appId" : appId,     //公众号名称，由商户传入
            "timeStamp":timeStamp,         //时间戳，自1970年以来的秒数
            "nonceStr" : nonceStr, //随机串
            "package" :packages,
            "signType" : signType,         //微信签名方式：
            "paySign" :paySign //微信签名
          },()=>{
            let data = new FormData();
            data.append('payWay','weixin')
            data.append('orderNumber',this.orderNumber)

            fetch(apiUrl + '/wap/payQuery',{
              method:'post',
              body:data
            }).then(response=>{
              response.json().then((res)=>{
                if(res.code === 200 &&　res.data.code === 200){
                  this.$router.push(-1);
                }
                else{
                  this.showAlert = true;
                  this.alertText = '支付失败,请再次尝试!';
                  this.$router.go(-1);
                }
              });
            });
          });
      }
    }
  }
</script>
<style>

</style>
