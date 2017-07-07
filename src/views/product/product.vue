<template>
  <div class="product" ref="productTouch">
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide v-for="slide in slierImages" key={{index}}>
        <img :src="slide"/>
      </swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>
    <div class="title">
      <div class="name">{{mainName}}</div>
      <div class="price">&yen;{{mainPrice}}</div>
    </div>
    <img class="tips" src="../../images/pro_tips.png"/>
    <section class="change_show_type">
      <div class="item">
        <span :class='{active: changeShowType =="detail"}' @click="changeShowType='detail'">详情</span>
      </div>
      <div class="item">
        <span :class='{active: changeShowType =="designer"}' @click="changeShowType='designer'">设计师</span>
      </div>
      <div class="item">
        <span :class='{active: changeShowType =="comment"}' @click="changeShowType='comment'">评论</span>
      </div>
      <div class="item">
        <span :class='{active: changeShowType =="params"}' @click="changeShowType='params'">参数</span>
      </div>
    </section>

    <transition name="fade-choose">
      <section v-show="changeShowType === 'detail'">
        <div class="content" v-html="content"></div>
      </section>
    </transition>

    <transition name="fade-choose">
      <section v-show="changeShowType === 'designer'">
        <div class="designer">
          <div class="avatar">
            <img :src="designer.avatar">
            <p class="name">{{designer.nickname}}</p>
            <p class="signature">{{designer.signature}}</p>
          </div>
          <div class="introduction" v-html="designer.introduction"></div>
        </div>
      </section>
    </transition>

    <transition name="fade-choose">
      <section v-show="changeShowType === 'comment'">
        <div class="commentList">
          <div key={index} class="comment" v-for="item in commentList">
            <img :src="item.avatar">
            <div class="com-item">
              <div class="name">{{item.name}}</div>
              <div class="content">{{item.content}}</div>
            </div>
          </div>
        </div>
      </section>
    </transition>

    <transition name="fade-choose">
      <section v-show="changeShowType === 'params'">
        <div class="par-list">
          <div v-for="item in paramsList" key={index} class="p-item">
            <div class="left">{{item.name}}</div>
            <div class="right">{{item.value}}</div>
          </div>
        </div>
        <img :src="paramImg" class="paramImg"/>
      </section>
    </transition>

    <nav class="bar">
      <a class="buyNow" @click="goBuy">立即购买</a>
    </nav>
    <modal name="specModal"
           :width="'100%'"
           :height="'auto'"
           @before-open="beforeOpen"
           @before-close="beforeClose">
        <div class="pop">
          <div class="cancel" @click="cancel">
            <img src="../../images/cancel.png"/>
          </div>
          <div class="detail">
            <img :src="pop.popImage">
            <div class="content">
              <div class="price">&yen;{{pop.popPrice}}</div>
              <div class="name">{{mainName}}</div>
              <div class="stock">库存{{pop.popStock}}件</div>
            </div>
          </div>
          <div class="specs">
            <section class="details">
              <p class="title">{{specs.spec1.name}}</p>
              <ul>
                <li v-for="(item, itemIndex) in specs.spec1.list" :class="{active: itemIndex == specs1Index}" @click="chooseSpecs1(itemIndex)">
                  {{item.value}}
                </li>
              </ul>
            </section>
          </div>
          <div class="specs">
            <section class="details">
              <p class="title">{{specs.spec2.name}}</p>
              <ul>
                <li v-for="(item, itemIndex) in specs.spec2.list" :class="{active: itemIndex == specs2Index}" @click="chooseSpecs2(itemIndex)">
                  {{item.value}}
                </li>
              </ul>
            </section>
          </div>
          <div class="num">
            <p>数量</p>
            <div class="right">
              <div @click="changeBuyNum(0)" :class="{least:buyNum === 1}">-</div>
              <div class="number">{{buyNum}}</div>
              <div @click="changeBuyNum(1)" :class="{least:buyNum === pop.popStock}">+</div>
            </div>
          </div>
          <div @click="sure" class="bottom">确定</div>
        </div>
    </modal>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import {apiUrl,imageUrl} from '../../utils/url'
  import {getStore} from '../../utils/util'
  import {mapMutations} from 'vuex'

  export default {
    data () {
      return {
        productID:null,
        shareCode:null,
        slierImages:[],
        mainName:'',
        mainPrice:'',
        changeShowType:'detail',
        content:'',
        designer:{
          avatar:'',
          nickname:'',
          signature:'',
          introduction:''
        },
        commentList:[],
        paramsList:[],
        paramImg:'',
        specs1Index:0,
        specs2Index:0,
        pop:{
          popImage:null,
          popPirce:null,
          popStock:null
        },
        specs:{
          spec1:{
            name:'',
            list:[]
          },
          spec2:{
            name: '',
            list: []
          }
        },
        buyNum:1,
        deliveryFee:'',
        swiperOption: {
          notNextTick: true,
          direction: 'horizontal',
          pagination : '.swiper-pagination',
          loop:true
        }
      }
    },
    created(){
      this.productID = this.$route.query.productId;
      this.shareCode = this.$route.query.shareCode;
      this.initData();
    },
    computed: {
      swiper () {
        return this.$refs.mySwiper.swiper
      },
    },
    methods:{
      ...mapMutations([
        'ADD_PRODUCT'
      ]),
      async initData(){
        await this.productDetail();
        await this.getComment();
        await this.getProps();
      },
      productDetail(){
        fetch(apiUrl + '/v2/product/get/'+ this.productID,{
          method: 'post',
        }).then((response)=>{
          if(200 === response.status){
            response.json().then((res)=> {
              let data = res.data;
              this.mainName = data.product.name;
              document.querySelector('title').innerHTML = this.mainName ;
              this.mainPrice = data.product.leastPrice;
              this.deliveryFee = data.deliveryFee;
              this.slierImages = data.mainPics.map((item)=>{
                return imageUrl + item;
              });
              //tab1
              this.content = data.product.description1;
              //设计师
              this.designer = data.seller;
              this.designer.avatar = imageUrl + '/' + data.seller.avatar;
              //参数
              this.paramImg = imageUrl + '/' + data.product.sizeReference;
              //规格
              data.specs.forEach((sp,specIndex) =>{
                if(sp.hasPhoto === 1){
                  data.specs[specIndex].specValueBean.specoptionProductList.forEach((item)=> {
                    this.specs.spec1.list.push({
                      value: item.value,
                      id: item.id,
                      color: "#a6a6a6",
                      imgUrl: imageUrl + "/" + item.photo
                    });
                  });
                  this.specs.spec1.name = sp.name;
                }
                else{
                  data.specs[specIndex].specValueBean.specoptionProductList.forEach((item)=> {
                    this.specs.spec2.list.push({
                      value :item.value,
                      id :item.id,
                      color :"#a6a6a6"
                    });
                  });
                  this.specs.spec2.name = sp.name;
                }
              });
              //this.pop.popImage = this.specs.spec1.list[0].imgUrl;
              this.pop.popImage = imageUrl + '/' + data.product.listPic;

              this.getStock();
            });
          }
        });
      },
      getComment(){
        let data = new FormData();
        data.append('productId', this.productID);
        data.append('pageNo', 1);
        data.append('pageSize', 2);
        fetch(apiUrl + '/product/commentList',{
          body:data,
          method:'post'
        }).then((response)=>{
          if(200 === response.status){
            response.json().then((res)=>{
              this.commentList = res.data.list.map((item)=>{
                return ({
                  avatar :imageUrl + "/" + item.author.avatar,
                  name :item.author.nickname,
                  content :item.content
                })
              })
            });
          }
        });
      },
      getProps(){
        let data = new FormData();
        data.append('productId', this.productID);
        fetch(apiUrl + '/v2/product/getProductProp',{
          body:data,
          method:'post'
        }).then((response)=>{
          if(200 === response.status){
            response.json().then((res)=>{
              this.paramsList = res.data.props.map((item)=>{
                if(item.isInput==1){
                  return({
                    name:item.name,
                    value:item.propertyValueBean.propertyValue
                  })
                }
                else if(item.isEnum==1){
                  return({
                    name:item.name,
                    value:item.propertyValueBean.propertyoptionList[0].value
                  })
                }
              })
            });
          }
        });
      },
      getStock(){
         let data = new FormData();
         data.append('productId', this.productID);
         data.append('specoptionIdCombo', this.specs.spec1.list[this.specs1Index].id + '_' + this.specs.spec2.list[this.specs2Index].id);
         fetch(apiUrl + '/v2/product/getProductStock',{
          body:data,
          method:'post'
         }).then((response)=>{
          response.json().then((res)=>{
            if(200 === res.code){
              this.pop.popPrice = res.data.price;
              this.pop.popStock = res.data.stock;
            }
          });
         });
      },
      eventFn(ev){
        ev.preventDefault();
      },
      goBuy(){
        this.$modal.show('specModal');
      },
      cancel(){
        this.$modal.hide('specModal')

      },
      beforeOpen (event) {
        this.$refs.productTouch.addEventListener('touchmove', this.eventFn)
      },
      beforeClose (event) {
        this.$refs.productTouch.removeEventListener('touchmove',this.eventFn)
      },
      //记录当前所选规格的索引值
      chooseSpecs1(index){
        this.specs1Index = index;
        this.getStock();
      },
      chooseSpecs2(index){
        this.specs2Index = index;
        this.getStock();
      },
      changeBuyNum(num){
        if(num === 0){
          if(this.buyNum === 1){
            return;
          }
          else{
            this.buyNum--;
          }
        }
        else{
          if(this.buyNum === this.pop.popStock){
            return;
          }
          else{
            this.buyNum++;
          }
        }
      },
      loadMore: function() {
       /* this.busy = true;

        setTimeout(() => {
          for (var i = 0, j = 10; i < j; i++) {
            this.data.push({ name: count++ });
          }
          this.busy = false;
        }, 1000);*/
      },
      sure(){
        this.ADD_PRODUCT({
            productID:this.productID,
            proUrl:this.pop.popImage,
            name:this.mainName,
            specs1:this.specs.spec1.list[this.specs1Index].value,
            specs2:this.specs.spec2.list[this.specs2Index].value,
            specComboId:this.specs.spec1.list[this.specs1Index].id + '_' + this.specs.spec2.list[this.specs2Index].id,
            price:this.pop.popPrice,
            stock:this.buyNum,
            deliveryFee:this.deliveryFee
        });
        if(!getStore('memberToken')){
          this.$router.push({path:'/login?shareCode=' + this.shareCode});
        }
        else{
          this.$router.push('/order')
        }
      }
    }
  }
