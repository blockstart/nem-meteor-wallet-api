import socket = require('socket.io')

import { confirmedListener, unconfirmedListener } from './models/transaction'

export const socketInit = (client: socket.Socket) => {
	setupConfirmedObserver(client)
	setupUnconfirmedObserver(client)
}

const setupConfirmedObserver = (client: socket.Socket) => {
	client.on('setupConfirmedObserver', (address: string) => {
		confirmedListener(address)
	})
}

const setupUnconfirmedObserver = (client: socket.Socket) => {
	client.on('setupUnconfirmedObserver', (address: string) => {
		unconfirmedListener(address)
	})
}