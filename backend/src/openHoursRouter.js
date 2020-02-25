const express = require('express')
const db = require('./db')


const router = express.Router()

router.get("/", function(request, response){
    
        db.getOpeningHours(function(errors, openingHours){
            if(errors.length == 0){

                if(request.header("Accept") == "application/xml"){

                    let body = ""
        
                    for (const specificDay of openingHours) {
                        if(specificDay.weekday == 0){
                            body += "<weekday>0</weekday>"
                                    + "<time>" + specificDay.time + "</time>"
                        }else{
                            body += "<weekday>1</weekday>"
                                    + "<time>" + specificDay.time + "</time>"
                        }
                    }
        
                    const bodyToSend = "<?xml version='1.0' encoding='utf-8'?> <openingHours>" + body + "</openingHours>"
        
                    response.status(200).send(bodyToSend)
                }else{
                    response.status(200).json(openingHours)
                }
            }else{
                response.status(500).end()
            }
        })
    
    
	
})

router.put("/", function(request, response){

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
    
    const newOpeningHours = request.body.openingHours
    const weekday = newOpeningHours.weekday
    const time = newOpeningHours.time
    console.log(newOpeningHours)
    for(let i=0; i<weekday.length; i++){
        const singleNewOpeningHours = {
            weekday: weekday[i],
            time: time[i]
        }
        db.updateOpeningHours(singleNewOpeningHours, function(errors){
            if(errors.length == 0){	
			    response.status(204).end()	
			}else{
				response.status(500).end()
			}
        })
    }
	
})

module.exports = router