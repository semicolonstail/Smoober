<template>
  <div class="box">
    <h2>orders</h2>
    <ul class="order_list">
        <template v-if="orders.length > 0">
            <li v-for="(order, index) in orders" :key="index">
                <!-- order has to be picked up before 16,30 -->
                <span>Pick up: {{transTime(order.time)}} -- 16:30</span>
                <p class="total">{{order.total}} SEK</p>
                <div>
                    <ul class="order_content">
                        <li v-for="(product, index) in order.products" :key="index">
                            <p>{{product.name}}</p>
                            <span>* {{product.amount}}</span>
                        </li>
                    </ul>
                </div>
            </li>
        </template>
        <p v-else>No orders</p> 
    </ul>  
  </div>
</template>

<script>
var data = require('@/frontend-db');

export default {
    props: ['user'],

    data() {
        return {
            orders:[{
                time: '',
                id: '',
                total: '',
                userId: '',
                products: [{
                    name: '',
                    amount: ''
                }]              
            }]
        } 
    },

    methods: {
        transTime(convert) {
            const stamp = new Date(convert)
            
            const year = stamp.getFullYear();
            const month = parseInt(stamp.getMonth())+1;
            const day = stamp.getDate();
            const hour = stamp.getHours();
            const minute = stamp.getMinutes();

            if(month<10) {
                this.month = '0' + month
            } else {
                this.month = month
            }

            if(day<10) {
                this.day = '0' + day
            } else {
                this.day = day
            }

            if(hour<10) {
                this.hour = '0' + hour
            } else {
                this.hour = hour
            }

            if(minute<10) {
                this.minute = '0' + minute
            } else {
                this.minute = minute
            }

            return year +"-"+ this.month +"-"+ this.day + " " + this.hour + ":" + this.minute
        },

    },

    created() {
        data.getOrdersByUserId(this.user.id, (errors, orders) => {
            
            if(errors.length == 0){
                this.orders = orders
                console.log(orders)
            }else{
                console.log(errors)
            }
        })  
    }
}
</script>


<style scoped>
.box {
  width: 80%;
  margin: 0 auto;
  margin-top: 2%;
}

h2 {
    text-transform: capitalize;
}

.order_list {
    column-count: 3;
    column-gap: 1%;
    column-width: 33.33%;
    list-style: none;
    padding-left: 0;
}

.order_list>li {
    break-inside: avoid;
    box-sizing: border-box;
    padding: 5%;
    border: 1px solid #ddd;
    margin-bottom: 3%;
    border-top: 2px solid rgb(196, 156, 26);
    border-radius: 4px;
}

.order_list>li>span {
    font-size: 1.3em;
}

.order_content {
    color: #6b6b6b;
    list-style:auto;
    border-top: 1px dashed #ddd;
    padding-top: 2%;
    padding-left: 4.4%;
}

.order_content li p {
    font-size: 1.2em;
    display: inline-block;
    margin: 0;
    margin-right: 2%;
}

.total {
    font-size: 1.2em;
    display: inline-block;
    margin-left: 18%;
    margin-bottom: 2%;
}

/* 1440 */
@media only screen and (max-width: 1440px) {
    .order_list {
        column-count: 2;
        column-width: 50%;
    }
}

/* 1024 */
@media only screen and (max-width: 1024px) {
    .order_list {
        column-count: 1;
        column-width: 100%;
    }
}

/* 414 */
@media only screen and (max-width: 414px) {
    .total {
        display: block;
        text-align: right;
    }
}
</style>