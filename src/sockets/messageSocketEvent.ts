import {localConnections} from "../wss/defineWss"
import {globalConnections} from "../wss/defineWss"
import {MessageModel} from "../messages/messageModel"
import {RoomUserModel} from "../rooms/roomUserModel"
import * as uniqid from "uniqid"
import {UnreadMessageModel} from "../messages/unreadMessageModel"

export function messageSocketEvent(socket){
	return async function(data){
	try{
		notifyRoomSubscribers(socket, data)
		sendMessage(socket, data)
	}catch(error){
		console.log(error)
	}
	}
}




async function sendMessage(socket, data){
	try{
		let roomUser = (await RoomUserModel.findAll({
			where:{
				userId: socket.user.id,
				roomId: socket.roomId
			}
		}))[0]
		if(roomUser){

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

		}

	}catch(error){

	}
}



// async function checkUserSocketInRoom(socket){
// 	try{
// 		console.log(socket.user.id, socket.roomId)
// 		let roomUser = (await RoomUserModel.findAll({
// 			where:{
// 				userId: socket.user.id,
// 				roomId: socket.roomId
// 			}
// 		}))[0]
// 		if(roomUser){
// 			console.log("socket exist in room")
// 			return true
// 		}else{
// 			console.log("socket dont exist in room")
// 		}


// 	}catch(error){
// 		console.log(error)
// 	}
// }

async function notifyRoomSubscribers(socket, data){
	try{
		let roomUser = (await RoomUserModel.findAll({
			where:{
				userId: socket.user.id,
				roomId: socket.roomId
			}
		}))[0]
		if(roomUser){
			let roomUserArray = (await RoomUserModel.findAll({
				where: {
					roomId: socket.roomId,
				}
			}))
		//console.log(roomUserArray)

		let usersInRoom = {}
		for(let elem of roomUserArray){
			let roomUser = elem.get()
			usersInRoom[roomUser.userId] = {userId:roomUser.userId}
		}
		//console.log(usersInRoom)

		let socketsInRoom = {}
		for(let key in localConnections){
			if(localConnections[key].roomId == socket.roomId){
				let userId = localConnections[key].user.id
				socketsInRoom[userId] = localConnections[key]
			}
		}
		
		let listForAlert = {}
		for(let key in usersInRoom){
			if(socketsInRoom[key]){

			}else{
				//console.log("uvedomlenie to ", usersInRoom[key])
				listForAlert[key] = usersInRoom[key]
			}
		}
		increaseUnreadMessages(listForAlert, socket.roomId)

		for(let key in globalConnections){
			let userId = globalConnections[key].user.id
			if(listForAlert[userId]){
				globalConnections[key].send(JSON.stringify({
					fromRoomId: socket.roomId,
					content: data.toString()
				}))
			}
		}
	}
}catch(error){
	console.log(error)
}

}


async function increaseUnreadMessages(listForAlert, roomId){
	try{
		console.log("____________________________")
		console.log(listForAlert)
		for(let id in listForAlert){
			let user = listForAlert[id]
			let row = (await UnreadMessageModel.findAll({where:{
				roomId: roomId,
				userId: user.userId
			}}))[0].get()

			console.log(row)
			// let count = row.unread_messages_count
			// console.log(count)

			UnreadMessageModel.update({unread_messages_count: row.unread_messages_count+1},{
				where:{
					roomId: roomId,
					userId: user.userId
				}
			})
		}

	}catch(error){
		console.log(error)
	}
}