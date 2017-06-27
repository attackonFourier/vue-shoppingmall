<template>
  <div class="order">
    <headTop head-title="确认订单" go-back="true"></headTop>
    <div class="address">
      <span class="left iconfont">&#xe66b;</span>
      <div class="detail">
        <p>收件人:{{address.addressee}}&nbsp;{{address.mobile}}</p>
        <p>收货地址:{{address.proviceName + address.cityName + address.countyName + address.detail}}</p>
      </div>
      <router-link to="/address" class="info-router">
        <section class="headportrait headportraitwo headportraithree">
          <span class="right iconfont">&#xe675;</span>
        </section>
      </router-link>
    </div>

    <div class="product">
      <img />
      <div class="content">
        <div class="name">2222</div>
        <div class="size">颜色：2222  尺码：2222</div>
      </div>
      <div class="right">
        <div class="price">&yen;111</div>
        <div class="num">×2</div>
      </div>
    </div>

    <div class="tips">
      <div class="item">
        <div class="left">发票信息</div>
        <div class="right">222
          <span class="iconfont">&#xe675;</span>
        </div>
      </div>
      <div class="item">
        <div class="left">优惠券</div>
        <div class="right coupon">222
          <span class="iconfont">&#xe675;</span>
        </div>
      </div>
      <div class="item">
        <input class="input" v-model="remark" type="text" name="input" placeholder="填写给商家留言">
      </div>
    </div>

    <div class="total">
      <div class="item">
        <div>商品金额</div>
        <div class="right">&yen;111</div>
      </div>
      <div class="item">
        <div>立减</div>
        <div class="right">-&yen;11111</div>
      </div>
      <div class="item">
        <div>运费</div>
        <div class="right">111</div>
      </div>
    </div>

    <div class="warm">
      <h4>购买须知:</h4>
      <p>1.为维护消费者权益，本平台提供7天退换货保障;</p>
      <p>2.定制款商品非质量问题不退换;</p>
      <p>3.请原样寄回商品，如寄回商品与申请换货商品不一致时，寄回商品过水、剪标、污损等情况，将不予换货;</p>
      <p>4.退换货商品寄回时，需用户自行支付运费，商品从商家寄回用户手上的运费，由商家承担。</p>
    </div>

    <nav class="footer">
      <div class="left">
        <div class="price">实付款:<span>&yen;1111</span></div>
      </div>
      <div @click="submit" class="right">立即购买</div>
    </nav>

    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import headTop from '../../components/header/head.vue'
  import {apiUrl,imageUrl} from '../../utils/url'
  import {mapState, mapMutations,mapActions} from 'vuex'
  import {getStore} from '../../utils/util'

  export default{
    data(){
      return{
        address:{},
        remark:null
      }
    },
    components:{
      headTop
    },
    computed:{
      ...mapState([
        'userInfo'
      ]),
    },
    created(){
    },
    mounted () {
      this.initData();
      //this.swiper.slideTo(3, 1000, false)
    },
    watch:{
      userInfo(value){
      if (value.memberToken) {
          this.getAddress();
        }
      }
    },
    methods:{
      async initData(){
        await this.getAddress();
      },
      getAddress(){
        let data = new FormData();
        data.append('memberToken',getStore('memberToken').replace(/\"/g,''))
        fetch(apiUrl + '/v2/address/getDefault',{
          method: 'post',
          body: data,
        }).then((response)=>{
          response.json().then((res)=>{
            this.address = res.data;
          });
        });
      },
      submit(){

      },
    }
  }
</script>
<style lang="scss" scoped>
  @mixin cover{
    padding:0px 20px;
    margin-top: 20px;
    background-color: #fff;
  }
  .order{
    padding-bottom:130px;
    background-color: #efeff4;
    .address{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin-top: 90px;
      padding:20px;
      height:160px;
      color:#222;
      background-color: #fff;
      font-size:28px;/*px*/
    .left,.right{
      line-height: 100px;
      font-size: 48px;/*px*/
    }
    .detail{
      width:80%;
      p{
        line-height: 60px;
      }
    }
  }

  .product{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding:20px;
    margin-top: 20px;
    background-color: #fff;
    img{
      width:120px;
      height:120px;
      overflow: hidden;
      border:1px solid #222;/*no*/
    }
    .content{

    }
  }

  .tips{
    @include cover
    .item{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      height:100px;
      line-height: 100px;
      border-bottom:1px solid #efefef;/*no*/
      .right{
        color:#888;
      }
    }
  }
  .total{
    @include cover
    font-size:28px;/*px*/
    line-height: 60px;
      .item {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
      .right{
        color:#ec9182;
      }
    }
  }
  .warm{
    @include cover
    font-size: 28px;/*px*/
    h4{
      line-height: 50px;
    }
    p{
      color: #8f8f94;
      line-height: 40px;
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
      color:#ec9182;
    }
    .right{
      width:250px;
      background-color:#ec9182;
      color:#f1f1f1;
      text-align:center;
    }
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
