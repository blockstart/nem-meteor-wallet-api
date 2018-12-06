import { NetworkTypes } from 'meteor-nem-library'
import { Router } from 'express'
import { initNEMLibrary } from '../services/network-services'

export const network = () => {
	const api: Router = Router()

	api.get('/switch/:networkType', async (req: any, res: any) => {
		if (req.params.networkType === 'MAIN_NET') {
			req.params.networkType = NetworkTypes.MAIN_NET
		} else if (req.params.networkType === 'MIJIN_NET') {
			req.params.networkType = NetworkTypes.MIJIN_NET
		} else {
			req.params.networkType = NetworkTypes.TEST_NET
		}
		initNEMLibrary(req.params.networkType)
		res.json({status: 'Connected to ' + req.params.networkType})
	})

	return api
}