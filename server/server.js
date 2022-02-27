import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()

import './config/db.js'
// import "./config/firebase-admin"


import API from './routes/index.js'

const app = express();

const PORT = process.env.PORT;

app.use(cors())
app.use(bodyParser.json({extended: false, limit: '500mb'}))
app.use(bodyParser.urlencoded({extended: false, limit: '500mb', parameterLimit: 50000}))
app.use(cookieParser())

app.use('/api', API)

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})

