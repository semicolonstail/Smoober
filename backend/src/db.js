const sqlite = require('sqlite3')
const db = new sqlite.Database("database.db")


// Enable foreign key constraints.
db.run("PRAGMA foreign_keys = ON")


/**************************************************************************
                              Users Table 
 **************************************************************************/
exports.getUserById = function(id, callback){
	
	const query = `
		SELECT * FROM users WHERE id = ?
	`
	const values = [id]
	
	db.get(query, values, function(error, user){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], user)
		}
	})
	
}

exports.getUserByUsername = function(username, callback){
	
	const query = `
		SELECT * FROM users WHERE username = ?
	`
	const values = [username]
	
	db.get(query, values, function(error, user){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], user)
		}
	})
	
}

exports.createUser = function(user, callback){
	
	const query = `
		INSERT INTO users
			(username, password, type)
		VALUES
			(?, ?, ?)
	`
	const values = [
		user.username,
		user.password,
		user.type
	]
	
	db.run(query, values, function(error){
		if(error){
			if(error.message == "SQLITE_CONSTRAINT: UNIQUE constraint failed: users.username"){
				callback(["usernameTaken"])
			}else{
				console.log(error)
				callback(["databaseError"])
			}
		}else{
			callback([], this.lastID)
		}
	})
	
}

//Retrieve Third-Party (Google) user 
exports.getThirdUser = function(thirdUser, callback){
	
	const query = `
		SELECT * FROM users WHERE username = ? AND type = ?
	`
	const values = [
		thirdUser.username,
		thirdUser.type
	]
	
	db.get(query, values, function(error, user){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], user)
		}
	})
	
}


/**************************************************************************
                              Orders Table 
 **************************************************************************/
exports.getOrdersByUserId = function(userId, callback){
	
	const query = `
		 SELECT id, userId, time, total FROM orders
		 WHERE userId = ? ORDER BY time DESC
	`
	const values = [
		userId
	]
	
	db.all(query, values, function(error, orders){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([],orders)
		}
	})
	
}

//Retrieve products of the order.
exports.getOrderProducts = function(order, callback){
	
	const query = `
			SELECT  products.name, product_order.amount  
			FROM product_order
			JOIN products ON product_order.productId = products.id 
			WHERE product_order.orderId = ?
	`
	const values = [
		order.id
	]
	
	db.all(query, values, function(error, products){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], products)
		}
	})
	
}

exports.createOrder = function(order, callback){
	const pickTime = Date.now().valueOf() + 60*60*1000

	const query = `
		INSERT INTO orders
			(userId, time, total)
		VALUES
			(?, ?, ?)
	`
	const values = [
		order.userId,
		pickTime,
		order.total
	]
	
	db.run(query, values, function(error){
		if(error){
			// TODO check foreign key violation error.
			if(true){
				callback(["userNotFound"])
			}else{
				console.log(error)
				callback(["databaseError"])
			}
		}else{
			callback([], this.lastID)
		}
	})
	
}

//When create the Order, need to insert the products into the middle table 
//To create the Order completely
exports.middleTable = function(product, orderId, callback){
	
	const query = `
		INSERT INTO product_order
			(productId, orderId, amount)
		VALUES
			(?, ?, ?)
	`
	const values = [
		product.productId,
		orderId,
		product.amount
	]
	
	db.run(query, values, function(error){
		if(error){
			// TODO check foreign key violation error.
			if(true){
				callback(["orderNotFound"])
			}else{
				console.log(error)
				callback(["databaseError"])
			}
		}else{
			callback([])
		}
	})
	
}

//When the order is generated sccussfully, the stock need to be reduced correspondingly
//Because the stock of each day is limited
exports.changeProductStock = function(product, callback){

	const query = `
		SELECT stock FROM products WHERE id = ?
	`
	const values = [
		product.productId
	]
	
	let temStock = ""

	db.get(query, values, function(error, oldStock){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{

				temStock = oldStock.stock - product.amount
	
				const query = `
					UPDATE products SET stock = ? WHERE id = ?
				`
				const values = [
					temStock,
					product.productId
				]
				
				db.run(query, values, function(error){
					if(error){
						console.log(error)
						callback(["databaseError"])
					}else{						
						callback([])
					}
				})				
			}
	})
}


/**************************************************************************
                              Products Table 
 **************************************************************************/
exports.getAllProducts = function(callback){
	
	const query = `
		SELECT * FROM products
	`
	const values = []
	
	db.all(query, values, function(error, products){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], products)
		}
	})
	
}

exports.getProductById = function(id, callback){
	
	const query = `
		SELECT * FROM products WHERE id = ?
	`
	const values = [id]
	
	db.get(query, values, function(error, product){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], product)
		}
	})
	
}

exports.createProduct = function(product, callback){
	
	const query = `
		INSERT INTO products
			(name, type, weight, price, stock, energy, flavor, ingredients)
		VALUES
			(?, ?, ?, ?, ?, ?, ?, ?)
	`
	const values = [
		product.name,
		product.type,
		product.weight,
		product.price,
		product.stock,
		product.energy,
		product.flavor,
		product.ingredients
	]
	
	db.run(query, values, function(error){
		if(error){
			console.log(error)
			callback(["productNotFound"])
			
		}else{
			callback([], this.lastID)
		}
	})
	
}

exports.updateProductById = function(id, updatedProduct, callback){
	
	const query = `
		UPDATE products SET
			name = ?,
			type = ?,
			stock = ?,
			weight = ?,
			energy = ?,
			price = ?,
			ingredients = ?,
			flavor = ?
		WHERE
			id = ?
	`
	const values = [
		updatedProduct.name,
		updatedProduct.type,
		updatedProduct.stock,
		updatedProduct.weight,
		updatedProduct.energy,
		updatedProduct.price,
		updatedProduct.ingredients,
		updatedProduct.flavor,
		id
	]
	
	db.run(query, values, function(error){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			const productExisted = (this.changes == 1)
			callback([], productExisted)
		}
	})
	
}

exports.deleteProductById = function(id, callback){
	
	const query = `
		DELETE FROM products WHERE id = ?
	`
	const values = [
		id
	]
	
	db.run(query, values, function(error){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			const productExisted = (this.changes == 1)
			callback([], productExisted)
		}
	})
	
}


/**************************************************************************
                         	 Opening Hours Table 
 **************************************************************************/
exports.getOpeningHours = function(callback){

	const query = `
		SELECT * FROM openingHours
	`
	const values = []
	
	db.all(query, values, function(error, openingHours){
		if(error){
			console.log(error)
			callback(["databaseError"])
		}else{
			callback([], openingHours)
		}
	})

}

exports.updateOpeningHours = function(newOpeningHours, callback){
	
		const query = `
			UPDATE openingHours SET
				time = ?
			WHERE
				weekday = ?
		`
		const values = [
			newOpeningHours.time,
			newOpeningHours.weekday
		]
		
		db.run(query, values, function(error){
			if(error){
				console.log(error)
				callback(["databaseError"])
			}else{
				callback([])
			}
		})	
	
}