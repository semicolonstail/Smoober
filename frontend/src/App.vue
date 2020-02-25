<template>
  <div id="app">
    <app-header :user=user :bag=bag v-if="header_show"></app-header>
    <router-view :user=user :bag=bag v-on:header="header" v-on:footer="footer" v-on:loginStatus="change" v-on:addProduct="productToAdd"></router-view>
    <app-footer v-if="footer_show"></app-footer>
  </div>
</template>


<script>
import header from '@/components/header'
import footer from '@/components/footer'

export default {
  data() {
    return {
      header_show: true,
      footer_show: true,

      user: {
        id: '',
        type: '',
        name: '',
        isSignedIn: false
      },

      bag: []
    }
  },

  components: {
    'app-header': header,
    'app-footer': footer
  },

  methods: {
    header(bool) {
      this.header_show = bool
    },

    footer(bool) {
      this.footer_show = bool
    },

    change(user) {
      this.user = user
      
      if(user.username != '') {      
        this.user.isSignedIn = true
        
      } else {
        this.user.isSignedIn = false
      }
    },

    productToAdd(product) {
      let hasId = false
      
      this.bag.forEach(element => {
        if(product.id == element.id) {

          // if products with the same id, add their amount together
          hasId = true
          element.amountToBuy += product.amountToBuy 
          
          if(element.amountToBuy > element.stock) {
            element.amountToBuy = element.stock
          }
          
        } 
      })

      if(this.bag.length == 0 || hasId == false) {
        this.bag.push(product)
      }
    }
  },

  created(){
    if(localStorage.user){
      const user = JSON.parse(localStorage.user)
      if(user){
        this.user = user
        if(user.username != '') {      
          this.user.isSignedIn = true
          localStorage.removeItem("user")
        } else {
          this.user.isSignedIn = false
        }
      } 
    }
    
  }
}
</script>


<style>
@import url('https://fonts.googleapis.com/css?family=Hind:300,400,500,600,700|Parisienne&display=swap');
body {
  font-family: 'Hind', sans-serif, Helvetica, Arial;
  padding: 0;
  margin: 0;
}

a {
  text-decoration: none;
  color: rgb(39, 39, 39);
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

</style>
