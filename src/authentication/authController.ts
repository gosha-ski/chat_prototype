import {Router} from "express"
import {UserModel} from "../users/userModel"
import * as uniqid from "uniqid"
import * as jwt from "jsonwebtoken"
require('dotenv').config();


export class AuthController{
	router = Router()
	path = "/auth"

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.get(`${this.path}/login`, this.renderLoginPage)
		this.router.post(`${this.path}/login`, this.login)
		this.router.post(`${this.path}/register`, this.register)
	}

	private renderLoginPage(request, response){
		try{
			response.sendFile("/home/gosha/seqlApp/src/public/authentication.html")
		}catch(error){
			console.log(error)
		}

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
					//console.log(user.get())
					let token = jwt.sign(user.get(), process.env.JWT_KEY)
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