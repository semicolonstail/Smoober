<template>
    <div class="box">
        <aside>
            <div class="person">
                <img src="@/assets/admin.png">
                <h2>Hello, Admin</h2>
				<span><router-link to="/logout">Log out</router-link></span>
				<ul>
					<li><router-link to="/manageproducts">Manage Products</router-link></li>
				</ul>
            </div>
        </aside>

        <main class="admin_main">
            <figure class="desk">
                <img src="@/assets/desk.jpg">
                <figcaption class="date">
					<Clock></Clock>
                </figcaption>
            </figure>

			<div class="functions">
				<h3>Create New Product</h3>
				<form @submit.prevent="createProduct()">
					<div class="first_line">
						<div class="name">
							<label for="">Name</label>
							<input type="text" v-model="name">
						</div>
						<div class="type">
							<label>Type</label>
							<select v-model="type">
								<option value="cakes">Cakes</option>
								<option value="bread">Bread</option>
								<option value="cookies">Cookies</option>
								<option value="desserts">Desserts</option>
							</select>
						</div>
					</div>
					
					<div class="second_line">
						<div class="weight">
							<label for="">Weight</label>
							<input type="text" v-model.number="weight">
						</div>
						<div class="price">
							<label for="">Price</label>
							<input type="text" v-model.number="price">
						</div>
						<div class="stock">
							<label for="">Stock</label>
							<input type="text" v-model.number="stock">
						</div>
						<div class="energy">
							<label for="">Energy</label>
							<input type="text" v-model.number="energy">
						</div>
					</div>
					
					<div class="third_line">
						<div class="flavor">
							<label for="">Flavor</label>
							<input type="text" v-model="flavor">
						</div>
						<div class="ingredients">
							<label for="">Ingredients</label>
							<input type="text" v-model="ingredients">
						</div>
					</div>
					
					<div class="create">
						<span v-if="msg" class="alert alert-warning">{{msg}}</span>
						<span class="btn_create" v-on:click="createProduct">Create</span>
					</div>
				</form>
			</div>

			<div class="time_management" :key="reRender">
				<h3>Time Management</h3>

				<div id="origin" >
					<div class="weekday" v-for="(openingHour, weekday) in openingHours" :key="weekday">						
						<span v-if="openingHour.weekday==1">Weekday</span>
						<span v-if="openingHour.weekday==0">Weekend</span>
						<p>{{openingHour.time}}</p>	
					</div>
					
					<div class="btn_update">
						<span v-on:click="updateTrigger" id=update>Update</span>
					</div>
				</div>

				<form id="form" style="display:none">
					<div class="weekday">
						<label>Weekday</label>
						<input type="text" id="weekday_input" v-model="openingHours[0].time">
					</div>
					<div class="weekend">
						<label>Weekend</label>
						<input type="text" id="weekend_input" v-model="openingHours[1].time">
					</div>
					<div class="btn_update">
						<span id="save" v-on:click="saveTrigger">Save</span>
					</div>
				</form>
			</div>
        </main>   
    </div> 
</template>

<script>
var data = require('@/frontend-db');
import Clock from '@/components/Clock';

