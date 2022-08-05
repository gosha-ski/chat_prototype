import {Sequelize} from "sequelize"

export const sequelize = new Sequelize('seql_app', 'postgres', " ", {
	host: 'localhost',
	dialect: "postgres",
	logging: false
})
