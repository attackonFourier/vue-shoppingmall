<template>
  <div class="address">
    <headTop head-title="收货地址" go-back="true">
      <div slot="add" class="add">
        <router-link to="./address/doAddress" class="add_icon_footer" >
          <span>{{addText}}</span>
        </router-link>
      </div>
    </headTop>
    <div class="wrap_address">
      <div class="address_list">
        <div v-for="(item,index) in addressList" class="item">
          <span class="iconfont left" @click.prevent.stop="chooseAddress(item,index,item.id)">{{defaultIndex === index ? '&#xe63e;':'&#xe66e;'}}</span>
          <div class="detail">
            <p class="title">
              <span class="text">收件人：</span>{{item.addressee}}    {{item.mobile}}
              <span v-show="item.isDefault === 1">默认</span>
            </p>
            <p class="content">
              <span class="text">收货地址：</span>
              {{item.proviceName + item.cityName + item.countyName + item.detail}}
            </p>
          </div>
          <!--<span class="iconfont right" @click.prevent.stop="editAddress(item.id)">&#xe61b;</span>-->
        </div>
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
    created () {
      this.initData();
    },
    methods:{
      ...mapMutations([
        'CHOOSE_ADDRESS','RECORD_ADDRESSID'
      ]),
      async initData(){
        await this.getAddressList();
      },
      chooseAddress(address,index,id){
        this.CHOOSE_ADDRESS({address,index,id});
        this.$router.go(-1);
      },
      editAddress(id){
        this.RECORD_ADDRESSID(id);
        this.$router.push('./address/editAddress');
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
      },
      addressIndex(){
        if(this.newAddress.length > 0){
          this.addressIndex += 1;
        }
      }
    },
  }
</script>
<style lang="scss" scoped>
  .address{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:#f0f0f0;
    z-index: 202;
    padding-top:90px;
    font-size:32px;/*px*/
    .add{
      padding:0 20px;
      span{
        color:#fff;
      }
    }

    .address_list{
      .item{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding:30px;
        height:auto;
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

  .wrap_address{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    padding-top: 90px;
    overflow-y: auto;
  }
  /*.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(100%, 0, 0);
    opacity: 0;
  }*/
</style>
