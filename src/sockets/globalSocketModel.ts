import {Schema, model} from "mongoose"

const globalSocketSchema = new Schema({
	_id: String,
	user: Schema.Types.Mixed,
	socket: Schema.Types.Mixed
})

export const globalSocketModel = model("globalSocketModel", globalSocketSchema)