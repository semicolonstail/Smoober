const express = require('express')
const {google} = require('googleapis')
const {OAuth2Client} = require('google-auth-library')
const { objectToXml } = require('js-object-to-xml')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const db = require('./db')
const setting = require('./setting')

const router = express.Router()

router.post("/", function(request, response){
	
    const authCode = request.body.oneTimeCode
    //console.log(authCode)
    
    if(!authCode){
		response.status(400).json({error: "noAuthcode"})
		return
    }
    
    const oauth2Client = new google.auth.OAuth2(
        setting.CLIENT_ID,
        setting.CLIENT_SECRET,
        setting.REDIRECT_URL
    )
    

    oauth2Client.getToken(authCode).then(function(data){
        
        const idToken = data.tokens.id_token
		console.log(idToken)

		//verify the id token
		const client = new OAuth2Client(setting.CLIENT_ID)
		
        async function verify() {
			const ticket = await client.verifyIdToken({
				idToken: idToken,
				audience: setting.CLIENT_ID
			})
			const payload = ticket.getPayload()
			console.log(payload)  
			const username = payload['name']
			

			const thirdUsername = username + "google"
			const thirdPassword = bcrypt.hashSync(thirdUsername)
		
			//check the third user at database
			const thirdUser = {
				username: thirdUsername,
				password: thirdPassword,
				type: 2
			}
	
			const generateOwnToken = function(id, name){
					// Generate and send back access token + id token.
					const accessToken = jwt.sign({
						userId: id,
						userType: 2
					}, setting.ACCESS_TOKEN_SECRET)
					
					const idToken = jwt.sign({
						sub: id,
						preferred_username: name,
						type: 2
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

			db.getThirdUser(thirdUser, function(errors, user){
				if(user){
					generateOwnToken(user.id, user.username)									
				}else if(!user){
					db.createUser(thirdUser,function(errors,id){
						if(errors.length == 0){
							generateOwnToken(id, thirdUsername)
						}else{
							response.status(500).end()
						}
					})				
				}else if(errors.includes("databaseError")){
					response.status(500).end()
				}else{
					response.status(500).end()
				}
			})
        }
        verify().catch(function(e){
			console.log(e)
			response.status(500).end("verifyError")
		})
    }).catch(function(e){
		console.log(e)
		response.status(500).end("authError")
	})
	
			
	
})

module.exports = router
