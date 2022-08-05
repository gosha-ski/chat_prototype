import {UserController} from "./users/userController"
import {AuthController} from "./authentication/authController"
import {App} from "./app"

let app = new App([
	new UserController(),
	new AuthController()
])