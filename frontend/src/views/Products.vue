<template>
  <div class="box">
    <div class="bg">
      <img src="@/assets/top1.jpg" alt="cupcakes">
    </div>
    
    <div class="filter">
      <div class="sort">
        <input v-on:click="myFilter" type="button" value="all" class="btn_first">
        <input v-on:click="myFilter" type="button" value="cakes">
        <input v-on:click="myFilter" type="button" value="bread">
        <input v-on:click="myFilter" type="button" value="cookies">
        <input v-on:click="myFilter" type="button" value="desserts" class="btn_last">
      </div>  
    </div>

    <div class="product_container">
      <ul class="cake_container">
        <li v-for="(product, index) in getFilterArray()" :key="index">
          <div>
            <router-link :to="'/product/'+ product.id"><img :src="getPic(product)"></router-link>
          </div>
          <div>
            <h3><router-link :to="'/product/'+ product.id">{{product.name}}</router-link></h3>
            <span>{{product.flavor}} | {{product.weight}}g</span><br>
            <p>{{product.price}} SEK</p>
          </div>
        </li>
<!--
        <li>
          <img src="@/assets/latte cupcakes.jpg" alt="chocolate muffin">
          <div>
            <h3>Latte Cupcake</h3>
            <span>latte | 150g</span>
            <p>59 SEK</p>
          </div>
        </li>
-->
      </ul>
    </div>

  </div>
</template>


<script>
var data = require('@/frontend-db');

export default {
  data() {
    return {
      products: [{
        id:1, 
        type: '',
        name:'',
        flavor: '',
        weight: 0,
        price: 0
      }],

      filterType: "",
    }
  },

  methods: {
    getPic(product) {
      var images = require.context('@/assets/product_pictures')
      var productId = product.id

      // set default image for products which have no images
      try {
        return images('./' + productId + ".jpg")
      }

      catch {
        return this.setDefaultPic()
      } 
    },

    setDefaultPic() {
      var images = require.context('@/assets/product_pictures')
      return images('./0.jpg')
    },

    // filter function
    myFilter(e) {
      let options = e.target.value;

      if(options == "all") {
        this.filterType = ""
      } else {
        this.filterType = e.target.value
      }
    },

    getFilterArray() {
      return this.products.filter(product => {
        return product.type.includes(this.filterType)
      });
    }
  },

  created(){
    data.getAllProducts((errors, products) => {

      if(errors.length == 0){
        this.products = products

      }else{
        console.log(errors)
      }
    })
  }
}
</script>


<style scoped>
* {
  margin: 0;
  padding: 0;
}

.box {
  width: 80%;
  margin: 0 auto;
}

.bg {
  height: 32vh;
  overflow: hidden;
  margin-bottom: 4%;
}

.bg img {
  width: 100%;
}

/*=============filter*/
.sort {
  text-align: center;
  margin-bottom: 2%;
}

.sort input {
  width: 10%;
  height: 5vh;
  background: none;
  border: 1px solid #af9048;
  color: #99782b;
  padding-top: .3%;
  text-transform: capitalize;
}

.sort input:focus {
  background: #af9048;
  color: #fff;
}

.btn_first {
  border-radius: 4px 0 0 4px;
}

.btn_last {
  border-radius: 0 4px 4px 0;
}

/*=============products list*/
.cake_container {
  list-style: none;
  overflow: hidden;
}

.cake_container li {
  width: 19.2%;
  float: left;
  padding: .8%;
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 4px;
  position: relative;
  padding-bottom: 1%;
}

.cake_container li+li {
  margin-left: 1%;
  margin-bottom: 1%;
}

.cake_container li:nth-child(5n+1) {
  margin-left: 0;
}

.cake_container li a img {
  width: 100%;
  margin-bottom: 8%;
  transition: all 0.6s;
}

.cake_container li a img:hover {
  transform: scale(1.1);
}

.cake_container h3 {
  text-transform: capitalize;
  font-size: 1.3em;
  padding-left: 2%;
}

.cake_container h3 a:hover {
  color: #af9048;
  text-decoration: none;
}

.cake_container span {
  color: rgb(124, 124, 124);
  padding-left: 2%;
  display: inline-block;
}

.cake_container li p {
  background: #af9048;
  color: #ffffff;
  padding: 1% 3%;
  display: inline-block;
  text-align: right;
  position: absolute;
  right: 0;
  top: 0;
}

/* 1400 */
@media only screen and (max-width: 1400px) {
  .cake_container h3 {
    font-size: 1.3vw;
  }
}

/* 1024 */
@media only screen and (max-width: 1024px) {
  .sort input {
    width: 14%;
  }

  .cake_container li {
    width: 24.2%;
  }

  .cake_container li:nth-child(1) {
    margin-left: 0 !important;
  }

  .cake_container li:nth-child(4n+1) {
    margin-left: 0 !important;
  }

  .cake_container li:nth-child(5n+1) {
    margin-left:1%;
  }

  .cake_container h3 {
    font-size: 1.7vw;
  }
}

/* 768 */
@media only screen and (max-width: 768px) {
  .bg {
    height: 28vh;
  }

  .sort {
    margin-bottom: 4%;
  }

  .sort input {
    width: 16%;
    height: 4.6vh;;
  }

  .cake_container li {
    width: 32.6%;
  }

  .cake_container li:nth-child(4n+1) {
    margin-left: 1% !important;
  }

  .cake_container li:nth-child(3n+1) {
    margin-left: 0 !important;
  }

  .cake_container li:nth-child(1) {
    margin-left: 0 !important;
  }

  .cake_container h3 {
    font-size: 2.3vw;
  }

}

/* 414 */
@media only screen and (max-width: 414px) {
  .bg {
    height: 18vh;
    margin-top: 6%;
  }

  .sort input {
    width: 20%;
    font-size: 3.2vw;
  }

  .filter {
    margin-bottom: 6%;
  }

  .cake_container li {
    width: 100%;
    padding: 4%;
  }

  .cake_container li+li {
    margin-left: 0;
    margin-top: 6% !important;
  }

  .cake_container li:nth-child(4n+1) {
    margin-left: 0 !important;
  }

  .cake_container li:nth-child(5n+1) {
    margin-left: 0 !important;
  }


  .cake_container li a img {
    margin-bottom: 6%;
  }

  .cake_container h3 {
    font-size: 5vw;
  }

  .cake_container li p {
    font-size: 5vw;
    padding: 1% 5%;
  }
}

</style>