</script>
<style lang="scss">
.product {
  .paramImg{
    width:100%;
  }
  .change_show_type {
    display: flex;
    flex-direction: row;
    font-size: 32px; /*px*/
    color: #a6a6a6;
    border-bottom: 1px solid #f0f0f0;  /*no*/
    .item {
      margin: 20px 0;
      width: 25%;
      text-align: center;
      .active {
        color: #efb4a9;
        border-bottom: 1px solid #efb4a9; /*no*/
      }

      span {
        display: inline-block;
        height: 100%;
      }
    }
  }
  .swiper-container img {
    width: 100%;
    min-height: 1000px;
  }

  .content {
    img {
      width: 100%;
    }
  }
  .title {
    padding: 16px 40px;
    font-size: 32px;  /*px*/
    div {
      height: auto;
      line-height: 60px;
    }

  .price {
    color: #ec9182;
  }
}
  .tips {
    width: 100%;
    border-width: 1px 0px; /*no*/
    border-style: solid;
    border-color: #eee;
  }

  .avatar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top:80px;
  img {
    width: 152px;
    height: 152px;
    border-radius: 76px;
    border: 2px solid #fff;
  }

  .nickname {
    font-size: 32px; /*px*/
    color: #222;
  }

  .signature {
    font-size: 28px; /*px*/
    color: #888;
  }
}
.introduction {
  margin: 0px 20px;
    img {
      width: 100%;
    }
    p {
      font-size: 28px; /*px*/
      color: #8f8f94;
    }
}

