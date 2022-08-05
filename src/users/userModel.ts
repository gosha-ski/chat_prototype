import {sequelize} from "../sequelize/sequelizeConnection"
import {DataTypes} from "sequelize"

export const UserModel = sequelize.define("UserModel", {
	id: {
		type: DataTypes.STRING,
		primaryKey: true
	},
	email:{
		type: DataTypes.STRING,
		allowNull: false,
		unique: true
	},
	name: {
		type: DataTypes.STRING,
		allowNull: false
	},
	password: {
		type: DataTypes.STRING,
		allowNull: false
	}
},{
	tableName: "users",
	timestamps: false
})

// UserModel.sync({alter: true})