export default {
    data() {
        return{
			name: '',
			type: 'cakes',
			weight: '',
			price: '',
			stock: '',
			energy: '',
			flavor: '',
			ingredients: '',
			msg: '',

			openingHours:[
				{weekday:'', time:''},
				{weekday:'', time:''}
			],

			reRender: 0
        }
    },

    components: {
		Clock
    },

    created() {
		this.$emit('header', false);
		this.$emit('footer', false);
		// not going to show header and footer
		
		data.getOpeningHours((errors, openingHours) => {
			
			if(errors.length == 0){
				
				this.openingHours = openingHours

			}else{
				console.log(errors)
			}
		})
	},
	
	methods: {
       createProduct(){

            const product = {
                name: this.name,
				type: this.type,
				weight: this.weight,
				price: this.price,
				stock: this.stock,
				energy: this.energy,
				flavor: this.flavor,
                ingredients: this.ingredients
            }

            data.createProduct(product, (errors, id) => {
				console.log(product)

                if(errors.length == 0){
                    this.msg = "product created successful!"

                }else{
					this.msg = errors

                }
            })
		},

		updateTrigger() {
			
			var showEdit = document.getElementById("form")
			showEdit.style.display = "block"

			var hideOrigin = document.getElementById("origin")
			hideOrigin.style.display = "none"
			
		},

		saveTrigger() {
			
			var showEdit = document.getElementById("form")
			showEdit.style.display = "none"

			var hideOrigin = document.getElementById("origin")
			hideOrigin.style.display = "block"
			
			this.updateOpeningHours()
		},

		updateOpeningHours() {
			const openingHours = [
				{weekday: 1, time: this.openingHours[1].time},
				{weekday: 0, time: this.openingHours[0].time},
			]

                data.updateOpeningHours(openingHours, (errors) => {

                if(errors.length == 0){
					this.reRender++

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

aside {
	color: #fff;
	float: left;
	width: 25%;
	padding: 2%;
    box-sizing: border-box;
    background: #1f334e;
    height:100vh;
}

aside>h1 {
	font-size: 1em;
	font-weight: 300;
	color: #d4ad51;
}

.person {
	text-align: center;
	margin-top: 25%;
}

.person h2 {
    font-size: 1.4em;
    margin-top: 5%;
    color: #d4ad51;
}

.person>img {
	width:28%;
}

.person>span>a {
	font-size: 1em;
	color: #a4bcdb;
	cursor: pointer;
}

.person>ul {
    margin-top: 30%;
    padding-left: 0;
	list-style: none;
}

.person>ul li a {
	color: #a4bcdb;
	text-decoration: none;
	display: block;
	border-bottom: 1px dashed #eee;
	padding-bottom: 6px;
}

.person>ul li a:hover {
	color: #d4ad51;
}


.admin_main {
	width: 75%;
	float: left;
	box-sizing: border-box;
}

.desk {
	position: relative;
}

.desk>img {
	width: 100%;
	overflow: hidden;;
}

.date {
	position: absolute;
	bottom: 0;
	right:0;
	text-align: center;
	background: rgba(170, 121, 29, 0.7);
	padding: .8% 2% 1.4% 2%;
}

/*=============create new product*/
.functions, .time_management {
	padding: 2% 0 0 5%;
}

.functions h3, .time_management h3 {
	padding-bottom: 1.6%;
	margin-bottom: 2.6%;
	border-bottom: 1px dashed #ddd;
}

.functions form {
	overflow: hidden;
	color: rgb(71, 71, 71);
}

.first_line, .second_line, third_line {
	float: left;
	width: 100%;
}

.third_line {
	padding-bottom: 3%;
	border-bottom: 1px dashed #ccc;
}

.name {
	width: 77%;
	margin-right: 3%;
	display: inline-block;
}

.name input {
	width: 100%;
	margin-top: -2%;
	height: 4vh;
	border-radius: 4px;
	border: 1px solid #ddd;
	padding: .4em;
}

.type {
	width: 20%;
	display: inline-block
}

.type select {
	width: 100%;
	margin-top: -2%;
	height: 4vh;
	border-radius: 4px;
	border: 1px solid #ddd;
	padding: 0 .4em;
	text-transform: capitalize;
}

.weight, .price, .stock, .energy {
	width: 22.5%;
	margin-top: 2%;
	margin-right: 2.5%;
	display: inline-block
}

.weight input, .price input, .stock input, .energy input {
	width: 100%;
	margin-top: -2%;
	height: 4vh;
	border-radius: 4px;
	border: 1px solid #ddd;
	padding: .4em;
}

.flavor {
	width: 22%;
	margin-top: 2%;
	margin-right: 3%;
	display: inline-block
}

.flavor input {
	width: 100%;
	margin-top: -2%;
	height: 4vh;
	border-radius: 4px;
	border: 1px solid #ccc;
	padding: .4em;
}

.ingredients {
	width: 75%;
	margin-top: 2%;
	display: inline-block
}

.ingredients input {
	width: 100%;
	margin-top: -.6%;
	height: 4vh;
	border-radius: 4px;
	border: 1px solid #ddd;
	padding: .4em;
}

.alert {
	display: inline-block;
	width: 100%;
	height: 4vh;
	font-size: 1em;
	padding: 1%;
	margin-bottom: 0;
}

.btn_create{
    width: 12%;
	text-align: center;
    background: #b18f40;
    font-size: 1.3em;
    color: #fff;
    text-transform: uppercase;
    cursor: pointer;
    border-radius: 4px;
    display: block;
	padding: 1% 2%;
	margin-top: 3%;
}

.btn_create:hover {
    background: #c5a353;
}

/*=============time management*/   
.time_management {
	margin-top: 5%;
}

#origin, form {
	overflow: hidden;
}

.weekday, .weekend {
	width: 45%;
	float: left;
}

.btn_update {
	width: 10%;
	float: left;
	padding: .6%;
}

.weekday p, .weekend p {
	display: inline-block;
	margin-left: 1vw;
}

.weekday label, .weekend label {
	margin-right: 1vw;
}

.weekday input, .weekend input {
	height: 4vh;
	width: 16vw;
	border-radius: 4px;
	border: 1px solid #ddd;
	padding: .4em;
}

.btn_update span {
	border: 1px solid rgb(165, 139, 23);
	padding: 2% 10%;
	border-radius: 4px;
	cursor: pointer;
	color:rgb(165, 139, 23);
}

.btn_update span:hover {
	background: rgb(165, 139, 23);
	color: #fff;
}
</style>