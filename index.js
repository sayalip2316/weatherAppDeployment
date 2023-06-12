const express=require("express")
const {connection}=require("./db")
const {userRouter}=require("./routes/user.routes")
const {transports, format}=require('winston')
const expressWinston = require('express-winston')
const {weatherRouter}=require("./routes/weather.route")
const [auth, blacklistToken, isTokenBlacklisted, validateCityName]=require("./middleware/auth.middleware")
require('winston-mongodb')
const axios = require('axios');
require("dotenv").config()

const app=express()
app.use(express.json())

app.use(expressWinston.logger({
    meta: true,
    baseMeta:{
        service:'sayali-service'
    },
    transports: [
        new transports.MongoDB({
            level: 'error',
            db: 'mongodb://localhost:27017/logs',
            metaKey:'service'
        }),
        new transports.File({
            level: 'info',
            filename: 'infologs.log'
        })
    ],
    format: format.combine(
        format.json(),
        format.prettyPrint(),
        format.timestamp()
    ),
    statusLevels: true
}))
// const logger = createLogger({
//     transports: [
//       new transports.Console(),
//       new transports.File({ filename: 'error.log', level: 'error' }),
//     ],
//   });

app.use("/user",userRouter)
app.use("/weather",weatherRouter)



app.listen(process.env.PORT,async()=>{
    try {
        await connection
        console.log("Connected to db")
        console.log("Server is listening on port 4500") 
    } catch (error) {
        console.log(error)
    }
    
})