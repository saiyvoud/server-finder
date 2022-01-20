import express from "express";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from 'cors'

import dotenv from 'dotenv'
dotenv.config()

import './config/db.js'

import API from './routes/index.js'

const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors())
app.use(bodyParser.json({extended: false}))
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())

app.use('/api', API)

app.listen(PORT, ()=>{
    console.log(`server is running on port ${PORT}`)
})

