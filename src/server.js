import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import routes from './routes/index.js'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
app.use(cors())

dotenv.config()

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

io.on('connection', (socket) => {

})



server.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`)
})

