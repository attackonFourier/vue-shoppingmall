<template>
  <div class="order">
    <div>
      <headTop head-title="确认订单" go-back="true">
        <span class="space" slot="space">&nbsp;</span>
      </headTop>
      <div class="address" v-if="!addressID">
        <span class="left iconfont">&#xe66b;</span>
        <div class="detail">
          <p>您暂无收货地址!</p>
        </div>
        <router-link to="./address" class="info-router">
          <section>
            <span class="right iconfont">&#xe675;</span>
          </section>
        </router-link>
      </div>
      <div v-else class="address">
        <span class="left iconfont">&#xe66b;</span>
        <div class="detail">
          <p>收件人:{{address.addressee}}&nbsp;{{address.mobile}}</p>
          <p>收货地址:{{address.proviceName + address.cityName + address.countyName + address.detail}}</p>
        </div>
        <router-link to="./address" class="info-router">
          <section>
            <span class="right iconfont">&#xe675;</span>
          </section>
        </router-link>
      </div>

      <div class="product">
        <img :src="imgUrl"/>
        <div class="content">
          <p class="name">{{product.name}}</p>
          <p class="size">{{product.specValue}}</p>
        </div>
        <div class="right">
          <p class="price">&yen;{{product.price}}</p>
          <p class="num">×{{product.num}}</p>
        </div>
      </div>

      <div class="tips">
        <router-link to="./order/invoice" class="info-router">
          <div class="item">
          <div class="left">发票信息</div>
            <section class="right">无
              <span class="iconfont">&#xe675;</span>
            </section>
          </div>
        </router-link>
        <!--<div class="item">
          <div class="left">优惠券</div>
          <div class="right coupon">无
            <span class="iconfont">&#xe675;</span>
          </div>
        </div>-->
        <div class="item">
          <input class="input" v-model="remark" type="text" name="input" placeholder="填写给商家留言">
        </div>
      </div>

      <div class="total">
        <div class="item">
          <div>商品金额</div>
          <div class="right">&yen;{{product.total}}</div>
        </div>
        <div class="item">
          <div>立减</div>
          <div class="right">-&yen;{{product.discount}}</div>
        </div>
        <div class="item">
          <div>运费</div>
          <div class="right">&yen;{{product.deliveryFee}}</div>
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
          <div class="price">实付款:
            <span>&yen;{{payFeeTotal}}</span>
          </div>
        </div>
        <div @click="submit" class="right">立即购买</div>
      </nav>
    </div>
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
        imgUrl:'',
        product:{
          name:'',
          specValue:'',
          price:0,
          num:0,
          totol:0,
          discount:0,
          deliveryFee:0
        },
        payFeeTotal:0,
        skuID:null,
        remark:null
      }
    },
    components:{
      headTop
    },
    computed:{
      ...mapState([
        'userInfo','productInfo','addressID'
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
      ...mapMutations([
        'RECORD_ADDRESSID','RECORD_ORDERID'
      ]),
      async initData(){
        const token = getStore('memberToken').replace(/\"/g,'')
        if(!this.addressID){
          await this.getDefaultAddress(token);
        }
        else{
          await this.getSelectAddress(token);
        }
        await this.getBalance(token);
      },
      getDefaultAddress(token){
        let data = new FormData();
        data.append('memberToken',token)
        fetch(apiUrl + '/v2/address/getDefault',{
          method: 'post',
          body: data,
        }).then((response)=>{
          response.json().then((res)=>{
            this.address = res.data;
            this.RECORD_ADDRESSID(res.data.id);
          });
        });
      },
      getSelectAddress(token){
        let data = new FormData();
        data.append('memberToken',token);
        data.append('addressId',this.addressID);

        fetch(apiUrl + '/v2/address/get',{
          method: 'post',
          body: data,
        }).then((response)=>{
          response.json().then((res)=>{
            if(200 === res.code){
              let data = res.data;
              this.address = res.data;
            }
          });
        });
      },
      getBalance(token){
        const product = JSON.parse(JSON.parse(getStore('product')));
        let data = new FormData();
        data.append('memberToken',token)
        data.append('num',product.stock)
        data.append('productId',product.productID)
        data.append('specoptionIdCombo',product.specComboId)
        this.imgUrl = product.proUrl;

        fetch(apiUrl + '/v3/order/toBalance',{
          method: 'post',
          body: data,
        }).then((response)=>{
          response.json().then((res)=>{
            if(200 === res.code){
              let data = res.data;
              this.product = {
                name:data.product.name,
                specValue:data.specValue,
                num:data.num,
                price:data.price,
                total:data.productTotal,
                discount:data.discountTotal,
                deliveryFee:data.deliveryTotal
              };
              this.payFeeTotal = data.payFeeTotal;
              this.skuID = data.skuId;
            }
          });
        });
      },
      submit(){
        const token = getStore('memberToken').replace(/\"/g,'')
        const product = JSON.parse(JSON.parse(getStore('product')));
        let data = new FormData();
        data.append('memberToken',token)
        data.append('skuId',this.skuID)
        data.append('num',this.product.num)
        data.append('addressId',this.addressID)
        data.append('remark',this.remark)
        fetch(apiUrl + '/v3/order/confirmOrder',{
          method:'post',
          body:data
        }).then((response)=>{
          response.json().then((res)=>{
            this.RECORD_ORDERID(res.data)
            this.$router.push('/order/payment');
          });
        });
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
      height:auto;
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
    font-size:28px;/*px*/
    img{
      width:120px;
      height:120px;
      overflow: hidden;
      border:1px solid #222;/*no*/
    }
    .content{
      width:70%;
      margin-left:20px;
      p{
        height:60px;
        line-height: 60px;
      }
      .name{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .size{
        color:#a6a6a6;
      }
    }
    .right{
      p{
        height:60px;
        line-height: 60px;
        text-align: right;
      }
      .price{
        color:#ec9182;
      }
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
}
  .fade-enter-active, .fade-leave-active {
    transition: opacity .3s;
  }
  .fade-enter, .fade-leave-active {
    opacity: 0;
  }
  .slid_up-enter-active, .slid_up-leave-active {
    transition: all .3s;
  }
  .slid_up-enter, .slid_up-leave-active {
    transform: translate3d(0,10rem,0)
  }
  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(2rem, 0, 0);
    opacity: 0;
  }
</style>
