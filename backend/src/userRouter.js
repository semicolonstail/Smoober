const express = require('express')
const bcrypt = require('bcryptjs')
const { objectToXml } = require('js-object-to-xml')
const db = require('./db')
const setting = require('./setting')
const hasTypes = require('./has-types')

const router = express.Router()

// Requests for user resources.
router.get("/:id", function(request, response){
	console.log("running user")
	
	const id = request.params.id
	console.log(id)
	
	db.getUserById(id, function(errors, user){
		if(errors.length == 0){
			
			if(user){
				delete user.password

				if(request.header("Accept") == "application/xml"){
					const xmlUser = objectToXml(user)
					response.status(200).send(xmlUser)
				}else{
					response.status(200).json(user)
				}
			}else{
				response.status(404).end()
			}
		}else{
			response.status(500).end()
		}
	})
	
})

router.post("/", function(request, response){
	
	const user = request.body

	// Check that the user contains all expected properties.
	const userTypes = {
		username: String,
		password: String,
		type: Number
	}
	
	if(!hasTypes(user, userTypes)){

		response.status(422).end()
		return
	}
	
	// Validate the user.
	const validationErrors = []
	
	if(user.username.length < setting.USER_MIN_LENGTH){
		validationErrors.push("usernameTooShort")
	}else if(setting.USER_MAX_LENGTH < user.username.length){
		validationErrors.push("usernameTooLong")
	}
	
	if(user.password.length < setting.MIN_PASSWORD_LENGTH){
		validationErrors.push("passwordTooShort")
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
    

    //hash password
    const passwordToHash = user.password
    const hashValue = bcrypt.hashSync(passwordToHash, setting.hashingRounds)
    user.password = hashValue

	// Try to create the user.
	db.createUser(user, function(errors, id){
		if(errors.length == 0){
			response.setHeader("Location", "/users/"+id)
			response.status(201).end()
		}else if(errors.includes("usernameTaken")){
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