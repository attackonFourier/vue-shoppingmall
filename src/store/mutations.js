/**
 * Created by cloud.wong on 2017/6/26.
 */
import {
  RECORD_USERINFO,
  ADD_PRODUCT,
  GET_USERINFO,
  CHOOSE_ADDRESS,
  RECORD_ADDRESSID,
  CONFIRM_ADDRESS,
  ADD_INVOICE,
  RECORD_ORDERID
} from './mutation-types'

import {setStore, getStore} from '../utils/util'

export default {
  [RECORD_USERINFO](state,info){
    state.userInfo = info;
    state.login = true;
    setStore('memberToken',info.memberToken);
  },
  [ADD_PRODUCT](state,{
    productID,
    proUrl,
    name,
    specs1,
    specs2,
    specComboId,
    price,
    stock,
    deliveryFee
  }){
    let info = {
      'productID':productID,
      'proUrl':proUrl,
      'name':name,
      'specs1':specs1,
      'specs2':specs2,
      'specComboId':specComboId,
      'price':price,
      'stock':stock,
      'deliveryFee':deliveryFee
    };
    state.productInfo = info;
    setStore('product',JSON.stringify(state.productInfo));
  },
  [CHOOSE_ADDRESS](state,{
    address,
    index,
    id
  }){
    state.chooseAddress = address;
    state.addressIndex = index;
    state.addressID = id;
  },
  [CONFIRM_ADDRESS](state, newAddress) {
    state.newAddress.push(newAddress);
  },
  [RECORD_ADDRESSID](state,id){
    state.addressID = id;
  },
  [ADD_INVOICE](state,{
    invoiceType,
    titleType,
    receive,
    mobile,
    email,
    contentType
  }){
    let info = {
      'invoiceType':invoiceType,
      'titleType':titleType,
      'receive':receive,
      'mobile':mobile,
      'email':email,
      'contentType':contentType
    };
    state.invoiceInfo = info;
  },
  [RECORD_ORDERID](state,id){
    state.orderID = id;
    setStore('orderNumber',state.orderID);
  },

}
