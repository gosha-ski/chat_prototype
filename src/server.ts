import {UserController} from "./users/userController"
import {App} from "./app"

let app = new App([
	new UserController()
])