/**
 * @author:cloud.wong
 */
import App from '../App.vue'

const index = r  => require.ensure([], () => r(require('../views/index/index.vue')), 'index')
const product = r  => require.ensure([], () => r(require('../views/product/product.vue')), 'product')
const login = r  => require.ensure([], () => r(require('../views/login/login.vue')), 'login')
const order = r  => require.ensure([], () => r(require('../views/order/order.vue')), 'order')
const address = r  => require.ensure([], () => r(require('../views/address/address.vue')), 'address')
const doAddress = r  => require.ensure([], () => r(require('../views/address/children/doAddress.vue')), 'doAddress')
const editAddress = r  => require.ensure([], () => r(require('../views/address/children/editAddress.vue')), 'editAddress')
const invoice = r  => require.ensure([], () => r(require('../views/order/children/invoice.vue')), 'invoice')
const payment = r  => require.ensure([], () => r(require('../views/order/children/payment.vue')), 'payment')
const weiChatCallBack = r  => require.ensure([], () => r(require('../views/order/children/weiChatCallBack.vue')), 'weiChatCallBack')
const paySuccess = r => require.ensure([], () => r(require('../views/order/children/paySuccess.vue')), 'paySuccess')

export default [{
  path:'/',
  component:App,
  children:[
    {
      path:'',
      redirect:'./index'
    },
    {
      path:'index',
      component:index
    },
    //商品详细页
    {
      path:'product',
      component:product
    },
    //登录页
    {
      path: 'login',
      component: login
    },
    //订单列表页
    {
      path: 'order',
      component: order,
      children:[{
        path:'invoice',
        component:invoice
      },{
        path:'payment',
        component:payment
      },{
        path:'weiChatCallBack',
        component:weiChatCallBack
      },{
        path:'paySuccess',
        component:paySuccess
      }],
    },
    //地址列表页
    {
      path:'address',
      component:address,
      children:[{
        path:'doAddress',
        component:doAddress
      },{
        path:'editAddress',
        component:editAddress
      }]
    }
  ]
}]
