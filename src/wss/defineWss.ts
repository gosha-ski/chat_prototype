import {globalSocketModel} from "../sockets/globalSocketModel"
import {localSocketModel} from "../sockets/localSocketModel"
import * as uniqid from "uniqid"
import * as jwt from "jsonwebtoken"
import {initSocket} from "../sockets/initSocket"
import {closeSocketEvent} from "../sockets/closeSocketEvent"
import {messageSocketEvent} from "../sockets/messageSocketEvent"
require('dotenv').config();

export async function defineWss(socket, request){
	initSocket(socket, request)
	socket.on("message", messageSocketEvent(socket))
	socket.on("close", closeSocketEvent(socket))

}

export let localConnections = {}