.commentList {
  width: 100%;
}

.comment {
  display: flex;
  flex-direction: row;
  margin: 0px 20px;
  padding: 30px 0px;
  border-bottom: 2px solid #f0f0f0;
  font-size: 28px;  /*px*/
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }
  .com-item {
    display: flex;
    flex-direction: column;
    text-align: left;
    margin-left: 20px;
  }
}


.params {
  margin: 0px 20px;
  font-size: 28px; /*px*/
}

.par-list {
  padding: 0 20px;

.p-item {
  display: flex;
  flex-direction: row;
  border-bottom: 2px solid #f1f1f1;
  height: auto;
  line-height: 100px;
  overflow: hidden;

.left {
  width: 200px;
}

}
}
.bar {
  height: 100px;
  a {
  position: fixed;
  right: 0;
  left: 0;
  bottom: 0;

  line-height: 100px;
  padding-right: 20px;
  padding-left: 20px;

  text-align: center;
  font-size: 32px; /*px*/
  color: #f1f1f1;
  background-color: #ec9282;
  backface-visibility: hidden;

  display: table;
  width: 100%;
  padding: 0;
  border-top: 0;
  border-bottom: 0;
  table-layout: fixed;
  touch-callout: none;
  overflow: hidden;
    z-index:10;
}

}
.pop {

.cancel {
  display: flex;
  justify-content: flex-end;

img {
  width: 40px;
  height: 40px;
  margin: 10px;
}

}
.detail {
  display: flex;
  flex-direction: row;
  padding: 60px 30px 0px;
  background-color: #fff;

img {
  width: 196px;
  height: 196px;
  border: 2px solid #000; /*no*/
}

.content {
  margin-left: 30px;
  display: flex;
  flex-direction: column;

div {
  height: 60px;
  line-height: 60px;
}

.price {
  font-size: 32px; /*px*/
  color: #ec9182;
}

.name {
  font-size: 28px; /*px*/
  color: #222;
}

.stock {
  font-size: 24px; /*px*/
  color: #a6a6a6;
}

}
}
.specs {
  padding: 45px 30px 0px;
  background-color: #fff;

.title {
  font-size: 28px; /*px*/
}

ul {
  display: flex;
  flex-direction: row;

li {
  width: 110px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  border: 1px solid #ddd; /*no*/
  color: #333;
  border-radius: 4px; /*no*/
  margin: 30px 20px 0 0;
}

.active {
  background: #ec9182;
  border: 1px solid #ec9182; /*no*/
  color: #fefefe;
}

}
}
.num {

  p {
    font-size: 28px; /*px*/
  }
  display: flex ;
  flex-direction: row  ;
  justify-content: space-between  ;
  background-color:#fff  ;
  padding:60px  30px;
  .right {
    display: flex;
    flex-direction: row;
    border: 1px solid #ddd; /*no*/
    border-radius: 4px;  /*no*/
.number {
  border-width: 0px 1px; /*px*/
  border-color: #ddd;
  border-style: solid;
}

.least {
  color: #ddd;
}

div {
  width: 66px;
  height: 72px;
  line-height: 72px;
  text-align: center;
}

}
}
.bottom {
  height: 100px;
  line-height: 100px;
  background-color: #ec9182;
  color: #fff;
  text-align: center;
  font-size: 36px; /*px*/
}

}
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-active {
  opacity: 0;
}
.fade-choose-enter-active, .fade-choose-leave-active {
  transition: opacity .5s;
}
.fade-choose-leave, .fade-choose-leave-active {
  display: none;
}
.fade-choose-enter, .fade-choose-leave-active {
  opacity: 0;
}
.router-slid-enter-active, .router-slid-leave-active {
  transition: all .4s;
}
.router-slid-enter, .router-slid-leave-active {
  transform: translate3d(2rem, 0, 0);
  opacity: 0;
}
.swiper-pagination-bullet{
  background-color:#f2f2f2;
}
.swiper-pagination-bullet-active{
  background-color: #fff;
}
</style>
