/**
 * Created by cloud.wong on 2017/6/26.
 */
import {
  RECORD_USERINFO,
  GET_USERINFO,
  CHOOSE_ADDRESS
} from './mutation-types'

import {setStore, getStore} from '../utils/util'

export default {
  [RECORD_USERINFO](state,info){
    state.userInfo = info;
    state.login = true;
    setStore('memberToken',info.memberToken);
  },
  [CHOOSE_ADDRESS](state,{
    address,
    index
  }){
    state.chooseAddress = address;
    state.addressIndex = index;
  },

}
