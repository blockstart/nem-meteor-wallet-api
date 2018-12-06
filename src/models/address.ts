import {
	AccountHttp,
	BAddress, BTransferTransaction,
	MultisigTransaction,
	Transaction,
	TransactionTypes
} from 'meteor-nem-library'
import { TransactionJSON } from './transaction'

export class MAddress extends BAddress {

	public transactions = (nextPageId?: number) => {
		return new Promise<TransactionJSON>((resolve, reject) => {
			const accountHttp = new AccountHttp()
			const transactions = accountHttp.allTransactionsPaginated(this, {
				pageSize: 100,
				id: nextPageId
			})
			transactions.subscribe((txs: Array<Transaction>) => {
				const json: TransactionJSON = { transactions: txs.map((tx) => {
					if (tx.type === TransactionTypes.TRANSFER) {
						const transferTX = tx as BTransferTransaction
						return this.adjustXemQuantity(transferTX)
					} else if (tx.type === TransactionTypes.MULTISIG && (tx as MultisigTransaction).otherTransaction.type === TransactionTypes.TRANSFER) {
						const transferTX = (tx as MultisigTransaction).otherTransaction as BTransferTransaction
						return this.adjustXemQuantity(transferTX)
					}
				})}
				// TODO take multi-sig types into account
				json.transactions = json.transactions.filter((tx) => tx)
				if (txs.length !== 0) { json.nextPageId = txs[txs.length - 1].getTransactionInfo().id }
				resolve(json)
			}, err => {
				reject(err)
			}, () => {
				resolve({ transactions: []})
			})
		})
	}

	private adjustXemQuantity = (tx: BTransferTransaction): any => {
		const newTx = tx as any
		if (tx.containsMosaics()) {
			newTx._xem.quantity = 1e6
		} else {
			newTx._xem.quantity = tx.xem().quantity
		}
		return newTx
	}
}


