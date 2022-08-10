import{sequelize} from "../sequelize/sequelizeConnection"
import {DataTypes} from "sequelize"
import {UserModel} from "../users/userModel"
import {RoomModel} from "../rooms/roomModel"

export let UnreadMessageModel = sequelize.define("UnreadMessageModel", {
	userId: {
		type: DataTypes.STRING,
		references:{
			model: UserModel,
			key: "id"
		}
	},
	roomId:{
		type: DataTypes.STRING,
		references:{
			model: RoomModel,
			key: "id"
		}
	},
	unread_messages_count:{
		type: DataTypes.INTEGER,
		defaultValue: 0
	}
},{
	tableName: "unread_messages",
	timestamps: false
})


UnreadMessageModel.removeAttribute("id")

UnreadMessageModel.sync()

