import bodyParser = require('body-parser')
import express = require('express')
import http = require('http')
import { NetworkTypes } from 'meteor-nem-library'
import { Router } from 'express'
import { routes } from './api/routes'
import { initNEMLibrary } from './services/network-services'
import { socketInit } from './sockets'


const app = express()
const server = http.createServer(app)
const io = require('socket.io')(server, {
	serveClient: false,
	wsEngine: 'ws' // uws is not supported since it is a native module
})

initNEMLibrary(NetworkTypes.MAIN_NET)

io.on('connection', (client: any) => {
	console.log('new socket connection')
	socketInit(client)
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(routes(Router()))

server.listen(3000, () => {
	console.log(('  App is running at http://localhost:%d in %s mode'), 3000, app.get('env'))
	console.log('   Press CTRL-C to stop\n')
})

export const ioSocket = () => {
	return io
}
