import {Router} from "express"
import {UserModel} from "./userModel"
import {authMiddleware} from "../middleware/authMiddleware"
import {RoomUserModel} from "../rooms/roomUserModel"

export class UserController{
	router = Router()
	path = "/users"

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.get(this.path, authMiddleware, this.getAllUsers)
		this.router.get(`${this.path}/:id`, authMiddleware, this.getUserById)
		this.router.get(`${this.path}/:id/rooms`, authMiddleware, this.getUserRoom)
		this.router.get(`${this.path}/:id/friends`, authMiddleware, this.getUserFriends)
	}

	private getUserFriends = async(request, response)=>{
		try{
			let users = await UserModel.findAll()
			for(let i=0; i<10; i++){
				response.write()
			}
			response.end()

		}catch(error){
			console.log(error)
		}
	}




	private getUserRoom = async(request, response)=>{
		try{
			//console.log(request.user, request.params)
			if(request.user.id == request.params.id){
				let rooms = (await RoomUserModel.findAll({
					where: {
						userId: request.user.id
					}
				}))
				response.send(rooms)
			}

		}catch(error){
			console.log(error)
		}
	}

	private getAllUsers = async(request, response)=>{
		try{
			let users = await UserModel.findAll()
			for(let i=0; i<users.length; i++){
				let user = users[i].get()
				response.write(`
					<div class="friend" style="font-family:sans-serif; color: black; font-size:14px; padding: 10px;">
					<p>${user.id}<p/>
					<a href="http://localhost:5000/users/${user.id}" style="color: black; text-decoration:none; border: 2px solid black; border-radius: 1rem; padding: 8px 14px;"> change</a>
					</div>`
				)

			}
			response.end()
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