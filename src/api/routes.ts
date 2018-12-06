import { account } from './account'
import { network } from './network'
import { transaction } from './transaction'
import { vitals } from './vitals'
import { wallet } from './wallet'

const responseMiddleware = (req: any, res: any, next: any) => {
	res.set('Content-Type', 'application/json')
	next()
}

export const routes = (router: any) => {
	router.use('/vitals', responseMiddleware, vitals())
	router.use('/account', responseMiddleware, account())
	router.use('/transaction', responseMiddleware, transaction())
	router.use('/wallet', responseMiddleware, wallet())
	router.use('/network', responseMiddleware, network())

	return router
}
