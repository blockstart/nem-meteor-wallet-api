import { Address, BSimpleWallet, Password, QRService, SimpleWallet } from 'meteor-nem-library'
import { Router } from 'express'
import {
	KEY_ADDRESS,
	KEY_PASSWORD,
	KEY_PRIVATE_KEY,
	KEY_QRSTRING, KEY_WALLET,
	KEY_WALLET_NAME, vEncryptedPrivateKey, vExportWallet,
	vPassword, vQRObject,
	vQRString,
	vWalletName
} from '../middleware/validators'
import { getEncrypedPrivateKey } from '../models/account'
import { decrypt, encrypt } from '../utilities/crypto-util'

export const wallet = () => {
	const api: Router = Router()

	api.post('/import/qrstring', vQRString, (req: any, res: any) => {
		try {
			if (req.body[KEY_QRSTRING] !== '') {
				const wallet = SimpleWallet.readFromWLT(req.body[KEY_QRSTRING])
				res.send(wallet)
			} else {
				res.status(409).json({ message: 'Need qr code string to import wallet' })
			}
		} catch (err) {
			res.status(409).json({ message: err.message })
		}
	})

	api.post('/import/qrobject', vQRObject, (req: any, res: any) => {
		try {
			if (req.body.data.priv_key && req.body.data.salt && req.body.data.name && req.body[KEY_PASSWORD]) {
				const pw = new Password(decrypt(req.body[KEY_PASSWORD]))
				const privateKey = new QRService().decryptWalletQRText(pw, req.body)
				const wallet = SimpleWallet.createWithPrivateKey(req.body.data.name, pw, privateKey)
				res.send(wallet)
			} else {
				res.status(409).json({ message: 'Need encrypted private key and password to import wallet' })
			}
		} catch (err) {
			res.status(409).json({ message: err.message })
		}
	})

	api.post('/create', vWalletName, vPassword, (req: any, res: any) => {
		try {
			if (req.body[KEY_PRIVATE_KEY] !== '') {
				const wallet = SimpleWallet.createWithPrivateKey(req.body[KEY_WALLET_NAME], new Password(decrypt(req.body[KEY_PASSWORD])), decrypt(req.body[KEY_PRIVATE_KEY]))
				res.send(wallet)
			} else {
				const wallet = SimpleWallet.create(req.body[KEY_WALLET_NAME], new Password(decrypt(req.body[KEY_PASSWORD])))
				res.send(wallet)
			}
		} catch (err) {
			res.status(409).json({ message: err.message })
		}
	})

	api.post('/export', vExportWallet, (req: any, res: any) => {
		try {
			req.body[KEY_ADDRESS] = new Address(req.body[KEY_ADDRESS].value)
			const wallet = BSimpleWallet.castToSimpleWallet(req.body)
			res.send({ qrstring: wallet.writeWLTFile() })
		} catch (err) {
			res.status(409).json({ message: err.message })
		}
	})

	api.post('/encryptedPrivateKey', vEncryptedPrivateKey, async (req: any, res: any) => {
		try {
			res.json(getEncrypedPrivateKey(req.body[KEY_WALLET], decrypt(req.body[KEY_PASSWORD])))
		} catch (err) {
			res.status(409).json({ message: err.message })
		}
	})

	return api
}
