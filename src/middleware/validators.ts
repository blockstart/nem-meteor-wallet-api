import { check, validationResult } from 'express-validator/check'

export const KEY_ADDRESS = 'address'
export const KEY_WALLET_NAME = 'name'
export const KEY_PRIVATE_KEY = 'privateKey'
export const KEY_PASSWORD = 'password'
export const KEY_QRSTRING = 'qrstring'
export const KEY_NETWORK = 'network'
export const KEY_CREATION_DATE = 'creationDate'
export const KEY_ENCRYPTED_PRIVATE_KEY = 'encryptedPrivateKey'
export const KEY_TX_MESSAGE = 'message'
export const KEY_MESSAGE_PAYLOAD = 'payload'
export const KEY_WALLET = 'wallet'
export const KEY_MOSAIC = 'mosaic'
export const KEY_MOSAIC_ID = 'mosaicId'
export const KEY_NEXT_PAGE_ID = 'nextPageId'
export const KEY_TRANSFER_TRANSACTION = 'transferTransaction'
export const KEY_QROBJECT_DATA = 'data'
export const KEY_PWD_LENGTH = 8
export const KEY_ADDRESS_LENGTH = 40
export const KEY_PRIVATE_LENGTH = 64

export const errorHandler = (req: any, res: any, next: any) => {
	const errors = validationResult(req)
	if (!errors.isEmpty()) {
		res.status(409).json({message: errors.array()[0].msg})
	} else {
		next()
	}
}

export const vAddress = [
	check(KEY_ADDRESS)
		.exists()
		.trim()
		.isLength({min: KEY_ADDRESS_LENGTH}),
	errorHandler
]
export const vWallet = [
	check(KEY_ADDRESS)
		.exists()
		.trim()
		.isLength({min: KEY_ADDRESS_LENGTH}),
	check(KEY_NETWORK)
		.exists()
		.trim(),
	check(KEY_CREATION_DATE)
		.exists()
		.trim(),
	check(KEY_ENCRYPTED_PRIVATE_KEY)
		.exists()
		.trim(),
	errorHandler
]

export const vExportWallet = [
	check(KEY_ADDRESS)
		.exists()
		.trim(),
	check(KEY_NETWORK)
		.exists()
		.trim(),
	check(KEY_CREATION_DATE)
		.exists()
		.trim(),
	check(KEY_ENCRYPTED_PRIVATE_KEY)
		.exists()
		.trim(),
	errorHandler
]

export const vFilterTransaction = [
	check(KEY_ADDRESS)
		.exists()
		.trim()
		.isLength({min: KEY_ADDRESS_LENGTH}),
	check(KEY_MOSAIC_ID)
		.exists(),
	errorHandler
]

export const vCreateTransferTransaction = [
	check(KEY_ADDRESS)
		.exists()
		.trim()
		.isLength({min: KEY_ADDRESS_LENGTH}),
	check(KEY_MOSAIC)
		.exists(),
	check(KEY_TX_MESSAGE)
		.exists()
		.trim(),
	errorHandler
]


export const vDecodeMessage = [
	check(KEY_MESSAGE_PAYLOAD)
		.exists(),
	errorHandler
]

export const vSignTransferTransaction = [
	check(KEY_WALLET)
		.exists(),
	check(KEY_TRANSFER_TRANSACTION)
		.exists(),
	check(KEY_PASSWORD)
		.exists()
		.trim()
		.isLength({min: KEY_PWD_LENGTH}),
	errorHandler
]

export const vEncryptedPrivateKey = [
	check(KEY_WALLET)
		.exists(),
	check(KEY_PASSWORD)
		.exists()
		.trim()
		.isLength({min: KEY_PWD_LENGTH}),
	errorHandler
]

export const vQRString = [
	check(KEY_QRSTRING)
		.exists()
		.trim(),
	errorHandler
]

export const vQRObject = [
	check(KEY_PASSWORD)
		.exists()
		.trim(),
	check(KEY_QROBJECT_DATA)
		.exists(),
	errorHandler
]

export const vWalletName = [
	check(KEY_WALLET_NAME)
		.exists()
		.trim()
		.isAlphanumeric()
		.isLength({min: 1}),
	errorHandler
]

export const vPassword = [
	check(KEY_PASSWORD)
		.trim()
		.isLength({min: KEY_PWD_LENGTH}),
	errorHandler
]

