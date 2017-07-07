<template>
  <div class="invoice">
    <headTop head-title="发票信息" go-back="order">
      <div slot="title" class="title">
        <span>{{title}}</span>
      </div>
    </headTop>
    <div class="content">
      <p class="title">发票类型</p>
      <section class="change_show_type">
        <div class="item" :class='{active: changeShowType =="unNeed"}' >
          <span @click="changeShowType='unNeed'">默认(不开发票)</span>
        </div>
        <div class="item" :class='{active: changeShowType =="electron"}'>
          <span @click="changeShowType='electron'">电子发票</span>
        </div>
        <div class="item" :class='{active: changeShowType =="paper"}'>
          <span @click="changeShowType='paper'">普通发票(纸质)</span>
        </div>
      </section>

      <transition name="fade-choose">
        <section v-show="changeShowType === 'noNeed'">
        </section>
      </transition>

      <transition name="fade-choose">
        <section v-show="changeShowType === 'electron'">
          <div class="electron">
            <div class="top">
              <p>发票抬头</p>
              <div>
                <span @click="chooseTop = 1" class="iconfont">{{chooseTop ===1 ? '&#xe63e;':'&#xe66e;' }}</span>
                个人
                <span @click="chooseTop = 2" class="iconfont">{{chooseTop ===2 ? '&#xe63e;':'&#xe66e;' }}</span>
                单位
              </div>
              <input type="text" class="input" v-model="receive" placeholder="请填写个人/单位名称">
            </div>

            <div class="content">
              <p>收票人信息</p>
              <div class="mobile">
                *收票人手机<input v-model="mobile" type="tel" name="input" placeholder="手机号码">
              </div>
              <div class="email">
                收票人邮箱<input v-model="email" type="text" name="input" placeholder="用来接收电子发票邮箱，可选填">
              </div>
            </div>

            <div class="bottom">
              <p>发票内容</p>
              <div>
                <span @click="chooseBottom = 1" class="iconfont">{{chooseBottom ===1 ? '&#xe63e;':'&#xe66e;' }}</span>明细
              </div>
              <div>
                <span @click="chooseBottom =2" class="iconfont">{{chooseBottom ===2 ? '&#xe63e;':'&#xe66e;' }}</span>服饰
              </div>
            </div>
          </div>
        </section>
      </transition>

      <transition name="fade-choose">
        <section v-show="changeShowType === 'paper'">
          <div class="paper">
            <div class="top">
              <p>发票抬头</p>
              <div>
                <span @click="chooseTop = 1" class="iconfont">{{chooseTop ===1 ? '&#xe63e;':'&#xe66e;' }}</span>
                个人
                <span @click="chooseTop = 2" class="iconfont">{{chooseTop ===2 ? '&#xe63e;':'&#xe66e;' }}</span>
                单位
              </div>
              <input type="text" class="input" v-model="receive" placeholder="请填写个人/单位名称">
            </div>

            <div class="bottom">
              <p>发票内容</p>
              <div>
                <span @click="chooseBottom = 1" class="iconfont">{{chooseBottom ===1 ? '&#xe63e;':'&#xe66e;' }}</span>明细
              </div>
              <div>
                <span @click="chooseBottom =2" class="iconfont">{{chooseBottom ===2 ? '&#xe63e;':'&#xe66e;' }}</span>服饰
              </div>
            </div>
          </div>
        </section>
      </transition>
    </div>
    <div class="determine" @click="confrimInvoice">确定</div>
  </div>
</template>

<script>
  import headTop from '../../../components/header/head.vue'
  import {mapMutations} from 'vuex'

  export default {
    data(){
      return{
        title:'发票须知',
        chooseTop:1,
        changeShowType:'unNeed',
        chooseBottom:1,
        invoiceType:null,
        invoice: false, //是否需要发票
        receive:'',
        mobile:null,
        email:null,
      }
    },
    components: {
      headTop,
    },
    props:[],
    methods: {
      ...mapMutations([
        'CONFIRM_INVOICE'
      ]),
      //保存发票信息
      confrimInvoice(){
        this.CONFIRM_INVOICE({
          'invoiceType':invoiceType,
          'titleType':titleType,
          'receive':this.receive,
          'mobile':this.mobile,
          'email':this.email,
          'contentType':contentType
        });
        this.$router.go(-1);
      },
    }
  }
</script>

<style lang="scss">
  @import '../../../style/common.scss';
  @mixin distance{
    padding:0 20px;
    margin-top:20px;
    background-color: #fff;
  }
  .invoice{
    .iconfont{
      font-size:32px;/*px*/
    }
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:#f0f0f0;
    z-index: 204;
    padding-top: 90px;
    .content{
      .title{
        padding:36px 0 0 20px;
        font-size: 36px;/*px*/
        background-color:#fff;
      }
    }
  .change_show_type {
    display: flex;
    flex-direction: row;
    padding:10px;
    text-align: center;
    color:#a6a6a6;
    background-color:#fff;
    font-size:28px;/*px*/
  .item{
    margin:10px;
    padding:10px;
    width:33.3333%;
    border:1px solid #a6a6a6;/*no*/
    border-radius:5px;
  }
  .active{
    border-color:#222;
    color:#222;
  }
  }
    .determine{
      margin:0 20px;
      margin-top:20px;
      line-height:90px;
      border-radius:10px;
      background-color:#222;
      font-size:32px;/*px*/
      color:#fff;
      text-align:center;
    }
    .electron,.paper{
      .top{
        @include distance;
        padding-bottom:20px;
        p{
          font-size:32px;/*px*/
          height:100px;
          line-height:100px;
        }
        div{
          font-size: 28px;/*px*/
        }
        .input{
          width:100%;
          border:1px solid #a6a6a6;/*no*/
          margin:20px 60px 0 0;
          padding-left:20px;
          background-color:#eef2f3;
        }
      }
      .content{
        @include distance;
        display: flex;
        flex-direction: column;
        p{
          font-size:32px;/*px*/
          height:100px;
          line-height:100px;
          border-bottom:1px solid #f0f0f0;/*no*/
        }
        .mobile,.email{
          height:90px;
          line-height:90px;
          font-size:28px;/*px*/
          color:#666;
          border-bottom:1px solid #f0f0f0;/*no*/
          input{
            margin-left: 10px;
          }
        }
      }
      .bottom{
        @include distance;
        padding-bottom:20px;
        p{
          font-size:32px;/*px*/
          height:100px;
          line-height:100px;
        }
        div{
          margin-top: 10px;
          font-size:28px;/*px*/
        }
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
</style>
