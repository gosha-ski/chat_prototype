import {sequelize} from "../sequelize/sequelizeConnection"
import {DataTypes} from "sequelize"
import {UserModel} from "../users/userModel"

export const MessageModel = sequelize.define("MessageModel", {
	id: {
		type: DataTypes.STRING,
		primaryKey: true
	},

	authorId: {
		type: DataTypes.STRING,
		references: {
			model: UserModel,
			key: "id"
		}
	},
	content: {
		type: DataTypes.STRING
	}
}, {
	tableName: "messages",
	timestamps: false
})

MessageModel.sync()