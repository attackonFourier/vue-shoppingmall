<template>
<div class="designer"  id="scroll_section">
  <div>
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide v-for="slide in sliderImages" key={{index}}>
        <img :src="slide.img"/>
      </swiper-slide>
      <!-- Optional controls -->
      <div class="swiper-pagination"  slot="pagination"></div>
    </swiper>

    <section class="style">
      <p class="left">设计师风格</p>
      <p class="right">全部设计师
        <span class="iconfont">&#xe675;</span>
      </p>
    </section>

    <div class="styleList">
      <div class="item" v-for="item in styleList">
        <img :src="item.image">
        <div class="name">
          <p class="zn">{{item.name}}</p>
          <p class="en">{{item.ename}}</p>
        </div>
      </div>
    </div>

    <div class="rank">
      <section class="title">
        <div>
          <img src="../../images/top_level_10.png">
        </div>
        <p>本周设计师人气榜</p>
      </section>
    </div>

    <div class="rankList">
      <div class="item" v-for="item in rankList">
        <router-link :to="{path:'./designer/info',query:{sellerId:item.id}}">
          <img :src="item.avatar">
          <div class="content">
            <section>
              <p class="name">{{item.name}}</p>
              <p v-show="item.isFollow==1"  class="right isFocus">已关注</p>
              <p v-show="!(item.isFollow==1)" class="right noFocus">+关注</p>
            </section>
            <p class="signature">{{item.signature}}</p>
          </div>
        </router-link>
      </div>
    </div>

    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
  <foot></foot>
</div>
</template>
<script>
  import { apiUrl,imageUrl } from '../../utils/url'
  import foot from '../../components/footer/foot.vue'
  import BScroll from 'better-scroll'

  export default {
    data(){
      return{
        designerScroll:null,
        sliderImages:[],
        swiperOption: {
          notNextTick: true,
          direction: 'horizontal',
          pagination : '.swiper-pagination',
          loop:true
        },
        styleList:[],
        rankList:[]
      }
    },
    components:{
      foot
    },
    mounted(){
      this.$nextTick(() => {
        this.designerScroll = new BScroll('#scroll_section',{
          probeType: 3,
          deceleration: 0.003,
          bounce: false,
          swipeTime: 2000,
          click: true,
        });
        this.designerScroll.on('scroll',(pos)=>{
          /*if (Math.abs(Math.round(pos.y)) >=  Math.abs(Math.round(this.ratingScroll.maxScrollY))) {
           //this.loaderMoreRating();

           }*/
          this.designerScroll.refresh();
        });
      })
    },
    created(){
      this.initData();
    },
    methods:{
      async initData(){
        await this.getDesignerBanner();
        await this.getStyleList();
        await this.getRankList();
      },
      getDesignerBanner(){
        let data = new FormData();
        data.append('count',5);

        fetch(apiUrl + '/designer/banner', {
          method:'post',
          body:data
        }).then(response => {
          response.json().then(res => {
            if(200 === res.code){
              this.sliderImages = res.data.map(item => {
                return {
                  id: item.link,
                  img:imageUrl + '/' + item.img,
                }
              });
            }
          });
        });
      },
      getStyleList(){
        let data = new FormData();
        data.append('count',5);

        fetch(apiUrl + '/designer/v2/getDesignStyleList', {
          method:'post',
        }).then(response => {
          response.json().then(res => {
            if(200 === res.code){
              this.styleList = res.data.map(item => {
                return {
                  id: item.link,
                  image:imageUrl + '/' + item.background,
                  name:item.name,
                  ename:item.ename
                }
              });
            }
          });
        });
      },
      getRankList(){

        fetch(apiUrl + '/designer/v2/findPopularDesigner', {
          method:'post',
        }).then(response => {
          response.json().then(res => {
            if(200 === res.code){
              this.rankList = res.data.designers.map(item => {
                return {
                  id: item.id,
                  avatar:imageUrl + '/' + item.avatar,
                  name:item.nickname,
                  signature:item.signature
                }
              });
            }
          });
        });
      }
    }
  }
</script>
<style lang="scss" scoped>
  .swiper-slide{
    img {
      width:100%;
      min-height: 340px;
    }
  }
  .designer{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:#fff;
    z-index: 200;
    margin-bottom:90px;
  }
  .style{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin:20px 20px 0px;
    .left{
      font-size: 28px;/*px*/
      color:#222;
    }
    .right{
      font-size: 24x;/*px*/
      color:#888;
    }
  }

  .styleList{
    display: flex;
    flex-direction: row;
    margin:40px 14px;
    overflow:hidden;
    .item{
      width:25%;
      margin:0px 10px;
      overflow:hidden;
      position:relative;
      text-align:center;
      .name{
        position: absolute;
        top:0px;
        display: flex;
        flex-direction: column;
        align-items: center;
        width:100%;
        height:100%;
        p{
          width: 100%;
          height: 50%;
          color:#fff;
          background-color:rgba(100,100,100,0.6);
        }
        .zn{
          padding-top:25%;
          font-size: 32px;/*px*/
          border-radius:10px 10px 0px 0px;/*no*/
        }
        .en{
          font-size: 18px;/*px*/
          border-radius:0px 0px 10px 10px;/*no*/
        }
      }
      img{
        width:100%;
        height: 100%;
        border-radius:10px;/*no*/
      }
    }
  }

  .rank{
    padding:32px 0 28px;
    border-top:20px solid #e3e5ea;/*no*/
    .title{
      display: flex;
      flex-direction: row;
      padding:10px 28px;
      img{
        width:134px;
      }
      p{
        margin-left: 20px;
        font-size: 28px;/*px*/
      }
    }
  }

  .rankList{
    display:flex;
    flex-direction:column;
    .item{
      display: flex;
      flex-direction: row;
      margin:0px 28px;
      padding:32px 0px;
      border-bottom:1px solid #ededed;/*no*/
      a{
        display: flex;
        flex: 1;
      }
      img{
        width:120px;
        height:120px;
        border-radius: 50%;
      }
      .content{
        display: flex;
        flex-direction: column;
        padding:0px 20px;
        width:100%;
        section{
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          .name{
            height:52px;
            line-height: 52px;
            font-size: 32px;/*px*/
            color:#333;
          }
        }
        .signature{
          height: 80px;
          line-height: 80px;
          color:#888;
          overflow:hidden;
          text-overflow:ellipsis;
          white-space:nowrap;
        }
        .right{
          width:100px;
          height:50px;
          line-height:50px;
          color:#fff;
          border-radius:4px;/*no*/
          font-size:24px;/*px*/
          text-align:center;
          background-color:#f0b3a9;
        }
      }
    }
  }
</style>
