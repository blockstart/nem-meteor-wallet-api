import { NEMLibrary, NetworkTypes } from 'meteor-nem-library'

export const initNEMLibrary = (networkType: NetworkTypes) => {
	NEMLibrary.reset()
	NEMLibrary.bootstrap(networkType)
}

