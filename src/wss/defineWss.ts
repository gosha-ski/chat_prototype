import {globalSocketModel} from "../sockets/globalSocketModel"
import {localSocketModel} from "../sockets/localSocketModel"
import * as uniqid from "uniqid"
import * as jwt from "jsonwebtoken"
require('dotenv').config();

export async function defineWss(socket, request){
	initSocket(socket, request)
	socket.on("message", messageSocketEvent())
	socket.on("close", closeSocketEvent(socket))

}


function closeSocketEvent(socket){
	
	return async function(){
		console.log("close")
		if(socket.type == process.env.GLOBAL_SOCKET_TYPE){
			await globalSocketModel.deleteOne({_id: socket.id})
		}
	}

}

function messageSocketEvent(){
	return function(data){
		console.log(data.toString())
	}
}

async function initSocket(socket, request){
	try{
		console.log(request.headers.cookie.split("AuthenticationToken=")[1])
		let jwtToken = request.headers.cookie.split("AuthenticationToken=")[1]
		let user = jwt.verify(jwtToken, process.env.JWT_KEY)
		let id = uniqid()
		socket.user = user
		socket.id = id
		console.log(request.url.split("/")[1])


		if(request.url.split("/")[1] == process.env.GLOBAL_SOCKET_TYPE){
			socket.type = process.env.GLOBAL_SOCKET_TYPE
			let globalSocket = new globalSocketModel({
				_id: id,
				socket: socket,
				user: user,
				type: process.env.GLOBAL_SOCKET_TYPE
			})
			await globalSocket.save()
		}
	}catch(error){
		console.log(error)
	}
}


