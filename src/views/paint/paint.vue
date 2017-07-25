<template>
  <div>
    <section>
      <section>
        <div class="back">
          <span class="iconfont" @click="goBack">&#xe664;</span>
        </div>
        <img class="cover" :src="cover">
        <p class="title">{{title}}</p>
        <div class="paintContent" v-html="content"/>

        <div class="product" v-if="hasProduct">
          <p class="title">作品</p>
          <div class="content">
            <div class="item" v-for="item in productList">
              <router-link :to="{path:'./product',query:{productId:item.id}}">
                <img :src="item.image">
                <div class="info">
                  <p class="name">{{item.name}}</p>
                  <p class="price">{{item.price}}元</p>
                </div>
                <div class="more">
                  <img class="checkDetail" src="../../images/playicon2x.png">
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <div class="author">
          <div class="title">
            <span>作者</span>
          </div>
          <div class="content">
            <img :src="author.image">
            <div class="info">
              <div class="nickname">{{author.name}}</div>
              <div class="number">作品{{author.sponsorNum}} | 粉丝{{author.fansNum}}</div>
            </div>
            <div class="follow">
              <p v-show="!isFollow" class="isFollow">+关注</p>
              <p v-show="isFollow" class="notFollow">已关注</p>
            </div>
          </div>
        </div>

        <div class="person">
          <div class="content">
            <div class="num">
              <span class="iconfont">&#xe65f;</span>
              <p>{{likeNum}}</p>
            </div>
            <img v-for="item in personList" class="avatar" :src="item.avatar">
          </div>
        </div>

        <div class="comment">
          <div class="title">
            <span>评价</span>
          </div>
          <div class="commentList">
            <div :key="index1" v-for="(item,index1) in commentList" class="parent">
              <div class="content">
                <img :src="item.avatar">
                <div class="wrap">
                  <div class="top">
                    <p class="name">{{item.name}}</p>
                    <p class="date">{{item.createTime}}</p>
                  </div>
                  <section class="info">{{item.parentContent}}</section>

                  <div class="childCommentList" v-show="item.hasChild">
                    <div :key="index2" v-for="(item2,index2) in item.childCommentList" class="child">
                      <span class="name">{{item2.name}}</span>
                      <span>回复</span>
                      <span class="name">{{item.name}}:</span>
                      <span>{{item2.childContent}}</span>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="moreComment">查看全部评论</div>
        <div class="bottom">
          <img src="../../images/postDownload.png">
          <p>下载【布偶猫】查看更多内容</p>
        </div>

      </section>
    </section>
  </div>
</template>
<script>
  import { apiUrl,imageUrl } from '../../utils/url'
  export default {
    data(){
      return{
        pictorialId:null,
        title:null,
        content:null,
        cover:null,
        hasProduct:false,
        productList:[],
        author:{
          image:null,
          name:null,
          sponsorNum:0,
          fansNum:0
        },
        isFollow:false,
        likeNum:0,
        personList:[],
        commentList:[]
      }
    },
    created(){
      this.pictorialId = this.$route.query['pictorialId'];
      this.initData();
    },
    mounted(){
      //this.initData();
    },
    methods:{
      async initData(){
        await this.getPaintDetail();
        await this.getPersonList();
        await this.getCommentList();
      },
      getPaintDetail(){
        let data = new FormData();
        data.append('pictorialId',this.pictorialId);
        fetch(apiUrl + '/v2/index/detail', {
          method:'post',
          body:data
        }).then(response => {
          response.json().then(res => {
            if(200 === res.code){
              let data = res.data;
              this.cover = imageUrl + '/' + data.cover;
              this.title = data.title;
              this.content = data.content;
              this.productList = data.linkList.map((item) => {
                return {
                  id : item.id,
                  image : imageUrl + '/' + item.img,
                  name : item.name,
                  price : item.price.toFixed(2)
                }
              });
              this.hasProduct = this.productList.length === 0 ? false : true;
              {
                let author = data.author;
                this.author.image = imageUrl + '/' + author.avatar;
                this.author.name = author.nickname;
                this.author.sponsorNum = author.sponsorNum;
                this.author.fansNum = author.fansNum;
              }
              this.likeNum = data.likeNum;
            }
          });
        });
      },
      getPersonList(){
        let data = new FormData();
        data.append('postId',this.pictorialId);
        data.append('pageNo', 1);

        fetch(apiUrl + '/v2/post/manOfLike', {
          method:'post',
          body:data
        }).then(response => {
          response.json().then(res => {
            if(200 === res.code){
              let data = res.data;
              this.personList = data.list.map(item => {
                return {
                  avatar:imageUrl + item.avatar
                }
              });
            }
          });
        });
      },
      getCommentList(){
        let data = new FormData();
        data.append('postId',this.pictorialId);
        data.append('pageNo', 1);
        data.append('pageSize', 3);

        fetch(apiUrl + '/v2/post/commentList', {
          method:'post',
          body:data
        }).then(response => {
          response.json().then(res => {
            if(200 === res.code){
              let data = res.data;
              this.commentList = data.list.map(item => {
                return {
                  avatar:imageUrl + item.author.avatar,
                  name:item.author.nickname,
                  createTime:item.createTime,
                  parentContent:item.content,
                  hasChild : item.childList.length === 0 ? false : true,
                  childCommentList:item.childList.map(item =>{
                    return {
                      name:item.author.nickname,
                      childContent:item.content
                    }
                  })
                }
              });
            }
          });
        });
      },
      goBack(){
        this.$router.go(-1);
      }
    }
  }
