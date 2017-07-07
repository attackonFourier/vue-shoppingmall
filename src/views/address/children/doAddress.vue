<template>
  <div class="doAddress">
    <headTop head-title="收货地址" go-back="true">
      <div slot="save" class="save">
        <span @click="save">保存</span>
      </div>
    </headTop>

    <div class="address_container">
      <div class="adr-item">
        <input v-model="addressee" type="text" class="input" name="input" placeholder="收货人姓名">
      </div>
      <div class="adr-item">
        <input v-model="mobile" type="tel" class="input" name="input" placeholder="手机号码">
      </div>
      <div class="adr-item" @click="addressZoom">
        <span>{{chooseAddress[0]}}&nbsp;&nbsp;&nbsp;{{chooseAddress[1]}}&nbsp;&nbsp;&nbsp;{{chooseAddress[2]}}</span>
        <span class="iconfont">&#xe675;</span>
      </div>
      <div class="adr-item">
        <input v-model="detail" type="text" class="input" name="input" placeholder="详细地址">
      </div>
      <div class="adr-item">
        <div class="default">设置默认地址</div>
        <div class="button_switch">
          <div class="circel_button" :class="{trans_to_right: setDefault}" @click="changeDefault"></div>
        </div>
      </div>

    </div>
    <modal name="adrModal"
           :width="'100%'"
           :height="'auto'">
      <div class="pop">
        <div class="title">
          <div class="center">所在地区</div>
          <div class="right" @click="sureClick">确定</div>
        </div>
        <section class="address" ref="addressZoomList" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10">
          <ul>
            <li :key="index" v-for="(item,index) in areaList" @click="areaListClick(index,item)">{{item.placeZh}}</li>
          </ul>
        </section>
      </div>
    </modal>
    <alert-tip v-if="showAlert" @closeTip="closeTipFun" :alertText="alertText"></alert-tip>
  </div>
