import { BPlainMessage } from 'meteor-nem-library'
import { Router } from 'express'
import {
	KEY_ADDRESS, KEY_MESSAGE_PAYLOAD,
	KEY_MOSAIC, KEY_MOSAIC_ID, KEY_NEXT_PAGE_ID, KEY_PASSWORD, KEY_TRANSFER_TRANSACTION,
	KEY_TX_MESSAGE, KEY_WALLET,
	vCreateTransferTransaction, vFilterTransaction,
	vSignTransferTransaction
} from '../middleware/validators'
import { MAddress } from '../models/address'
import { TransactionJSON } from '../models/transaction'
import { createTransferTransaction, findTransactions, sendTransferTransaction } from '../models/transfer-transaction'
import { decrypt } from '../utilities/crypto-util'

export const transaction = () => {
	const api: Router = Router()

	api.get('/all/:address', async (req: any, res: any) => {
		try {
			const address = new MAddress(req.params.address)
			const txs: TransactionJSON = await address.transactions(req.query.nextpageid)
			res.send(txs)
		} catch (err) {
			res.status(409).json({ message: err.message })
		}
	})

	api.post('/decode/message', (req: any, res: any) => {
		try {
			const message = {
				payload: req.body[KEY_MESSAGE_PAYLOAD]
			}
			res.send({payload: BPlainMessage.castToPlainMessage(message).plain()})
		} catch (err) {
			res.status(409).json({ message: err.message })
		}
	})

	api.post('/create', vCreateTransferTransaction, async (req: any, res: any) => {
		try {
			res.send(await createTransferTransaction(req.body[KEY_ADDRESS], req.body[KEY_MOSAIC], req.body[KEY_TX_MESSAGE]))
		} catch (err) {
			res.status(409).json({ message: err.message })
		}
	})

	api.post('/send', vSignTransferTransaction, async (req: any, res: any) => {
		try {
			res.send(await sendTransferTransaction(req.body[KEY_WALLET], req.body[KEY_TRANSFER_TRANSACTION], decrypt(req.body[KEY_PASSWORD])))
		} catch (err) {
			res.status(409).json({ message: err.message })
		}
	})

	api.post('/filtered/byMosaicId', vFilterTransaction, async (req: any, res: any) => {
		try {
			res.send(await findTransactions(req.body[KEY_ADDRESS], req.body[KEY_MOSAIC_ID], req.body[KEY_NEXT_PAGE_ID]))
		} catch (err) {
			res.status(409).json({ message: err.message })
		}
	})

	return api
}