</script>
<style lang="scss">
  .paintContent{
    margin:0px 20px;
    p{
      padding:20px 0px;
      color:#a6a6a6;
      font-size: 28px;/*px*/
    }
    img{
      width:100%;
    }
  }
</style>
<style lang="scss" scoped>
  .back{
    position:absolute;
    top:10px;
    left:10px;
    height:70px;
    width:70px;
    line-height:70px;
    background-color:rgba(100,100,100,0.5);
    border-radius:50%;
    color:#fff;
    z-index:10;
    .iconfont{
      display: inline-block;
      width:100%;
      font-size:32px;/*px*/
      text-align: center;
      color:#fff;
    }
  }
  .cover{
    width:100%;
    min-height:422px;
  }
  .title{
    padding : 10px 20px;
    font-size : 36px;/*px*/
    color : #222;
  }
  .product{
    margin:0px 20px;
    padding:20px 0px;
    border-top:1px solid #f1f1f1;/*no*/
    .title{
      text-align: center;
    }
    .content{
      display: flex;
      flex-direction: column;
      padding:20px;
      border:1px solid #f1f1f1;
      .item{
        display: flex;
        flex-direction: row;
        padding:20px;
        border-bottom: 1px solid #f1f1f1;/*no*/
        a{
          display: flex;
          flex: 1;
        }
        img{
          width:90px;
          height: 120px;
          overflow:hidden;
        }
        .info{
          margin-left: 40px;
          width:70%;
          font-size:28px;/*px*/
          p{
            height:60px;
            line-height: 60px;
          }
        }
        .more{
          display:flex;
          flex-direction:column-reverse;
          img{
            width:40px;
            height:40px;
          }
        }
      }
    }
  }

  .author{
    margin:0px 20px;
    padding:20px 0px;
    .title{
      text-align: center;
    }
    .content{
      display: flex;
      flex-direction: row;
      padding:20px;
      background-color:#f1f1f1;
      img{
        width:60px;
        height:60px;
      }
      .info{
        margin-left: 20px;
        width:70%;
        .number{
          color:#a6a6a6;
        }
      }
      .follow{
        display:flex;
        align-items:center;
        .isFollow{
          height:52px;
          line-height:52px;
          width:100px;
          text-align:center;
          border-radius:4px;/*no*/
          background-color:#efb4a9;
          color:#fff;
          font-size:24px;/*px*/
        }
      }
    }
  }

  .person{
    padding:30px 0px;
    border-width: 20px 0px;
    border-style: solid;
    border-color: #efefef;
    width:auto;
    .content{
      display: flex;
      flex-direction: row;
      overflow-x:auto;
      .avatar{
        margin : 0 10px;
        height : 80px;
        width : 80px;
        border-radius : 50%;
      }
    }
    .num{
      margin : 0 10px;
      width:80px;
      height:80px;
      border-radius : 50%;
      text-align : center;
      font-size : 28px;/*px*/
      background-color : #222222;
      color : #f1f1f1;
      .iconfont{
        color:#fff;
        font-size : 28px;/*px*/
      }
      p{
        color:#fff;
      }
    }
  }

  .comment{

    .parent{
      padding:30px 20px;
      font-size:28px;/*px*/
      border-bottom:1px solid #f1f1f1;/*no*/
      .content{
        display:flex;
        flex-direction:row;
        .wrap{
          margin-left: 20px;
          width:100%;
          display:flex;
          flex-direction:column;
        }
        img{
          width:80px;
          height:80px;
          border-radius:50%;
        }
        .top{
          display:flex;
          flex-direction:row;
          justify-content: space-between;
          p{
            color:#a6a6a6;
          }
        }

        .childCommentList{

          padding:10px 20px;
          .child{
            margin: 10px 0px;
            .name{
              color:#a6a6a6;
            }
          }
        }
      }
    }
  }

  .moreComment{
    margin:10px 10px 0px 0px;
    height:100px;
    color:#efb6a6;
    text-align:right;
    font-size:28px;/*px*/
  }
  .bottom{
    img{
      width:100%;
    }
    p{
      margin:20px auto;
      width:360px;
      height:50px;
      line-height:50px;
      text-align:center;
      font-size:24px;/*px*/
      color:#ec9282;
      border:1px solid #ec9282;/*no*/
    }
  }
</style>
