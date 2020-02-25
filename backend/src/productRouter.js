const express = require('express')
const { objectToXml } = require('js-object-to-xml')
const db = require('./db')
const setting = require('./setting')
const hasTypes = require('./has-types')


const router = express.Router()

// Requests for product resources.
router.get("/", function(request, response){
	db.getAllProducts(function(errors, products){
		if(errors.length == 0){
			if(request.header("Accept") == "application/xml"){
				const xmlProducts = objectToXml(products)
				response.status(200).send(xmlProducts)
			}else{
				response.status(200).json(products)
			}
		}else{
			response.status(500).end()
		}
	})
})

//Get product by id
router.get("/:id", function(request, response){
	console.log("inside productRouter")
	
	const id = request.params.id
	
	db.getProductById(id, function(errors, product){
		if(errors.length == 0){
			if(product){
				console.log(product)
				if(request.header("Accept") == "application/xml"){
					const xmlProduct = objectToXml(product)
					response.status(200).send(xmlProduct)
				}else{
					response.status(200).json(product)
				}
			}else{
				response.status(404).end()
			}
		}else{
			response.status(500).end()
		}
	})
	
})

//Create new product
router.post("/", function(request, response){
	
	const product = request.body
	
	// Check that the product contains all expected properties.
	const productTypes = {
		name: String,
		type: String,
		weight: Number,
		price: Number,
		stock: Number,
		energy: Number,
		flavor: String,
		ingredients: String
	}
	
	if(!hasTypes(product, productTypes)){
		response.status(422).end()
		return
	}
	
	// Check authorization.
	
	const userType = request.userType
	if(!userType){
		response.status(401).end("notAuthenticated")
		return
	}else if(userType != 1){
		// Not Authorized.
		response.status(401).end("notAuthorized")
		return
	}
	
	
	// Validate the product.
	const validationErrors = []
	
	if(product.name.length < setting.NAME_MIN_LENGTH){
		validationErrors.push("nameTooShort")
	}else if(setting.NAME_MAX_LENGTH < product.name.length){
		validationErrors.push("nameTooLong")
	}
	
	if(product.ingredients.length <setting.INGREDIENTS_MIN_LENGTH){
		validationErrors.push("ingredientsTooShort")
	}else if(setting.INGREDIENTS_MAX_LENGTH < product.ingredients.length){
		validationErrors.push("ingredientsTooLong")
	}
	
	if(0 < validationErrors.length){
		if(request.header("Accept") == "application/xml"){
			const xmlValidationErrors = objectToXml(validationErrors)
			response.status(400).send(xmlValidationErrors)
		}else{
			response.status(400).json(validationErrors)
		}
		return
	}
	
	// Try to create the product.
	db.createProduct(product, function(errors, id){
		if(errors.length == 0){
			response.setHeader("Location", "/products/"+id)
			response.status(201).end()
		}else if(errors.includes("productNotFound")){
			if(request.header("Accept") == "application/xml"){
				const xmlErrors = objectToXml(errors)
				response.status(400).send(xmlErrors)
			}else{
				response.status(400).json(errors)
			}
		}else{
			console.log(errors)
			response.status(500).end()
		}
	})
	
})

router.put("/:id", function(request, response){
	
	const id = request.params.id
	const updatedProduct = request.body
	
	// Check that the product contains all expected properties.
	const productTypes = {
		id: Number,
		name: String,
		type: String,
		stock: Number,
		weight: Number,
		energy: Number,
		price: Number,
		ingredients: String,
		flavor: String
	}

	if(!hasTypes(updatedProduct, productTypes)){
		
		response.status(422).end()
		return
	}
	
	db.getProductById(id, function(errors, oldProduct){
		
		if(0 < errors.length){
			response.status(500).end()
			return
		}else if(!oldProduct){
			response.status(404).end()
			return
		}

		// Check authorization.
		const userType = request.userType
		if(!userType){
			// Unauthenticated.
			response.status(401).end("notAuthenticated")
			return
		}else if(userType != 1){
			// Not Authorized.
			response.status(401).end("notAuthorized")
			return
		}
		
		// Try to update the activity.
		db.updateProductById(id, updatedProduct, function(errors, didExist){
			if(errors.length == 0){
				if(didExist){
					response.status(204).end()
				}else{
					response.status(404).end()
				}
			}else if(errors.includes("invalidProductId")){
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
	
})

//Delete product
router.delete("/:id", function(request, response){
	
	const id = request.params.id
	
	db.getProductById(id, function(errors, product){
		
		if(0 < errors.length){
			response.status(500).end()
			return
		}else if(!product){
			response.status(404).end()
			return
		}
		
		// Check authorization.
		const userType = request.userType
		if(!userType){
			// Unauthenticated.
			response.status(401).end("notAuthenticated")
			return
		}else if(userType != 1){
			// Not Authorized.
			response.status(401).end("notAuthorized")
			return
		}

		// Try to delete the activity.
		db.deleteProductById(id, function(errors, didExist){
			if(errors.length == 0){
				if(didExist){
					response.status(204).end()
				}else{
					response.status(404).end()
				}
			}else{
				response.status(500).end()
			}
		})
		
    })
})

module.exports = router