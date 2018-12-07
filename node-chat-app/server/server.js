const path = require('path')
const http = require('http')
const hbs = require('hbs')
const express = require('express')
const socketIO = require('socket.io')

const publicPath = path.join(__dirname, '..', 'public')
const partialsPath = path.join(__dirname, '../views/partials')
const config = path.join(__dirname, '..', 'config', 'config.js')

//enviroment configurations
require(config)

var app = express()

//register partials
hbs.registerPartials(partialsPath)
app.set('view engine', 'hbs')

//helpers
hbs.registerHelper('public', () => {
  return publicPath
})

//public files
app.use(express.static(publicPath))

//routes
app.get('/', (req, resp) => {
  resp.render('home.hbs', {

  })

})

app.get('/chat', (req, resp) => {
  resp.render('chatroom.hbs', {

  })

})

//http server with sockets
var httpServer = http.createServer(app)
var io = socketIO(httpServer)

//sockets
io.on('connection', (socket) => {
  console.log('there is a new user connected')

  socket.on('createMessage', (msg) => {
    console.log('New Message created', msg)

    //add timestamp on message
    msg['timestamp'] = new Date().getTime()

    socket.emit('newMessage', msg)

    //broadcast
    io.emit('newMessage', msg)
  })

  socket.on('disconnect', () => {
    console.log('new user has been disconnected')
  })
})

//intiialize express
httpServer.listen(process.env.PORT, () => {
  console.log(`I am alive running on port ${process.env.PORT}`)
})