import {sequelize} from "../sequelize/sequelizeConnection"
import {DataTypes} from "sequelize"

export const RoomModel = sequelize.define("RoomModel", {
	id: {
		type: DataTypes.STRING,
		primaryKey: true
	},
	name: {
		type: DataTypes.STRING
	}
}, {
	tableName: "rooms",
	timestamps: false
})

