<template>
    <div class="box">
        <div class="top">
            <div class="person">
                <img src="@/assets/admin.png">
                <h2>Hello, Admin</h2>
				<span><router-link to="/logout">Log out</router-link></span>
				<ul>
					<li><router-link to="/admin">Create Products</router-link></li>
				</ul>
            </div>

            <figure class="desk">
                <img src="@/assets/desk.jpg">
                <figcaption class="date">
					<Clock></Clock>
                </figcaption>
            </figure>
        </div>

        <main class="table_container">
            <table>
                <thead>
                    <tr>
                        <td class="id">Id</td>
                        <td class="name">Name</td>
                        <td>Type</td>
                        <td>Weight</td>
                        <td>Price</td>
                        <td>Stock</td>
                        <td class="energy">Energy</td>
                        <td class="flavor">Flavor</td>
                        <td class="ingredients">Ingredients</td>
                        <td class="operation">Operate</td>
                    </tr>
                </thead>

                <tbody v-for="(product, index) in products" :key="index">
                    <tr :id=origin(product.id)>
                        <th class="id">{{product.id}}</th>
                        <td class="name">{{product.name}}</td>
                        <td :id="showType(product.id)">{{product.type}}</td>
                        <td>{{product.weight}}g</td>
                        <td>{{product.price}} SEK</td>
                        <td>{{product.stock}}</td>
                        <td class="energy">{{product.energy}}</td>
                        <td class="flavor">{{product.flavor}}</td>
                        <td class="ingredients">{{product.ingredients}}</td>
                        <td class="operation">
                            <span v-on:click="originTrigger" class="update" :id=originUpdate(product.id)>Update</span>
                            <span class="delete" v-on:click="deleteIt(product.id)" >Delete</span>
                        </td>
                    </tr>

                    <tr :id=createEdit(product.id) style="display:none">
                        <th class="id">{{product.id}}</th>
                        <td class="name">
                            <input type="text" v-model="product.name" :id="setName(product.id)">
                        </td>
                        <td>
                            <select :id="setType(product.id)">
                                <option value="cakes">cakes</option>
                                <option value="bread">bread</option>
                                <option value="cookies">cookies</option>
                                <option value="desserts">desserts</option>
                            </select>
                        </td>
                        <td>
                            <input type="text" v-model.number="product.weight" :id="setWeight(product.id)">
                        </td>
                        <td>
                            <input type="text" v-model.number="product.price" :id="setPrice(product.id)">
                        </td>
                        <td>
                            <input type="text" v-model.number="product.stock" :id="setStock(product.id)">
                        </td>
                        <td class="energy">
                            <input type="text" v-model.number="product.energy" :id="setEnergy(product.id)">
                        </td>
                        <td class="flavor">
                            <input type="text" v-model="product.flavor" :id="setFlavor(product.id)">
                        </td>
                        <td class="ingredients">
                            <textarea  v-model="product.ingredients" :id="setIngredients(product.id)"></textarea>
                        </td>
                        <td class="operation">
                            <span v-on:click="editTrigger" class="update" :id=editUpdate(product.id)>Save</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </main>
    </div>
</template>


<script>
import Clock from '@/components/Clock';
var data = require('@/frontend-db');

