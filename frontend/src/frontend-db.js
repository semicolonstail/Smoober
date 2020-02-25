const jwtDecode = require('jwt-decode')

const networkDelayInMs = 10
const rootPath = "http://localhost:8000"



/**************************************************************************
                         Send Request Function 
 **************************************************************************/
async function sendRequest(method, uri, body=null, contentType="application/json", accept="application/json"){
	
	let bodyToSend = ""
	const headers = new Headers()
	headers.append("Accept", accept)

	// Add the access token if signed in.	
	if(localStorage.accessToken){
		const accessToken = JSON.parse(localStorage.accessToken)
		headers.append("Authorization", "Bearer "+accessToken)
	}
	
	// Add the body if available.
	if(body != null){
		
		headers.append("Content-Type", contentType)
		//Add Content-Type according to the parameter
		switch(contentType){
			
			case "application/json":
				bodyToSend = JSON.stringify(body)
				break
			
			case "application/x-www-form-urlencoded":
				const data = new URLSearchParams()
				for(const key of Object.keys(body)){
					data.append(key, body[key])
				}
				bodyToSend = data.toString()
				break
			
			case "application/xml":
				bodyToSend = body.toString()
				break
				
			default:
				alert("ERROR, unknown Content-Type to send body with.")
			
		}
		
	}
	
	try{
		
		const requestInit = {
			method,
			headers,
			credentials: "omit"
		}
		
		if(bodyToSend != ""){
			requestInit.body = bodyToSend
		}
		
		await sleep(networkDelayInMs)
		return await fetch(rootPath+uri, requestInit)
		
	}catch(error){
		throw ["networkError"] 
	}
	
}

function displayError(response){
	
	alert(`
		SDK has not been programmed to handle status code ${response.status}
		for the last request sent.
	`)
	
}


/**************************************************************************
                         CRUD Operation for Users 
 **************************************************************************/
