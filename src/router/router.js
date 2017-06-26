/**
 * Created by cloud.wong on 2017/6/25.
 */
import App from '../App.vue'

const product = r  => require.ensure([], () => r(require('../views/product/product.vue')), 'product')
const login = r  => require.ensure([], () => r(require('../views/login/login.vue')), 'login')
const order = r  => require.ensure([], () => r(require('../views/order/order.vue')), 'order')
const address = r  => require.ensure([], () => r(require('../views/address/address.vue')), 'address')

export default [{
  path:'/',
  component:App,
  children:[
    {
      path:'',
      redirect:'./product'
    },
    //商品详细页
    {
      path:'/product',
      component:product
    },
    //登录页
    {
      path: '/login',
      component: login
    },
    //订单列表页
    {
      path: '/order',
      component: order,
    },
    //地址列表页
    {
      path:'/address',
      component:address
    }
  ]
}]
