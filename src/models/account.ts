import { BSimpleWallet, Password, SimpleWallet } from 'meteor-nem-library'
import { decrypt, encrypt } from '../utilities/crypto-util'
import { MosaicJSON } from './mosaic'

export interface AccountJSON {
	mosaics: Array<MosaicJSON>
}

export interface EncryptedPrivateKey {
	encryptedPrivateKey: string
}

export const getEncrypedPrivateKey = (wallet: SimpleWallet, password: string): EncryptedPrivateKey => {
	const sw = BSimpleWallet.castToSimpleWallet(wallet)
	const account = sw.open(new Password(password))
	return new class implements EncryptedPrivateKey {
		encryptedPrivateKey = encrypt(account.privateKey)
	}
}
