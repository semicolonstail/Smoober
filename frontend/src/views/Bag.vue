<template>
    <div class="box">
        <div class="list">
            <table>
                <thead>
                    <tr>
                        <th class="first">Product</th>
                        <th class="amount">Amount</th>
                        <th class="price">Price</th>
                        <th class="operate">Operation</th>
                    </tr>
                </thead>
                
                <!-- :key, force the page re-render -->
                <tbody :key="newAmount">                   
                    <tr v-if="bag.length == 0" class="emptyBag">
                        Your bag is empty
                    </tr>

                    <tr v-else v-for="myItem in bag" v-bind:key="myItem.id">
                        <td class="product">
                            <img :src="getPic(myItem.id)" alt="">
                            <span>{{myItem.name}}</span>
                        </td>
                        <td class="number">
                            <span>
                                <img src="@/assets/deduct.svg" alt="deduct 1" :id=deductOne(myItem.id) v-on:click="updateAmount">
                            </span>
                            <input type="number"  min="1" :max="myItem.stock" oninput="validity.valid||(value='')" 
                                   v-on:blur="minAmount(myItem.id)" v-model.number="myItem.amountToBuy">
                            <span>
                                <img src="@/assets/add.svg" alt="add 1" :id=addOne(myItem.id) v-on:click="updateAmount">
                            </span>
                        </td>
                        <td>{{myItem.price*myItem.amountToBuy}} SEK</td>
                        <td v-on:click="deleteProduct(myItem.id)" class="btn_delete">
                            <span>delete</span>
                        </td>
                    </tr>

                    <!--
                    <tr>
                        <td class="product">
                            <img src="@/assets/product_pictures/1.jpg" alt="lemon tart">
                            <span>Lemon Tart</span>
                        </td>
                        <td class="number">
                            <span>
                                <img src="@/assets/deduct.svg" alt="deduct 1">
                            </span>
                            <input type="text" v-model.number="number">
                            <span>
                                <img src="@/assets/add.svg" alt="add 1">
                            </span>
                        </td>
                        <td>138 SEK</td>
                    </tr>
                    -->
                </tbody>
            </table>
        </div>
        
        <div class="bill">
            <div>
                <h2>Summary</h2>
                <!-- before paying check whether the shop closed -->
                <p v-if="time < closeTime && time > openTime">Tips! Order has to be picked up in the shop today</p>
                <p v-else>Sorry, we are closed.</p>
            </div>
            <p class="total">Total: <span>{{total()}}</span> SEK</p>

            <!-- before paying check whether the user login -->
            <template v-if="time < closeTime && time > openTime" >
                <span v-if="!user.isSignedIn" class="btn_pay">
                    <router-link to="/login">pay</router-link>
                </span>

                <span v-else class="btn_pay" v-on:click="createOrder">
                    <a>pay</a>
                </span>
            </template>

        </div>
    </div>
</template>


<script>
var data = require('@/frontend-db');

export default {

    props: ['user','bag'],

    data() {
        return {
            newAmount: 0, //force the page rerender
            openTime: 800,
            closeTime: 1600,
            time: ''
        }
    },

    methods: {
        getPic(productId) {
            var images = require.context('@/assets/product_pictures')

            try {
                return images('./' + productId + ".jpg")
            }
            catch {
                return this.setDefaultPic()               
            }       
        },

        // get which "+" and "-" that user pressed when there're more than one product
        addOne(id) {
            return "inc" + id
        },

        deductOne(id) {
            return "dec" + id
        },

        updateAmount(e) {          
            let myId = e.target.id          

            // to tell is + or -
            let btn = myId.substring(0, 3)
            
            myId = myId.substring(3, myId.length)
         
            if(btn == "inc") {
                this.bag.forEach(element => {
                    if(element.id == myId && element.amountToBuy < element.stock) {
                        element.amountToBuy ++
                    } 
                }) 
                
            } else {
                for(var i=0; i<this.bag.length; i++) {

                    let element = this.bag[i]
                    if(element.id == myId) {
                        element.amountToBuy --

                        // button "-" can only reduce to 1, want to remove product, press "delete" button
                        if(element.amountToBuy < 1) {
                            element.amountToBuy = 1                           
                        }

                    }
                }
            }
            this.total()
            this.newAmount++
            // page will be forced to re-render
            
        },

        minAmount(myId) {           
            for(var i=0; i<this.bag.length; i++) {
               
                let element = this.bag[i]
                if(element.id == myId) {
                    // not allow to leave empty input before press "pay" button
                    if(element.amountToBuy < 1 || element.amountToBuy == "") {
                        element.amountToBuy = 1
                    }                      
                }
            }

        },

        deleteProduct(myId) {           
            for(var i=0; i<this.bag.length; i++) {

                let element = this.bag[i]
                if(element.id == myId) {
                    this.$delete(this.bag, i)                        
                }
            }
        },

        total() {
            let sum = 0

            this.bag.forEach(element => {
                sum += element.price*(element.amountToBuy)
            });
            return sum
        },
        
        createOrder() {
            let productsContainer = []

            this.bag.forEach(element => {
                productsContainer.push({productId:element.id, amount:element.amountToBuy})    
            })  
                  
            const order = {
                userId: this.user.id,
                products: productsContainer,        
                total: this.total()
            }

            data.createOrder(order, (errors, id) => {
                if(errors.length == 0){

                    // change the number above the bag icon after pressing "delete" button or creating order successfully 
                    for(var i=this.bag.length-1; i>=0; i--) {
                        this.$delete(this.bag, i)
                    }
                    this.$router.push("/user")

                }else{
                    console.log("!!!errors " + errors)
                }

            })           
        },
          
        digital(value) {
            if(value<10) {
                return '0'+value
            } else {
                return value
            }
        }

    },

    // check current time, is the shop still open or closed
    created() {
        let currentTime = new Date()

        const hours = this.digital(currentTime.getHours());
        const minutes = this.digital(currentTime.getMinutes());

        this.time = String(hours) + String(minutes)
    }

}
</script>


