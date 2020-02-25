const express = require('express')
const { objectToXml } = require('js-object-to-xml')
const db = require('./db')
const hasTypes = require('./has-types')


const router = express.Router()

router.get("/", function(request, response){
	
	if(request.query.userId){
		
		const userId = request.query.userId
		
		db.getOrdersByUserId(userId, function(errors, orders){
			
			if(errors.length == 0){
				let getCount = 0

				for (const order of orders) {
					db.getOrderProducts(order, function(errors, products){
						if(errors.length == 0){
							getCount ++
							order.products = products
						}else{
							response.status(500).end()
						}

						if(getCount == orders.length){
							if(request.header("Accept") == "application/xml"){
								const xmlOrder = objectToXml(orders)
								response.status(200).send(xmlOrder)
							}else{
								response.status(200).json(orders)
							}
						}
					})
				}

			}else{
				response.status(500).end()
			}
		})
		
	}else{
        response.status(500).end()
	}
})


router.post("/", function(request, response){
	
	const order = request.body
	const orderProducts = order.products
	
	// Check that the order contains all expected properties.
	const orderTypes = {
		userId: Number,
		products: Array,
		total: Number
	}
	const productsTypes = {
		productId: Number,
		amount: Number
	}


	if(!hasTypes(order, orderTypes)){
		response.status(422).end()
		return
	}
	
	for (const product of orderProducts) {
		if(!hasTypes(product,productsTypes)){
			response.status(422).end()
			return
		}
	}
	

	// Check authorization.
	const userId = request.userId
	if(!userId){
		response.status(401).end("notAuthenticated")
		return
	}else if(order.userId != userId){
		// Not creator of order.
		response.status(401).end("notAuthorized")
		return
	}
	
	// Try to create the order.
	db.createOrder(order, function(errors, id){
		if(errors.length == 0){
			const userId = order.userId
			const products = order.products
			const orderId = id
			let createCount = 0

			for (const product of products) {
				db.middleTable(product, orderId, function(errors){
					if(errors.length == 0){
						db.changeProductStock(product, function(errors){
							if(errors.length == 0){
								createCount ++
							}else{
								response.status(500).end()
							}
							if(createCount == products.length){
								response.setHeader("Location", "/orders/?userId="+ userId)
								response.status(201).end()
							}
						})						
					}else if(errors.includes("orderNotFound")){
							if(request.header("Accept") == "application/xml"){
								const xmlErrors = objectToXml(errors)
								response.status(400).send(xmlErrors)
							}else{
								response.status(400).json(errors)
							}
					}else{
						response.status(500).end()
					}
				})
			}	
		}else if(errors.includes("userNotFound")){
					if(request.header("Accept") == "application/xml"){
						const xmlErrors = objectToXml(errors)
						response.status(400).send(xmlErrors)
					}else{
						response.status(400).json(errors)
					}
		}else{
			response.status(500).end()
		}
	})
	
})

module.exports = router