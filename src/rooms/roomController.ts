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

	private getRoomById(request, response){
		//console.log("getRoomById")
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