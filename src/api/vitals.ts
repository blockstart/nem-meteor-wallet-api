import { Router } from 'express'

export const vitals = () => {
	const api: Router = Router()

	api.get('/heartbeat', async (req: any, res: any) => {
		res.json({status: 'ok'})
	})

	return api
}