module.exports.getUserById = async function(id, callback){
	
	let response
	
	try{
		response = await sendRequest("GET", "/users/"+id)
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	let user = null
	
	switch(response.status){
		
		case 200:
			user = await response.json()
			break
		
		case 404:
			errors = ["notFound"]
			break
		
		case 500:
			errors = ["backendError"]
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors, user)
	
}

module.exports.createUser = async function(user, callback){
	
	let response
	
	
	try{
		response = await sendRequest("POST", "/users", user)
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	let id = -1
	
	switch(response.status){
		
		case 201:
			const locationHeader = response.headers.get("Location")
			id = parseInt(locationHeader.substr("/users/".length))
			break
		
		case 400:
			errors = await response.json()
			break
		
		case 422:
			errors = ["invaliduser"]
			break
		
		case 500:
			errors = ["backendError"]
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors, id)
	
}

module.exports.signIn = async function(username, password, callback){
	
	const bodyToSend = {
		username,
		password,
		grant_type: "password"
	}
	
	let response
	
	try{
		response = await sendRequest("POST", "/tokens", bodyToSend, "application/x-www-form-urlencoded")
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	let user = {
		id: -1,
		username: "",
		type: ''
	}
	
	let body
	
	switch(response.status){
		
		case 200:
			
			body = await response.json()

			const thirdPartyAccessToken = body.access_token
			localStorage.accessToken = JSON.stringify(thirdPartyAccessToken)
			
			const payload = jwtDecode(body.id_token)
			
			user.id = payload.sub
			user.username = payload.preferred_username
			user.type = payload.type 
			break
		
		case 400:
			
			body = await response.json()
			
			switch(body.error){
				
				case "invalid_grant":
					errors = ["wrongCredentials"]
					break

				case "wrong_password":
					errors = ["wrongPassword"]
					break
				
				default:
					errors = ["unknownErrorGettingToken: " + body.error]
					alert(`
						SDK has not been programmed to handle error ${body.error}
						when failing to login.
					`)
				
			}
			
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors, user)
	
}

// Third Party Authorization for google
module.exports.thirdParty = async function(oneTimeCode, callback){
	
	const bodyToSend = {
		oneTimeCode
	}
	
	
	let response
	
	try{
		response = await sendRequest("POST", "/storeauthcode", bodyToSend, "application/x-www-form-urlencoded")
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	let user = {
		id: -1,
		username: "",
		type: 0
	}
	
	let body
	
	switch(response.status){
		
		case 200:
			
			body = await response.json()

			const thirdPartyAccessToken = body.access_token
			localStorage.accessToken = JSON.stringify(thirdPartyAccessToken)
			
			const payload = jwtDecode(body.id_token)
			user.id = payload.sub
			user.username = payload.preferred_username
			user.type = payload.type 
			console.log(user)
			break
		
		case 400:
		
				body = await response.json()
				
				switch(body.error){
					
					case "noAuthcode":
						errors = ["failGetAuthcode"]
						break
					
					default:
						errors = ["unknownErrorGettingToken: " + body.error]
						alert(`
							SDK has not been programmed to handle error ${body.error}
							when failing to login.
						`)
				}			
				break

		case 500:
			
			body = await response.json()
			
			switch(body.error){
				
				case "authError":
					errors = ["invalidAuthorization"]
					break
				
				case "verifyError":
				errors = ["invalidAuthCode"]
				break
				
				default:
					errors = ["unknownErrorGettingToken: "+body.error]
					alert(`
						SDK has not been programmed to handle error ${body.error}
						when failing to login.
					`)
			}			
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors, user)
	
}

module.exports.signOut = async function(callback){
	localStorage.removeItem("accessToken")
	callback()
}


/**************************************************************************
                         CRUD Operation for Orders 
 **************************************************************************/
module.exports.getOrdersByUserId = async function(userId, callback){
	
	let response
	
	try{
		response = await sendRequest("GET", "/orders?userId="+userId)
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	let orders = []
	
	switch(response.status){
		
		case 200:
			orders = await response.json()
			break
		
		case 500:
			errors = ["backendError"]
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors, orders)
	
}

module.exports.createOrder = async function(order, callback){
	
	/* order example
	{
		"userId": 1,
		"products": [
		  { "productId": 2, "amount": 2 },
		  { "productId": 3, "amount": 3}
		],
		"total": 55
	  }
	*/

	let response
	
	try{
		response = await sendRequest("POST", "/orders", order)
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	let id = -1
	
	switch(response.status){
		
		case 201:
			const locationHeader = response.headers.get("Location")
			id = parseInt(locationHeader.substr("/orders/?userId=".length))
			break
		
		case 400:
			errors = await response.json()
			break
		
		case 401:
			errors = await response.json()
			break
		
		case 422:
			errors = ["invalidorder"]
			break
		
		case 500:
			errors = ["backendError"]
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors, id) 
	
}


/**************************************************************************
                         CRUD Operation for Products 
 **************************************************************************/
module.exports.getAllProducts = async function(callback){
	
	let response
	
	try{
		response = await sendRequest("GET", "/products")
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	let products = []
	
	switch(response.status){
		
		case 200:
			products = await response.json()
			break
		
		case 500:
			errors = ["backendError"]
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors, products)
	
}

module.exports.getProductById = async function(id, callback){
	
	let response
	
	try{
		response = await sendRequest("GET", "/products/"+id)
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	
	
	switch(response.status){
		
		case 200:
			product = await response.json()
			break
		
		case 404:
			errors = ["notFound"]
			break
		
		case 500:
			errors = ["backendError"]
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors, product)
	
}

module.exports.createProduct = async function(product, callback){
	
	let response
	
	try{
		response = await sendRequest("POST", "/products", product)
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	let id = -1
	
	switch(response.status){
		
		case 201:
			const locationHeader = response.headers.get("Location")
			id = parseInt(locationHeader.substr("/products/".length))
			break
		
		case 400:
			errors = await response.json()
			break
		
		case 401:
			errors = await response.json()
			break
		
		case 422:
			errors = ["invalidProduct"]
			break
		
		case 500:
			errors = ["backendError"]
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors, id)
	
}

module.exports.deleteProductById = async function(id, callback){
	
	let response
	
	try{
		response = await sendRequest("DELETE", "/products/"+id)
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	
	switch(response.status){
		
		case 204:
			break
		
		case 401:
			errors = await response.json()
			break
		
		case 404:
			errors = ["notFound"]
			break
		
		case 500:
			errors = ["backendError"]
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors)
	
}

module.exports.updateProductById = async function(id, product, callback){
	
	let response
	
	try{
		response = await sendRequest("PUT", "/products/"+id, product)
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	
	switch(response.status){
		
		case 204:
			break
		
		case 400:
			errors = await response.json()
			break
		
		case 401:
			errors = await response.json()
			break
		
		case 404:
			errors = ["notFound"]
			break
		
		case 422:
			errors = ["invalidProduct"]
			break
		
		case 500:
			errors = ["backendError"]
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors)
	
}


/**************************************************************************
                         CRUD Operation for OpeningHours 
 **************************************************************************/
module.exports.getOpeningHours = async function(callback){
	
	let response
	
	try{
		response = await sendRequest("GET", "/openhours", null, null, "application/xml")
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	let openHours = []
	
	switch(response.status){
		
		case 200:
			strOpenHours = await response.text()
			const parser = new DOMParser()
			const xmlOpenHours = parser.parseFromString(strOpenHours,"text/xml")
			const weekdayArr = xmlOpenHours.getElementsByTagName("weekday")
			const timeArr = xmlOpenHours.getElementsByTagName("time")

			for(let i=0; i<weekdayArr.length; i++){
				openHours.push({
					weekday: weekdayArr[i].textContent,
					time: timeArr[i].textContent
				})
			}
			break
		
		case 500:
			errors = ["backendError"]
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors, openHours)
	
}

module.exports.updateOpeningHours = async function(openingHours, callback){
	
	/*openingHours example 
		openingHours = {[
			{weekday: "weekday",
			 time: "8:00 -- 9:00"},
			{weekday: "weekend",
			 time: "8:00 -- 9:00"},
		]}
	*/
	
	let body = ""

	for (const specificDay of openingHours) {
		if(specificDay.weekday == 0){
			body += "<weekday>1</weekday>"
					+ "<time>" + specificDay.time + "</time>"
		}else{
			body += "<weekday>0</weekday>"
					+ "<time>" + specificDay.time + "</time>"
		}
	}

	const bodyToSend = "<?xml version='1.0' encoding='utf-8'?> <openingHours>" + body + "</openingHours>"

	let response
	
	try{
		response = await sendRequest("PUT", "/openhours", bodyToSend, "application/xml")
	}catch(errors){
		callback(errors)
		return
	}
	
	let errors = []
	
	switch(response.status){
		
		case 204:
			break
		
		case 400:
			errors = await response.json()
			break
		
		case 401:
			errors = await response.json()
			break
		
		case 404:
			errors = ["notFound"]
			break
		
		case 500:
			errors = ["backendError"]
			break
		
		default:
			displayError(response)
		
	}
	
	callback(errors)
	
}


async function sleep(ms){
	return new Promise(resolve => setTimeout(resolve, ms));
}
