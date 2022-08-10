import {Router} from "express"
import {RoomModel} from "./roomModel"
import {RoomUserModel} from "./roomUserModel"
import {authMiddleware} from "../middleware/authMiddleware"
import * as uniqid from "uniqid"
 
export class RoomController{
	router = Router()
	path = "/rooms"

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.get(`${this.path}/:id`, authMiddleware, this.getRoomById)
		this.router.get(`${this.path}`, authMiddleware, this.renderRoom)
		this.router.post(`${this.path}`, authMiddleware, this.createRoom)
	}

	private async getRoomById(request, response){
		try{
			let roomId = request.params.id
			console.log("room id is ", roomId)
			let room = (await RoomModel.findAll({where: {id: roomId	}}))[0]
			if(room){
				console.log(room.get())
				//response.send("<p>hello</p>")
				response.sendFile("/home/gosha/seqlApp/src/public/particularRoom.html")
			}else{
				response.send("room with this id not exist")
			}

		}catch(error){
			console.log(error)
		}
	}

	private renderRoom(request, response){
		try{
			response.sendFile("/home/gosha/seqlApp/src/public/room.html")
		}catch(error){
			console.log(error)
		}
	}

	private createRoom = async(request, response)=>{
		try{
			//console.log(request.query)
			if(request.query.action == "leaveRoom"){
				this.leaveRoom(request, response)
			}
			let body = request.body
			let id = uniqid()
			let room = await RoomModel.create({
				id: id,
				name: body.name
			})

		}catch(error){
			console.log(error)
		}
	}

	private leaveRoom = async(request, response)=>{
		try{
			//console.log(request.user)
			let roomId = request.body.roomId
			//console.log(roomId)
			let userId = request.user.id
			console.log(roomId, userId)
			await RoomUserModel.destroy({
				where: {
					roomId: roomId,
					userId: userId
				}
			})

		}catch(error){
			console.log(error)
		}
	}
}