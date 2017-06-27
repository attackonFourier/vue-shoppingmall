<template>
  <div class="address">
    <headTop head-title="收货地址" go-back="true">
      <div slot="add" class="add">
        <router-link to="/adderss/doAddress" class="add_icon_footer" >
          <span>{{addText}}</span>
        </router-link>
      </div>
    </headTop>

    <div class="address_list">
      <div v-for="(item,index) in addressList" class="item">
        <span v-show="item.isChoose" class="iconfont left">&#xe63e;</span>
        <span v-show="!item.isChoose" class="iconfont left" @click="check(index)">&#xe66e;</span>
        <div class="detail" @click="check(index)">
          <p class="title">
            <span class="text">收件人：</span>{{item.addressee}}    {{item.mobile}}
            <span v-show="index === 0">默认</span>
          </p>
          <p class="content">
            <span class="text">收货地址：</span>
            {{item.detail}}
          </p>
        </div>
        <span class="iconfont right" @click="edit(item.id)">&#xe61b;</span>
      </div>
    </div>
    <transition name="router-slid" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>
<script>
  import headTop from '../../components/header/head.vue'
  import {mapState,mapMutations} from 'vuex'
  import {apiUrl} from '../../utils/url'
  import {getStore} from '../../utils/util'

  export default{
    data(){
      return{
        addressList:[],
        id:null,
        addText:'新增'
      }
    },
    props:[],
    components:{
      headTop,
    },
    computed:{
      ...mapState([
        'addressIndex','newAddress'
      ]),
      defaultIndex(){
        if(this.addressIndex){
          return this.addressIndex;
        }
        else{
          return 0;
        }
      }
    },
    mounted () {
      this.initData();
    },
    methods:{
      ...mapMutations([
        'CHOOSE_ADDRESS'
      ]),
      async initData(){
        await this.getAddressList();
      },
      chooseAddress(address,index){
        this.CHOOSE_ADDRESS({address,index});
        this.$router.push(-1);
      },
      getAddressList(){
        let data = new FormData();
        data.append('memberToken',getStore('memberToken').replace(/\"/g,''))
        fetch(apiUrl + '/v2/address/list',{
          body:data,
          method:'post'
        }).then((response) =>{
          response.json().then((res)=>{
            if(200 === res.code){
              this.addressList = res.data;
            }
          });
        });
      }
    },
    watch:{
      newAddress(value){
        this.initData();
      }
    },
  }
</script>
<style lang="scss" scoped>
  .address{
    margin-top:90px;
    background-color:#f2f2f2;
    .address_list{
      .item{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding:30px;
        height:160px;
        background-color:#fff;
        margin-bottom:20px;
        .detail{
          width:80%;
          font-size:28px;/*px*/
          p{
            line-height: 60px;
          }
        }
        .left,.right{
          line-height: 120px;
          font-size:48px;/*px*/
        }
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
