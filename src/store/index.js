/**
 * Created by cloud.wong on 2017/6/26.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import action from './action'
import getters from './getter'

Vue.use(Vuex)

const state ={
  productInfo:{},
  userInfo:null,
  //地址相关
  addressIndex:null,
  addressID:null,
  addAddress:'',
  newAddress:[],
  deleteAddress:[],
  //发票
  invoiceInfo:{},

  orderID:null
}

export default new Vuex.Store({
  action,
  mutations,
  state,
  getters
})
