import {Router} from "express"
 
export class RoomController{
	router = Router()
	path = "/rooms"

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.get(`${this.path}`, this.renderRoom)
	}

	private renderRoom(request, response){
		try{
			response.sendFile("/home/gosha/seqlApp/src/public/room.html")
		}catch(error){
			console.log(error)
		}
	}
}