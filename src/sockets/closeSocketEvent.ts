import {localConnections} from "../wss/defineWss"
import {globalConnections} from "../wss/defineWss"
import {globalSocketModel} from "./globalSocketModel"
require('dotenv').config();

export function closeSocketEvent(socket){
	
	return async function(){
		//console.log(socket.type, process.env.LOCAL_SOCKET_TYPE)
		if(socket.type == process.env.GLOBAL_SOCKET_TYPE){
			await globalSocketModel.deleteOne({_id: socket.id})
			delete globalConnections[socket.id]
			console.log("CLOSE SOCKET,", socket.type)
		}else if(socket.type == process.env.LOCAL_SOCKET_TYPE){
			//console.log("localSocket id ", socket.id)
			delete localConnections[socket.id]
			//console.log(localConnections)
			// await localSocketModel.deleteOne({_id: socket.id})
			console.log("CLOSE SOCKET,", socket.type)
		}
	}

}