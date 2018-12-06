import { BAddress } from 'meteor-nem-library'
import { ioSocket } from '../index'

export interface TransactionJSON {
	transactions: Array<any>
	nextPageId?: number
}

export const confirmedListener = (address: string) => {
	new BAddress(address).confirmedTxObserver()
		.subscribe((transferTransaction) => {
			console.log('confirmed tx received')
			ioSocket().emit('confirmedTx', transferTransaction)
		}, err => {
			console.log(err)
		})
}

export const unconfirmedListener = (address: string) => {
	new BAddress(address).unconfirmedTxObserver()
		.subscribe((transferTransaction) => {
			console.log('unconfirmed tx received')
			ioSocket().emit('unconfirmedTx', transferTransaction)
		}, err => {
			console.log(err)
		})
}
