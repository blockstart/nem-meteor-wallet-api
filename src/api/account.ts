import { MosaicTransferable } from 'meteor-nem-library'
import { Router } from 'express'
import { vAddress } from '../middleware/validators'
import { MAddress } from '../models/address'
import { AccountJSON } from '../models/account'
import { MosaicJSON } from '../models/mosaic'

export const account = () => {
	const api: Router = Router()

	api.get('/:address', async (req: any, res: any) => {
		try {
			const address = new MAddress(req.params.address)
			const mt: Array<MosaicTransferable> = await address.mosaics()
			const mosaics: Array<MosaicJSON> = mt.map((mosaic) => {
				return {
					mosaicId: mosaic.mosaicId,
					properties: mosaic.properties,
					levy: mosaic.levy,
					quantity: Math.round(mosaic.quantity)
				}
			})
			const account: AccountJSON = { mosaics: mosaics }
			res.send(account)
		} catch (err) {
			res.status(409).json({ message: err.message })
		}
	})

	api.get('/format/:address', vAddress, (req: any, res: any) => {
		try {
			const address = new MAddress(req.params.address)
			res.send({pretty: address.pretty(), plain: address.plain()})
		} catch (err) {
			res.status(409).json({message: err.message})
		}
	})

	return api
}
