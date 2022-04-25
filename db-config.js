require("dotenv").config();

const mysql = require("mysql2");

const connection = mysql.createConnection(
    {
        host: process.env.DH_HOST,
        port: process.env.DH_PORT,
        user: process.env.DH_USER,
        password: process.env.DH_PASSWORD,
        database : process.env.DH_NAME
    }
)

module.exports = connection;