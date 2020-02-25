import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Products from './views/Products.vue'
import ProductDetail from './views/ProductDetail.vue'
import Service from './views/Service.vue'
import Login from './views/Login.vue'
import Logout from './views/Logout.vue'
import Register from './views/Register.vue'
import Bag from './views/Bag.vue'
import User from './views/User.vue'
import Admin from './views/Admin.vue'
import ManageProducts from './views/ManageProducts.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },

    {
      path: '/service',
      name: 'service',
      component: Service
    },

    {
      path: '/products',
      name: 'products',
      component: Products
    },

    {
      path: '/login',
      name: 'login',
      component: Login
    },

    {
      path: '/logout',
      name: 'logout',
      component: Logout
    },

    {
      path: '/register',
      name: 'register',
      component: Register
    },

    {
      path: '/product/:id',
      name: 'product',
      component: ProductDetail
    },

    {
      path: '/bag',
      name: 'bag',
      component: Bag
    },

    {
      path: '/user',
      name: 'user',
      component: User
    },

    {
      path: '/admin',
      name: 'admin',
      component: Admin
    },

    {
      path: '/manageproducts',
      name: 'manageproducts',
      component: ManageProducts
    }
  ]
})