</template>
<script>
  import headTop from '../../../components/header/head.vue'
  import {apiUrl,imageUrl} from '../../../utils/url'
  import {getStore} from '../../../utils/util'
  import Scroll from 'better-scroll'
  import {mapState, mapMutations} from 'vuex'
  import alertTip from '../../../components/common/alertTip.vue'

  export default{
    data(){
      return {
        addressee: null,
        mobile: null,
        detail:null,
        chooseAddress :['请选择所在地区','',''],
        chooseIndex:0,
        addressScroll:null,
        areaCode1:'',
        areaCode2:'',
        areaCode3:'',
        areaList:[],
        setDefault:false,
        addText: '新增',
        showAlert: false,
        alertText: null
      }
    },
    props: [],
    components: {
      headTop,
      alertTip
    },
    mounted(){
      this.initData();
    },
    methods:{
      ...mapMutations([
        'CONFIRM_ADDRESS'
      ]),
      async initData(){
      },
      async addressZoom(){
        await this.getAddress('',1);
        this.$modal.show('adrModal');
        const addressContainer = this.$refs.addressZoomList;
        this.listenScroll(addressContainer);
      },
      changeDefault(){
        this.setDefault = !this.setDefault;
      },
      listenScroll(element){
        let oldScrollTop;
        let requestFram;
        /*this.addressScroll = new Scroll(element, {
          probeType: 3,
          deceleration: 0.001,
          bounce: false,
          swipeTime: 2000,
          click: true,
        });*/

      },
      loadMore(){

      },
      areaListClick(index,item){
        //this.chooseIndex = index;
        this['areaCode' + item.level] = item.id;
        this.chooseAddress[--item.level] = this.areaList[index].placeZh;
        if(item.level < 3){
          this.getAddress(this.areaList[index].id,item.level++);
        }
        else{
          this.chooseIndex = index;
        }
      },
      sureClick(){
        this.$modal.hide('adrModal');
      },
      save(){
        if(!this.addressee){
          this.showAlert = true;
          this.alertText = '请输入姓名'
        }
        else if(!this.mobile){
          this.showAlert = true;
          this.alertText = '请输入电话号码'
        }
        else if(!this.detail){
          this.showAlert = true;
          this.alertText = '请输入详细地址'
        }
        else {
          const token = getStore('memberToken').replace(/\"/g, '')
          let data = new FormData();
          data.append('memberToken', token);
          data.append('addressee', this.addressee);
          data.append('mobile', this.mobile);
          data.append('areaIdCombo', [this.areaCode1, this.areaCode2, this.areaCode3].join(','));
          data.append('detail', this.detail);
          data.append('isDefault', this.setDefault ? 1 : 0);
          data.append('type', 0);
          fetch(apiUrl + '/v2/address/add', {
            method: 'post',
            body: data
          }).then(response => {
            response.json().then(res=> {
              if (200 === res.code) {
                this.CONFIRM_ADDRESS(1);
                this.$router.go(-1);
              }
              else {
                this.showAlert = true;
                this.alertText = res.msg;
              }
            })
          });
        }
      },
      getAddress(areaCode,level){
        let data = new FormData();
        data.append('areaCode',areaCode)
        fetch(apiUrl + '/area/v2/findAllArea',{
          body:data,
          method:'post'
        }).then((response) =>{
          response.json().then((res)=>{
            if(200 === res.code){
              this.areaList = res.data;
            }
          });
        });
      },
      closeTipFun(){
        this.showAlert = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  @mixin wh($width, $height){
    width: $width;
    height: $height;
  }
  @mixin sc($size, $color){
    font-size: $size;/*px*/
    color: $color;
  }
  .doAddress{
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color:#fff;
    z-index: 204;
    margin-top: 90px;
    .save{
      padding:0 20px;
      span{
        color:#fff;
      }
    }
    .adr-item{
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      margin:0px 30px;
      border-bottom:1px solid #f1f1f1;/*no*/
      height:92px;
      color:#222;
      font-size:28px;/*px*/
      .input{
        width:100%;
        border:none;
        height:90px;
      }
      .button_switch{
        background-color: #ccc;
        display: flex;
        justify-content: center;
      @include wh(80px, 30px);
        padding: 0 20px;
        border: 1px;
        line-height:90px;
        border-radius: 20px;
        margin-top:30px;
        position: relative;
  .circel_button{
    transition: all .3s;
    position: absolute;
    top: -15px;
    z-index: 1;
    left: -15px;
  @include wh(60px, 60px);
    box-shadow: 0 0.026667rem 0.053333rem 0 rgba(0,0,0,.1);
    background-color: #f1f1f1;
    border-radius: 50%;
  }
  .trans_to_right{
    transform: translateX(60px);
    background-color: #888;
  }
  span{
  @include sc(.45rem, #fff);
    transform: translateY(.05rem);
    line-height: .6rem;
  }
  span:nth-of-type(2){
    transform: translateY(-.08rem);
  }
  }
      span{
        line-height:90px;
      }
      .iconfont{
        font-size:36px;/*px*/
      }
      .default{
        line-height: 90px;
      }
    }
    .pop{
      position:relative;
      left:0;
      right:0;
      bottom:0;
      width:100%;
      background-color:#fff;
      box-shadow:none;
      border-radius:0px;
    z-index:1000;
      .title{
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        text-align: center;
        height:100px;
        line-height:100px;
        font-size:28px;/*px*/
        padding:0 20px;
        border-bottom:1px solid #ccc;/*no*/
        .center{
          width:80%;
        }
      }
      .choose{
        padding-left:20px;
        height:80px;
        line-height:80px;
        border-bottom:1px solid #ccc;/*no*/
        color:#222;
      }
      .address{
        height:540px;
        overflow-y:auto;
        font-size:28px;/*px*/
        line-height:60px;
        margin-left:20px;
        color:#a6a6a6;
      }
    }
  }
  /*.router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(100px, 0, 0);
    opacity: 0;
  }*/
</style>
