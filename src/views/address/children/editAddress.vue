<template>
  <div class="editAddress">
    <headTop head-title="编辑地址" go-back="true">
      <div slot="save" class="save">
        <span @click="save">删除</span>
      </div>
    </headTop>
    <p>右上角点击删除该地址</p>
    <alert-tip v-if="showAlert" @closeTip="closeTipFun" :alertText="alertText"></alert-tip>
  </div>
</template>
<script>
  import headTop from '../../../components/header/head.vue'
  import {apiUrl,imageUrl} from '../../../utils/url'
  import {getStore} from '../../../utils/util'
  import alertTip from '../../../components/common/alertTip.vue'
  import {mapState,mapMutations} from 'vuex'

  export default{
    data(){
      return {
        showAlert: false,
        alertText: null
      }
    },
    props: [],
    components: {
      headTop,
      alertTip
    },
    computed:{
      ...mapState([
        'addressID'
      ]),
    },
    methods:{
      sureClick(){
        this.$modal.hide('adrModal');
      },
      save(){
        const token = getStore('memberToken').replace(/\"/g,'')
        let data = new FormData();
        data.append('memberToken',token);
        data.append('addressId',this.addressID);

        fetch(apiUrl + '/v2/address/delete',{
          method:'post',
          body:data
        }).then(response =>{
          response.json().then(res=>{
            if(200 === res.code){
              this.$router.go(-1);
            }
            else{
              this.showAlert = true;
              this.alertText = res.msg;
            }
          })
        });
      },
      closeTipFun(){
        this.showAlert = false;
      }
    }
  }
</script>
<style lang="scss" scoped>
  .editAddress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 204;
    padding-top: 90px;
    p{
      margin-top: 20px;
      color:#222;
      text-align: center;
    }
    .save{
      span{
        color:#fff;
      }
    }
  }

  .router-slid-enter-active, .router-slid-leave-active {
    transition: all .4s;
  }
  .router-slid-enter, .router-slid-leave-active {
    transform: translate3d(100px, 0, 0);
    opacity: 0;
  }
</style>
