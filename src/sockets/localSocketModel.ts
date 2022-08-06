import {Schema, model} from "mongoose"

const localSocketSchema = new Schema({
	_id: String,
	user: Schema.Types.Mixed,
	roomId: String, 
	socket: Schema.Types.Mixed,
	type: String
})

export const localSocketModel = model("localSocketModel", localSocketSchema)