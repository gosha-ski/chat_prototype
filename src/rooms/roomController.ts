import {Router} from "express"
import {RoomModel} from "./roomModel"
import {RoomUserModel} from "./roomUserModel"
import {authMiddleware} from "../middleware/authMiddleware"
import * as uniqid from "uniqid"
import {localConnections} from "../wss/defineWss"
import {UnreadMessageModel} from "../messages/unreadMessageModel"
  
export class RoomController{
	router = Router()
	path = "/rooms"

	constructor(){
		this.initRoutes()
	}

	private initRoutes(){
		this.router.get(`${this.path}/:id`, authMiddleware, this.getRoomById)
		this.router.get(`${this.path}`, authMiddleware, this.renderRoom)
		this.router.post(`${this.path}`, authMiddleware, this.initAction)
	}

	private initAction = async(request, response)=>{
		try{
			if(request.query.action == "createRoom"){
				this.createRoom(request, response)
			}else if(request.query.action =="leaveRoom"){
				this.leaveRoom(request, response)
			}

		}catch(error){
			console.log(error)
		}
	}

	private async getRoomById(request, response){
		try{
			let roomId = request.params.id
			// console.log("room id is ", roomId)
			let room = (await RoomModel.findAll({where: {id: roomId	}}))[0]
			if(room){
					UnreadMessageModel.update({unread_messages_count: 0}, {
					where: {
						userId: request.user.id,
						roomId: roomId
					}
				})
				response.sendFile("/home/gosha/seqlApp/src/public/particularRoom.html")
			}else{
				response.send("room with this id not exist")
			}

		}catch(error){
			console.log(error)
		}
	}

	private renderRoom = async(request, response)=>{
		try{
			response.sendFile("/home/gosha/seqlApp/src/public/room.html")

			// let rooms = (await RoomUserModel.findAll({
			// 	where: {
			// 		userId: request.user.id
			// 	}
			// }))
			// for(let i=0; i<rooms.length; i++){
			// 	let room = rooms[i].get()
			// 	let unread_messages_count = (await UnreadMessageModel.findAll({
			// 		where:{
			// 			roomId: room.roomId,
			// 			userId: room.userId
			// 		}
			// 	}))[0].get().unread_messages_count
			// 	console.log(unread_messages_count)
			// 	response.write(`
			// 		<div class="friend" style="font-family:sans-serif; color: black; font-size:14px; padding: 10px;">
			// 		<p>roomID:${room.roomId}| +${unread_messages_count}<p/>
			// 		<a href="http://localhost:5000/rooms/${room.roomId}" style="color: black; text-decoration:none; border: 2px solid black; border-radius: 1rem; padding: 8px 14px;"> change</a>
			// 		<div>___________________________________</div>
			// 		</div>
			// 		`)
			// }
			// response.end()
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

	private leaveRoom = async(request, response)=>{
		try{
			//console.log("leaveRoom")
			let roomId = request.body.roomId
			let userId = request.user.id
		
			for(let key in localConnections){
				//console.log(localConnections[key])
				//console.log("_____________________________________________________________")
				if(localConnections[key].user.id == userId && localConnections[key].roomId == roomId){
					delete localConnections[key]
					//console.log("delete Socket from room")
				}
			}

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