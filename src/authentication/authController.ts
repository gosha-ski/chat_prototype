import {Router} from "express"
import {UserModel} from "../users/userModel"
import * as uniqid from "uniqid"
import * as jwt from "jsonwebtoken"

export class AuthController{
	router = Router()
	path = "/auth"

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.post(`${this.path}/login`, this.login)
		this.router.post(`${this.path}/register`, this.register)
	}

	private login = async(request, response)=>{
		try{
			let body = request.body
			let user = (await UserModel.findAll({
				where:{
					email: body.email
				}
			}))[0]

			if(user){
				if(body.password == user.get("password")){
					console.log(user.get())
					let token = jwt.sign(user.get(), "key")
					response.cookie("AuthenticationToken", token)
					response.send("success sign in")
				}else{
					response.send("invalid passsword")
				}
			}else{
				response.send("User with this email not found")
			}

		}catch(error){
			console.log(error)
		}
	}

	private register = async(request, response)=>{
		try{
			let body = request.body
			let user = (await UserModel.findAll({
				where:{
					email: body.email
				}
			}))[0]

			if(user){
				response.send("user with this email already registed")
			}else{
				await UserModel.create({
					id: uniqid(),
					email: body.email,
					name: body.email,
					password: body.password
				})
				response.send("success sign up")
			}

		}catch(error){
			console.log(error)
		}
	}

}