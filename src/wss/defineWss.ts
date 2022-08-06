import {globalSocketModel} from "../sockets/globalSocketModel"
import {localSocketModel} from "../sockets/localSocketModel"
import * as uniqid from "uniqid"
import * as jwt from "jsonwebtoken"
require('dotenv').config();

export async function defineWss(socket, request){
	initSocket(socket, request)
	socket.on("message", messageSocketEvent(socket))
	socket.on("close", closeSocketEvent(socket))

}

let localConnections = {}

function closeSocketEvent(socket){
	
	return async function(){
		console.log("close")
		console.log(socket.type, process.env.LOCAL_SOCKET_TYPE)
		if(socket.type == process.env.GLOBAL_SOCKET_TYPE){
			await globalSocketModel.deleteOne({_id: socket.id})
		}else if(socket.type == process.env.LOCAL_SOCKET_TYPE){
			console.log("localSocket id ", socket.id)
			delete localConnections[socket.id]
			console.log(localConnections)
			await localSocketModel.deleteOne({_id: socket.id})
		}
	}

}

function messageSocketEvent(socket){
	return async function(data){
	try{
		for(let key in localConnections){
			if(localConnections[key].roomId == socket.roomId){
				localConnections[key].send(
					`${socket.user.name}: ${data.toString()}`
				)
			}
		}
	}catch(error){
		console.log(error)
	}
	}
}

async function initSocket(socket, request){
	try{
	
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

		}else if(request.url.split("/")[2]){
			console.log("localSocket added")
			let roomId = request.url.split("/")[2]
			socket.roomId = roomId
			socket.type = process.env.LOCAL_SOCKET_TYPE
			let localSocket = new localSocketModel({
				_id: id,
				roomId: roomId,
				socket: socket,
				user: user,
				type: process.env.LOCAL_SOCKET_TYPE
			})
			
			await localSocket.save()

			localConnections[id] = socket
		}
	}catch(error){
		console.log(error)
	}
}


