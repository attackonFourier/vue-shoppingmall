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
  userInfo:null,
  //地址相关
  addressIndex:null,
  addAddress:'',
  newAddress:[],
  deleteAddress:[]
}

export default new Vuex.Store({
  action,
  mutations,
  state,
  getters
})
