import {
	BAddress, BSimpleWallet, BTransferTransaction, MosaicId,
	MosaicTransferable, NemAnnounceResult, Password,
	PlainMessage, SimpleWallet, TransactionHttp,
	TransferTransaction
} from 'meteor-nem-library'
import { BMosaicTransferable } from 'meteor-nem-library/dist/src/blockstart/models/bMosaicTransferable'
import { BTimeWindow } from 'meteor-nem-library/dist/src/blockstart/models/bTimeWindow'
import { MAddress } from './address'
import { TransactionJSON } from './transaction'

export const createTransferTransaction = (recipient: string, mosaic: MosaicTransferable, message: string): Promise<TransferTransaction> => {
	return new Promise<TransferTransaction>(async (resolve, reject) => {
		try {
			const castedMosaic = BMosaicTransferable.castToMosaicTransferable(mosaic)
			const timeWindow = await BTimeWindow.useNodeToCreateDeadline()
			const transferTransaction = BTransferTransaction.createTX(new BAddress(recipient), castedMosaic, PlainMessage.create(message), timeWindow) as any
			resolve(transferTransaction)
		} catch (err) {
			reject(err)
		}
	})
}

export const sendTransferTransaction = (wallet: SimpleWallet, transferTransaction: TransferTransaction, password: string): Promise<NemAnnounceResult> => {
	return new Promise<NemAnnounceResult>(async (resolve, reject) => {
		try {
			const castedTransferTx = await BTransferTransaction.castToTransferTransaction(transferTransaction)
			const sw = BSimpleWallet.castToSimpleWallet(wallet)
			const account = sw.open(new Password(password))
			const signed = account.signTransaction(castedTransferTx)
			new TransactionHttp().announceTransaction(signed).subscribe((result: NemAnnounceResult) => {
				resolve(result)
			}, (err) => {
				reject(err)
			})
		} catch (err) {
			reject(err)
		}
	})
}

// TODO add unit test
export const findTransactions = (addressValue: string, mosaicId: MosaicId, nextPageId?: number): Promise<TransactionJSON> => {
	return new Promise<TransactionJSON>(async (resolve, reject) => {
		try {
			const address = new MAddress(addressValue)
			const filtered = await address.transactions(nextPageId)
			if (filtered.transactions.length > 0) {
				filtered.transactions = filterTransactions(mosaicId, filtered.transactions)
			}
			resolve(filtered)
		} catch (error) {
			reject(error.message)
		}
	})
}

// TODO add unit test
const filterTransactions = (mosaicId: MosaicId, txs: any): Array<any> => {
	const filterMosaicId = new MosaicId(mosaicId.namespaceId, mosaicId.name)
	const xemMosaicId = new MosaicId('nem', 'xem')
	const trans: Array<any> = []
	txs.map((transferTransaction: any) => {
		if (transferTransaction._mosaics && transferTransaction._mosaics.length > 0) {
			let isEqual = false
			transferTransaction._mosaics.map((mosaic: any) => {
				if (filterMosaicId.namespaceId === mosaic.mosaicId.namespaceId && filterMosaicId.name === mosaic.mosaicId.name) {
					isEqual = true
				}
			})
			if (isEqual) {
				trans.push(transferTransaction)
			}
		} else if (filterMosaicId.namespaceId === xemMosaicId.namespaceId && filterMosaicId.name === xemMosaicId.name) {
			trans.push(transferTransaction)
		}
	})
	return trans
}
