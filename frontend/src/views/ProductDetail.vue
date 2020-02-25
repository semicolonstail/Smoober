<template>
    <div class="box">
        <div v-if="product" class="top">
            <div class="left">
                <img :src="getPic(product)">
            </div>
            <div class="right">
                <h1>{{product.name}}</h1>
                <div>
                    <div class="product_info">
                        <h2>Ingredients</h2>
                        <p>{{product.ingredients}}</p>
                    </div>
                </div>

                <div class="stock">
                    <ul>
                        <li>
                            <p>{{product.stock}}</p>
                            <h3>in stock</h3>
                        </li>

                        <li>
                            <p>{{product.energy}} <small>cal/100g</small></p>
                            <h3>energy</h3>
                        </li>

                        <li>
                            <p>{{product.weight}} <small>g</small></p>
                            <h3>per each</h3>
                        </li>
                    </ul>
                </div>

                <div class="buy_container">
                    <form>
                        <label>Number</label>
                        <!-- input field control, not allow to buy more than stock-->
                        <input type="number" min="1" v-on:keyup="checkAmount(amountToBuy)" 
                               oninput="validity.valid||(value='')" v-on:focus="clear" v-model.number="amountToBuy">
                        <span>{{msg}}</span>
                    </form>
                </div>

                <!-- check stock -->
                <div v-if="product.stock >= 1" class="price">
                    <span v-on:click="addToCart" class="btn_buy">Add to bag</span>
                    <h2>{{product.price}}<small> SEK</small></h2>
                </div>
                <div v-else>
                    <p class="tips">Sorry, out of stock!</p>
                </div>
            </div>
        </div>

        <p v-else>No accounts with that id exists.</p>

        <div class="statement">
            <h2>Allergy Issues</h2>
            <p>Gluten is a protein found in grains, such as wheat, barley and rye. Some people are allergic to wheat, 
                but that is not the same as a gluten allergy. Gluten allergy is a misleading term commonly confused 
                with wheat allergy, or sometimes celiac disease. There is no such thing as a gluten allergy, but there 
                is a condition called Celiac Disease. Celiac Disease is a digestive condition that is potentially serious 
                if not diagnosed or treated.  Symptoms of celiac disease include severe diarrhea after eating gluten-containing 
                products, a rash, severe weight loss or failure to properly gain weight, and abdominal pain.  In small children, 
                you may only see poor weight gain and no pain, or other symptoms.  Diagnosis of celiac disease can only 
                be made by a board-certified gastroenterologist.  It must also be made when the person is eating foods 
                with gluten, as gluten avoidance is the active treatment. 
            </p>
            <h4>Let us know if you have allergy problems</h4>
        </div>
    </div>
</template>


<script>
var data = require('@/frontend-db');

