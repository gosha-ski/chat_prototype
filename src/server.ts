import {UserController} from "./users/userController"
import {AuthController} from "./authentication/authController"
import {RoomController} from "./rooms/roomController"
import {App} from "./app"

let app = new App([
	new UserController(),
	new AuthController(),
	new RoomController()
])