<style scoped>
.box {
  width: 80%;
  margin: 0 auto;
  margin-top: 2%;
  overflow: hidden;
}

.list {
    width: 70%;
    margin-right: 5%;
    float: left;
    font-size: 1.2em;
}

.bill {
    width: 25%;
    float: left;
    background: rgb(240, 240, 240);
    padding: 1.4% 2%;
}

table {
    width: 100%; 
}

.list table thead {
    background: #c0b18d;
    color: #fff;
}

.list table thead tr th {
    padding-top: 1%;
    padding-bottom: 1%;
    font-weight: 400;
}

.amount, .price, .operate {
    width: 22%;
}

.first {
    width: 34%;
    padding-left: 8% !important;
}

.amount {
    padding-left: 3% !important;
    box-sizing: border-box;
}

.list table tbody td {
    width: 20%;
    padding: 1% 0;
}

.number span {
    cursor: pointer;
}

.number span img {
    width: 12%;
}

.number input[type=number]::-webkit-inner-spin-button {
    appearance: none;
    /*remove the arrows in the number input fields*/
}

.number input {
    width: 34%;
    display: inline-block;
    padding: 1% 2%;
    text-align: center;
    margin: 0 3%;
    margin: 0;
}

table tbody tr {
    border-bottom: 1px dashed #eee;
}

.product {
    width: 40% !important;
    padding-left: 0 !important;
}

.product img {
    width: 30%;
    padding-right: 3%;
}

.product span {
    font-weight: 500;
}

.btn_delete span {
    border: 1px solid #b18f40;
    border-radius: 4px;
    color: #926d18;
    cursor: pointer;
    padding: 1% 6%;
}

.btn_delete span:hover {
    background: #926d18;
    color: #fff;
}

.emptyBag {
    border: 0;
    margin-top: 6%;
    display: block;
}

/*=============right side summary*/
h2 {
    border-bottom: 1px dashed #ccc;
    padding-bottom: 3%;
    font-size: 1.6em;
}

.bill>div>p {
    color: rgb(46, 46, 46);
}

.total {
    font-size: 1.4em;
    font-weight: 400;
    margin-top: 10%;
    border-top: 1px dashed #ccc;
    padding-top: 4%;
    text-align: right;
    margin-bottom: 2%;
}

.total span {
    font-size: 1.2em;
    font-weight: 500;
}

.btn_pay a {
    width: 100%;
    text-align: center;
    background: #b18f40;
    padding: 2.5% 10%;
    font-size: 1.4em;
    color: #fff;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 4px;
    display: inline-block;
    margin-bottom: 2%;
}

.btn_pay a:hover {
    text-decoration: none;
    background: #c5a353;
    color: #fff;
}

/* 1024 */
@media only screen and (max-width: 1024px) {
    .product span {
        font-weight: 400;
    }

    .list table tbody td {
        font-size: .9em;
    }

    h2 {
        font-size: 1.4em;
    }

    .total {
        font-size: 1.2em;
    }
}

/* 768 */
@media only screen and (max-width: 768px) {
    .box {
        overflow: auto;
    }

    .list, .bill {
        width: 100%;
        float: none;
    }

    .list table tbody td {
        font-size: 1em;
        padding: 3% 0;
    }

    .product {
        width: 50% !important;
    }

    .bill {
        margin-top: 6%;
        background: rgb(248, 248, 248)
    }

    h2 {
        padding-bottom: 1%;
    }

    .bill>div>p {
        margin-top: 3%;
    }

    .total {
        margin-top: 0;
    }

    .btn_pay {
        width: 30%;
        border-radius: 4px;
        display: block;
        margin-top: -9%;
    }

    .btn_pay a {
        padding: 2% 8%;
        display: inline-block;
    }
}

/* 414 */
@media only screen and (max-width: 414px) {
    .box {
        width: 90%;
    }

    .product {
        width: 40% !important;
    }
    
    .product img {
        display: none;
    }

    .number span img {
        width: 15%;
    }

    .btn_pay {
        margin-top: -13%;
    }
}

</style>