export default {
    data() {
        return {
            amountToBuy: 2, //indicates what does the input use for

            product: [{ 
                id: 1,
                name: '',
                type: '',
                stock: 0,
                weight: 0,
                energy: 0,
                price: 0,
                ingredients: '',
                flavor: ''
            }],

            msg: ''
        }
    },

    created() {
        const id = this.$route.params.id
        data.getProductById(id, (errors, product) => {
            if(errors.length == 0){
                this.product = product
            }else{
            console.log(errors)
            }
        })
    },

    methods: {
        getPic(product) {
            var images = require.context('@/assets/product_pictures')
            var productId = this.$route.params.id

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

        // empty the defult value and msg when the input get clicked
        clear() {
            this.amountToBuy = ''          
            this.msg = '' 
        },

        // make sure user can't order product more than stock
        checkAmount(amountToBuy) {
            if(this.amountToBuy > this.product.stock) {
                this.amountToBuy = parseInt(this.product.stock)
                this.msg = "Only " + this.product.stock + " is available"
            }
        },

        // not allow to leave empty input before clicking the "add to bag" button
        addToCart() {
            if(this.amountToBuy < 1 || this.amountToBuy == "") {
                this.msg = "Amount cannot be empty"
                return
            }

            this.product.amountToBuy = this.amountToBuy
            this.toParent()
            this.$router.push("/bag/")
        },

        toParent(product) {
            this.$emit('addProduct', this.product)
        }

    }
}
</script>


<style scoped>
.box {
  width: 80%;
  margin: 0 auto;
  overflow: hidden;
}

.top {
    overflow: hidden;
    margin-bottom: 5%;
}

.left {
    width: 26%;
    float: left;  
    margin-right: 4%;
}

.left img {
    padding-top: 5vh;
    width: 100%;
}

/*=============right area*/
.right {
    width: 70%;
    float: left;
    padding-top: 3.6vh;
}

.right h1 {
    text-transform: capitalize;
    font-size: 2.2em;
    border-bottom: 1px dashed #d8d1c2;
    padding: 1% 0;
}

.product_info {
    margin-top: 2%;
}

.product_info h2 {
    font-size: 1.3em;
    margin-bottom: 0.4%;
}

.product_info p {
    font-size: 1.2em;
    color: #636363;
    margin-bottom: 0;
    font-weight: 300;
}

.allergy {
    color:rgb(189, 161, 87)!important;
}

/*=============labels*/
.stock ul {
    overflow: hidden;
    list-style: none;
    padding-left: 0;
    margin-top: 1.1%;
    width: 100%;
    background: rgb(250, 249, 249);
    padding: 1% 0;
}

.stock ul li {
    border-left: 1px solid #eee;
    padding-left: 2%;
    margin-right: 7%;
    width: fit-content;
    float: left;
}

.stock ul li p {
    font-size: 1.6em;
    margin-bottom: 0;
    font-weight: 500;
}

.stock ul li h3 {
    font-size: 1em;
    font-weight: 300;
    color: #636363;
}

/*=============number*/
.buy_container {
    margin-top: 2.2%;
    padding-bottom: 2.2%;
    border-bottom: 1px dashed #d8d1c2;
}

.buy_container form label {
    font-size: 1.2em;
    color: rgb(110, 110, 110);
    margin-right: 1%;
}

.buy_container form input {
    font-size: 1.2em;
    width: 10vw;
    height: 5vh;
    border: 1px solid #ccc;
    border-radius: 4px;
    color:rgb(77, 77, 77);
    text-align: center;
    margin-right: 2%;
}

.buy_container form input[type=number]::-webkit-inner-spin-button {
    appearance: none;
    /*remove the arrows in the number input fields*/
}

.buy_container form span {
    color: rgb(160, 19, 19);
}

/*=============price and add button*/
.price {
    margin-top: 2.4%;
}

.btn_buy {
    font-size: 1.6em;
    color: #fff;
    padding: .6% 4% .2% 4%;
    display: block;
    background: #af9048;
    border-radius: 4px;
    cursor: pointer;
    margin-right: 4%;
    float: left;
}

.btn_buy:hover {
    background: #c79f43;
}

.price {
    overflow: hidden;
}

.price h2 {
    margin: 0;
    float: left;
    font-size: 3em;
    color: #a07b26;
}

.price h2>small {
    color:rgb(109, 109, 109);
    font-size: .5em;
    font-weight: 300;
}

.statement p {
    margin-bottom: 0.6%;
}

h4 {
    font-weight: 400;
    font-size: 1.1em;
    color:rgb(189, 161, 87);
}

.tips {
    font-size: 1.2em;
    color: rgb(160, 19, 19);
    background: rgb(241, 239, 232);
    padding: 1% 2%;
    margin-top: 2%;
}

/* 768 */
@media only screen and (max-width: 768px) {
    .left {
        width: 30%;
    }

    .right {
        width: 64%;
    }

    .right h1 {
        font-size: 3vw;
    }

    .product_info p {
        font-size: 2vw;
    }

    .stock ul {
        margin-bottom: 2.6%;
    }

    .stock ul li p {
        font-size: 2.5vw;
    }

    .stock ul li h3 {
        font-size: 2vw;
        margin-bottom: 1.4%;
    }

    .buy_container {
        margin-top: 0;
    }

    .buy_container form label {
        font-size: 2.2vw;
    }

    .btn_buy {
        font-size: 2.8vw;
        font-weight: 300;
    }

    .price h2 {
        font-size: 5vw;
    }

    .statement h2 {
        font-size: 3.4vw;
    }
}

/* 414 */
@media only screen and (max-width: 414px) {
    .top {
        overflow: auto;
        padding-top: 1%;
    }

    .left, .right {
        width: 100%;
        float: none;
    }

    .left img {
        padding-top: 4%;
    }
    
    .right {
        padding-top: 4%;
    }

    .right h1 {
        font-size: 6.4vw;
    }

    .product_info h2 {
        font-size: 4.6vw;
    }

    .product_info p {
        font-size: 3.8vw;
        margin-top: 2%;
    }

    .stock ul {
        margin-top: 3.6%;
    }

    .stock ul li p{
        font-size: 4.8vw;
    }

    .stock ul li h3 {
        font-size: 3.8vw;
    }

    .buy_container {
        margin-top: 6%;
        padding-bottom: 5%;
    }

    .buy_container form label {
        font-size: 5vw;
        margin-right: 4%;
    }

    .buy_container form input {
        width: 60%;
    }

    .price {
        margin-top: 5%;
    }

    .btn_buy {
        font-size: 5.6vw;
        font-weight: 400;
        padding: 1.2% 5%;
    }

    .price h2 {
        font-size: 9vw;
        margin-left: 3%;
    }

    .statement {
        margin-top: 17%;
    }

    .statement h2 {
        font-size: 6vw;
        background: #eee;
        padding: 2% 3%;
    }
}

/* 320 */
@media only screen and (max-width: 320px) {
    .product_info p {
        font-size: 4.2vw;
    }

    .stock ul li h3 {
        font-size: 4.2vw;
    }
}

</style>