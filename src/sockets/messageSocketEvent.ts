import {localConnections} from "../wss/defineWss"
import {MessageModel} from "../messages/messageModel"
import * as uniqid from "uniqid"

export function messageSocketEvent(socket){
	return async function(data){
	try{
		for(let key in localConnections){
			if(localConnections[key].roomId == socket.roomId){
				await MessageModel.create({
					id: uniqid(),
					authorId: socket.user.id,
					content: data.toString()
				})
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