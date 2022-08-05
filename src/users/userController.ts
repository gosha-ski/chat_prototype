import {Router} from "express"
import {UserModel} from "./userModel"

export class UserController{
	router = Router()
	path = "/users"

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.get(this.path, this.getAllUsers)
		this.router.get(`${this.path}/:id`, this.getUserById)
	}

	private getAllUsers = async(request, response)=>{
		try{
			let users = await UserModel.findAll()
			response.send(users)
		}catch(error){
			console.log(error)
		}
	}

	private getUserById = async(request, response)=>{
		try{
			let id = request.params.id
			let user = await UserModel.findAll({
				where:{
					id: id
				}
			})
			response.send(user)
		}catch(error){
			console.log(error)
		}
	}

}