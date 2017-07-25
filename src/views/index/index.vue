<template>
  <div class="main">
    <div v-if="!showLoading" class="mainContainer">
      <section class="change_show_type" ref="main_header">
        <div class="item">
          <span :class='{active: changeShowType =="video"}' @click="changeShowType='video'">视频</span>
        </div>
        <div class="item">
          <span :class='{active: changeShowType =="pictorial"}' @click="changeShowType='pictorial'">画报</span>
        </div>
        <div class="item">
          <span :class='{active: changeShowType =="attention"}' @click="changeShowType='attention'">秀场</span>
        </div>
      </section>

      <transition name="fade-choose">
        <section v-show="changeShowType === 'video'">
          111
        </section>
      </transition>

      <transition name="fade-choose">
        <section v-show="changeShowType === 'pictorial'" id="wrapperPictorial" class="pictorial_list" ref="wrapper_pictorial">
          <ul>
            <li class="item" v-for="(item,index) in pictorialList">
              <router-link :to="{path:'./paint',query:{pictorialId:item.id}}">
                <img class="mainImage" :src="item.imgUrl"/>
                <p class="title">{{item.title}}</p>
                <div class="bottom">
                  <div class="left">
                    <img :src="item.avatar"/>
                    <p>{{item.authorName}}</p>
                  </div>
                  <div class="right">
                    <div class="num">
                      <span class="iconfont">&#xe68c;</span>
                      {{item.likeNum}}
                    </div>
                    <div class="num">
                      <span class="iconfont">&#xe68b;</span>
                      {{item.commentNum}}
                    </div>
                  </div>
                </div>
              </router-link>
            </li>
          </ul>
        </section>
      </transition>

      <transition name="fade-choose">
        <section v-show="changeShowType === 'attention'">
          333
        </section>
      </transition>

      <foot></foot>
    </div>

    <loading v-show="showLoading"></loading>

    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import {apiUrl ,imageUrl} from '../../utils/url'
  import {loadMore} from '../../components/common/mixin'
  import foot from '../../components/footer/foot.vue'
  import loading from '../../components/common/loading.vue'
  import BScroll from 'better-scroll'

  export default{
    data(){
      return{
        showLoading: true, //显示加载动画
        changeShowType:'pictorial',
        pictorialList:[],
        pictorialScroll:null,
        //屏幕的高度
        windowHeight: null,
      }
    },
    mixins:[loadMore],
    components:{
      loading,
      foot
    },
    watch:{
      showLoading(value){
        if (!value) {
          this.$nextTick(() => {
            this.getListHeight();
          })
        }
      },
      changeShowType(value){
        if(value === 'pictorial'){
          this.$nextTick(()=>{
            this.pictorialScroll = new BScroll('#wrapperPictorial',{
              deceleration: 0.003,
              bounce: false,
              swipeTime: 2000,
              click: true,
            });
            console.log(this.pictorialScroll )
            this.pictorialScroll.on('scroll',(pos)=>{
              /*if (Math.abs(Math.round(pos.y)) >=  Math.abs(Math.round(this.ratingScroll.maxScrollY))) {
               //this.loaderMoreRating();
               this.pictorialScroll.refresh();
               }*/
            });
          });
        }
      }
    },
    mounted(){
      this.initData();
      this.windowHeight = window.innerHeight;
    },
    methods:{
      //隐藏动画
      hideLoading(){
        this.showLoading = false;
      },
      async initData(){
        await this.getPictorialList();
        this.hideLoading();
      },
      getListHeight(){
        const baseHeight = this.$refs.main_header.clientHeight;
        const list = this.$refs.wrapper_pictorial;
        this.listenScroll(list);
      },
      listenScroll(list){
        this.pictorialScroll = new BScroll(list,{
          probeType: 3,
          deceleration: 0.003,
          bounce: false,
          swipeTime: 2000,
          click: true,
        });
        this.pictorialScroll.on('scroll',(pos)=>{
          /*if (Math.abs(Math.round(pos.y)) >=  Math.abs(Math.round(this.ratingScroll.maxScrollY))) {
           //this.loaderMoreRating();

           }*/
          this.pictorialScroll.refresh();
        });
      },
      getPictorialList(){
        let data = new FormData();
        data.append('pageNo',1)
        data.append('pageSize',10)
        fetch(apiUrl + '/v2/index/recommend',{
          method:'post',
          body:data
        }).then(response=>{
          response.json().then((res)=>{
            if(200 === res.code){
              let data = res.data;
              data.list.forEach((item)=>{
                if(1 === item.type){
                  this.pictorialList.push({
                    id:item.post.id,
                    imgUrl : imageUrl + "/" + item.post.cover,
                    title : item.post.title,
                    avatar: imageUrl + "/" + item.post.author.avatar,
                    authorName:item.post.author.nickname,
                    likeNum:item.post.likeNum,
                    commentNum:item.post.commentNum
                  });
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
  .mainContainer{
    display:flex;
    flex-direction:column;
    position:absolute;
    left:0;
    right:0;
    height:100%;
  .change_show_type{
    display: flex;
    flex-direction: row;
    justify-content: center;
    position: fixed;
    top:0;
    left:0;
    right:0;
    width:100%;
    height:90px;
    line-height: 90px;
    background-color:#26282d;
  .item{
    width:auto;
    padding:0px 40px;
  .active{
    color:#ec9182;
  }
  span{
    font-size: 32px;/*px*/
    color:#a9a9a9;
  }
  }
  }
  }

  .pictorial_list{
    margin-top:90px;
    flex: 1;
    flex-direction: column;
    overflow-y:hidden;
    ul{
      display:flex;
      flex-direction: column;
      height:auto;
    }
  .item{
    height:100%;
  .title{
    margin:10px;
    font-size: 36px;/*px*/
  }

  .bottom{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin:0 10px;
    padding:10px 0 20px;
    font-size:28px;/*px*/
  .left{
    display:flex;
    flex-direction:row;
    line-height:60px;
  p{
    margin-left:20px;
    color:#a6a6a6;
  }
  img{
    height: 60px;
    width: 60px;
    border-radius: 50%;
  }
  }

  .right{
    display: flex;
    flex-direction: row;
  .num{
    margin: 0px 30px;
    line-height: 60px;
    color:#a6a6a6;
  }
  .iconfont{
    font-size: 28px;/*px*/
    color:#a6a6a6;
  }
  }
  }

  .mainImage{
    width:100%;
    min-height:422px;
    vertical-align: top;
  }
  }
  }


</style>
