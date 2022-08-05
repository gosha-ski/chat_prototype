import {sequelize} from "../sequelize/sequelizeConnection"
import {DataTypes} from "sequelize"
import {RoomModel} from "./roomModel"
import {UserModel} from "../users/userModel"

export const RoomUserModel = sequelize.define("RoomUserModel", {
	userId: {
		type: DataTypes.STRING,
		references:{
			model: UserModel,
			key: "id"
		}
	},
	roomId: {
		type: DataTypes.STRING,
		references: {
			model: RoomModel,
			key: "id"
		}
	}
}, {
	tableName: "user_room",
	timestamps: false
})

RoomUserModel.removeAttribute('id');

// RoomUserModel.sync()