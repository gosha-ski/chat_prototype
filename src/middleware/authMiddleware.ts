import {UserModel} from "../users/userModel"
import * as jwt from "jsonwebtoken"

export async function authMiddleware(request, response, next){
	try{
		let token = request.cookies.AuthenticationToken
		let tokenData = jwt.verify(token, "key")
		let user = (await UserModel.findAll({
			where: {
				id: tokenData.id
			}
		}))[0]

		if(user){
			next()
		}else{
			response.send("auth Error")
		}
	}catch(error){
		console.log(error)
	}

}