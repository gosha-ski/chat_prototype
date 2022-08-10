import {localSocketModel} from "./localSocketModel"
import {globalConnections} from "../wss/defineWss"
import {globalSocketModel} from "./globalSocketModel"
import {localConnections} from "../wss/defineWss"
import * as uniqid from "uniqid"
import * as jwt from "jsonwebtoken"
import {RoomUserModel} from "../rooms/roomUserModel"
import {RoomModel} from "../rooms/roomModel"
require('dotenv').config();


export async function initSocket(socket, request){
	try{	
		//console.log(request.url)
		let jwtToken = request.headers.cookie.split("AuthenticationToken=")[1]
		let user = jwt.verify(jwtToken, process.env.JWT_KEY)
		let id = uniqid()
		socket.user = user
		socket.id = id

		if(request.url.split("/")[1] == process.env.GLOBAL_SOCKET_TYPE){
			socket.type = process.env.GLOBAL_SOCKET_TYPE
			let globalSocket = new globalSocketModel({
				_id: id,
				socket: socket,
				user: user,
				type: process.env.GLOBAL_SOCKET_TYPE
			})
			await globalSocket.save()
			globalConnections[id] = socket

		}else if(request.url.split("/")[2]){
			//console.log("localSocket added")
			let roomId = request.url.split("/")[2]
			initUserRoom(roomId, user, socket, id)
		}
	}catch(error){
		console.log(error)
	}
}



async function initUserRoom(roomId, user, socket, socketId){
	try{

		let room = (await RoomModel.findAll({where: {id: roomId	}}))[0]
		if(room){
			//console.log("roomExist")
			let roomUser = (await RoomUserModel.findAll({where: {userId: user.id,roomId: roomId}}))[0]
			if(roomUser){
				socket.roomId = roomId
				socket.type = process.env.LOCAL_SOCKET_TYPE
				localConnections[socketId] = socket
				console.log("OPEN LOCAL_SOCKET_TYPE")
			}else{
				socket.roomId = roomId
				socket.type = process.env.LOCAL_SOCKET_TYPE
				localConnections[socketId] = socket
				await RoomUserModel.create({
					roomId: roomId,
					userId: socket.user.id
				})
			}

		}else{
			console.log("room with this id not exist")
		}

	}catch(error){
		console.log(error)
	}
}