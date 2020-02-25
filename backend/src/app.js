const express  = require('express')
const bodyParser = require('body-parser')
require('body-parser-xml')(bodyParser)
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { objectToXml } = require('js-object-to-xml')
const db = require('./db')
const setting = require('./setting')
const hasTypes = require('./has-types')
const userRouter = require('./userRouter')
const orderRouter = require('./orderRouter')
const productRouter = require('./productRouter')
const thirdRouter = require('./thirdRouter')
const openHoursRouter = require('./openHoursRouter')



// The application.
const app = express()

// Enable CORS.
app.use(function(request, response, next){
	
	// Allow any client to do anything (not optimal!).
	response.setHeader("Access-Control-Allow-Origin", "*")
	
	response.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE")
	if(request.header("Access-Control-Request-Headers")){
		response.setHeader(
			"Access-Control-Allow-Headers",
			request.header("Access-Control-Request-Headers")
		)
	}
	response.setHeader("Access-Control-Expose-Headers", "Location")
	
	next()
	
})

// Try to extract info from potential access token in the request.
app.use(function(request, response, next){
	
	try{
		
		const authorizationHeader = request.get("Authorization")
		const accessToken = authorizationHeader.substr("Bearer ".length)

		jwt.verify(accessToken, setting.ACCESS_TOKEN_SECRET, function(error, payload){
			if(error){
				console.log(`Retrieved invalid access token "${accessToken}".`)
			}else{
				request.userId = payload.userId
				request.userType = payload.userType
			}
			next()
		})
		
	}catch(error){
		next()
	}
	
})


// Add middleware to parse the body in incoming HTTP requests.
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.xml())



app.use("/products", productRouter)
app.use("/users", userRouter)
app.use("/orders", orderRouter)
app.use("/storeauthcode", thirdRouter)
app.use("/openhours", openHoursRouter)


// Requests for token resources.
app.post("/tokens", function(request, response){
	
	const grantInfo = request.body
	
	// Check that grantInfo contains all expected properties.
	const grantInfoTypes = {
		grant_type: String,
		username: String,
		password: String
	}
	
	if(!hasTypes(grantInfo, grantInfoTypes)){
		response.status(400).json({error: "invalid_request"})
		return
	}
	
	// Check that the grant type is supported.
	if(grantInfo.grant_type != "password"){
		response.status(400).json({error: "unsupported_grant_type"})
		return
	}
	

	db.getUserByUsername(grantInfo.username, function(errors, user){
		if(errors.includes("databaseError")){
			response.status(500).end()
		}else if(!user){
			response.status(400).json({error: "invalid_grant"})
		}else if(!bcrypt.compareSync(grantInfo.password, user.password)){
			response.status(400).json({error: "wrong_password"})
		}else{
			console.log(user)
			// Generate and send back access token + id token.
			const accessToken = jwt.sign({
				userId: user.id,
				userType: user.type
			}, setting.ACCESS_TOKEN_SECRET)
			
			const idToken = jwt.sign({
				sub: user.id,
				preferred_username: user.username,
				type: user.type
			}, setting.ID_TOKEN_SECRET)
			
			if(request.header("Accept") == "application/xml"){
				const xmlToken = objectToXml({
					token_type: "Bearer",
					access_token: accessToken,
					id_token: idToken,
				})
				response.status(200).send(xmlToken)
			}else{
				response.status(200).json({
					token_type: "Bearer",
					access_token: accessToken,
					id_token: idToken,
				})
			}	
			
		}
	})
	
})

app.listen(8000)