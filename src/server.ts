import express, {Express} from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes'
import http from 'http'
import { Server } from 'socket.io'
import config from './config'
import morgan from 'morgan'
import {socketApp} from './services/socket'

const app: Express = express()
app.use(cors())

dotenv.config()
app.use(morgan('dev'));

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(routes)
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: '*',
    }
})
socketApp(io)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})