export default {
    data() {
        return{
            count: 0,

            products: [{
                id:1, 
                name: '',
                type: '',
                weight: '',
                price: 0,
                stock: 0,
                energy: 0,
                flavor: '',
                ingredients: ''              
            }]
        }
    },

    components: {
		Clock
    },

    created() {
		this.$emit('header', false);
		this.$emit('footer', false);
        // not going to show header and footer

        this.printData()
    },

    methods: {
        deleteIt(parameter) {           
            data.deleteProductById(parameter, (errors) => {

                if(errors.length == 0){
                    this.printData()
                }else{
                    console.log(errors) 
                }
            })
        },

        printData(){
            data.getAllProducts((errors, products) => {
                if(errors.length == 0) {
                    this.products = products
                } else {
                    console.log(errors)
                }
            })
        },

        // need to know which "update" and "save" button got pressed
        origin(id) {
            return "origin" + id
        },

        originUpdate(id) {
            return "originUpdate" + id
        },

        createEdit(id) {
            return "edit" + id
        },

        editUpdate(id) {
            return "editUpdate" + id
        },


        // offer each input their own name
        setName(id) {
            return "name" + id
        },
        showType(id) {
            return "showType" + id
        },
        setType(id) {
            return "type" + id
        },
        setWeight(id) {
            return "weight" + id
        },
        setPrice(id) {
            return "price" + id
        },
        setStock(id) {
            return "stock" + id
        },
        setEnergy(id) {
            return "energy" + id
        },
        setFlavor(id) {
            return "flavor" + id
        },
        setIngredients(id) {
            return "ingredients" + id
        },

        originTrigger(e) {
            let id = e.target.id
            id = id.substring(12, id.length)

            var showEdit = document.getElementById("edit" + id)
            showEdit.style.display = "table-row"
            
            var hideOrigin = document.getElementById("origin" + id)
            hideOrigin.style.display = "none"

            this.printDropdownValue(id)
        },

        // when press update button, the dropdown will show the type of the product
        printDropdownValue(id) {
            let dropdown = document.getElementById("type" + id)
            let typeTd = document.getElementById("showType" + id)
            let typeValue = typeTd.textContent

            // compare the product's type and show accordingly
            switch(typeValue) {
                case "cakes":
                    dropdown.selectedIndex = 0
                    break 

                case "bread":
                    dropdown.selectedIndex = 1
                    break 

                case "cookies":
                    dropdown.selectedIndex = 2
                    break 

                case "desserts":
                    dropdown.selectedIndex = 3
                    break 
            }
            
        },

        editTrigger(e) {
            let id = e.target.id
            id = id.substring(10, id.length)

            var showOrigin = document.getElementById("edit" + id)
            showOrigin.style.display = "none"
            
            var hideEdit = document.getElementById("origin" + id)
            hideEdit.style.display = "table-row"

            this.updatedProduct(id)
        },

        updatedProduct(id) {
            // get the value of dropdwon
            let dropdown = document.getElementById("type" + id)
            let typeTd = document.getElementById("showType" + id)

            // will print out all data when click "update" button
            const updatedProduct = {
                id: parseInt(id),
                name: document.getElementById("name" + id).value,
                type: dropdown.options[dropdown.selectedIndex].value,
                weight: parseInt(document.getElementById("weight" + id).value),
                price: parseInt(document.getElementById("price" + id).value),
                stock: parseInt(document.getElementById("stock" + id).value),
                energy: parseInt(document.getElementById("energy" + id).value),
                flavor: document.getElementById("flavor" + id).value,
                ingredients: document.getElementById("ingredients" + id).value
            }

                data.updateProductById(updatedProduct.id, updatedProduct, (errors) => {                  
                    
                if(errors.length == 0){
                    typeTd.innerHTML = updatedProduct.type
                    console.log(updatedProduct)
                }else{
                    console.log(errors)
                }

            })
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
	color: #fff;
	width: 100%;
    height: 28vh;
    overflow: hidden;
}

.top>h1 {
	font-size: 1em;
	font-weight: 300;
	color: #d4ad51;
}

.person {
    width: 25%;
    height: 28vh;
    float: left;
	text-align: center;
    padding: 1.4%;
    background: #1f334e;
}

.person h2 {
    font-size: 1.4em;
    margin-top: 1vh;
    color: #d4ad51;
    margin-bottom: 0;
}

.person>img {
	width:28%;
}

.person>span>a {
	font-size: 1em;
	color: #a4bcdb;
}

.person>ul {
    margin-top: 2vh;
    padding-left: 0;
	list-style: none;
    margin-bottom: 0;
}

.person>ul li a {
	color: #a4bcdb;
	text-decoration: none;
	display: block;
	border-top: 1px dashed rgb(95, 140, 199);
	padding-top: 1vh;
}

.person>ul li a:hover {
	color: #d4ad51;
}

.desk {
	width: 75%;
    float: left;
    position: relative;
}

.desk>img {
	height: 100%;
	overflow: hidden;;
}

.date {
	position: absolute;
	top: 0;
	right:0;
	text-align: center;
	background: rgba(170, 121, 29, 0.7);
	padding: .8% 2% 1.4% 2%;
}

/*=============list of products*/
.table_container {
	width: 100%;
    margin-top: 2%;
}

table {
    width: 100%;
}

table thead {
    font-size: 1.2em;
    font-weight: 500;
    border-bottom: 1px solid #ccc;
}

tr {
    height: 6vh;
    border-bottom: 1px dashed #ccc;
}

input, textarea {
    width: 100%;
}

tbody tr:nth-child(even) {
    background: #eee;
}

.id {
    padding-left: 2%;
}

.name {
    width: 17%;
    padding: 0 2%;
}

.flavor {
    width: 5%;
}

.ingredients {
    width: 30%;
    padding-right: 2%;
    padding-left: 2%;
}

.operation {
    width: 12%;
}

.update, .delete {
    color:#33418f;
    margin-right: 10%;
    cursor: pointer;
}

.update:hover {
    text-decoration: underline;
}

.delete:hover {
    color: rgb(226, 21, 21);
}


</style>