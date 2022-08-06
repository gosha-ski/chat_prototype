import {Router} from "express"
import {RoomModel} from "./roomModel"
import * as uniqid from "uniqid"
 
export class RoomController{
	router = Router()
	path = "/rooms"

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.get(`${this.path}`, this.renderRoom)
		this.router.post(`${this.path}`, this.createRoom)
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
}