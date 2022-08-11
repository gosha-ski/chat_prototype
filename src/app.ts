import * as ws from "ws"
import * as http from "http"
import * as express from "express"
import {defineWss} from "./wss/defineWss"
import * as cookieParser from "cookie-parser"
import * as bodyParser from "body-parser"
import * as cors from "cors"
import {sequelize} from "./sequelize/sequelizeConnection"
import * as mongoose from "mongoose"


export class App{
	app 
	httpServer 
	wss 
	port = 5000
	constructor(controllers){
		this.app = express()
	    this.httpServer = http.createServer(this.app)
	    this.wss = new ws.WebSocketServer({server: this.httpServer, clientTracking: true})
		this.initMiddleware()
		this.initDataBasePG()
		this.initDataBaseMongo()
		this.initControllers(controllers)
		this.initWss()
		this.listen()
	}
	private initMiddleware(){
		this.app.set('view engine', 'pug')
		
		this.app.use(express.static(__dirname + '/public'));
		this.app.use(bodyParser.json())
		this.app.use(cookieParser())
		this.app.use(cors({
			origin: true,
			credentials: true
		}))
	}

	private initControllers(controllers){
		controllers.forEach(controller => this.app.use("/", controller.router))
	}

	private initWss(){
		this.wss.on("connection", defineWss)
	}

	private async initDataBaseMongo(){
		try{
			mongoose.connect("mongodb://localhost:27017/seql_app_db")
			.then(() => console.log('mongoDB successfully connected'));
		}catch(error){
			console.log(error)
		}
	}

	private async initDataBasePG(){
		try{
			await sequelize.authenticate()
			console.log('Database connection has been established successfully.');
		}catch(error){
			console.log(error)

		}
	}

	private listen(){
		this.httpServer.listen(this.port, ()=>{
			console.log("server works on", this.port)
		})
	}
}