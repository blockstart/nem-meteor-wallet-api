import CryptoJS = require('crypto-js')
import { WordArray } from 'crypto-js'

/**
 * Since mobile apps transmit data via REST to the internal API
 * it is possible for other devices on the same network to
 * sniff the data and read it.  Therefore we encrypt data transmissions.
 * Change these keys for your own project. Keys here should match
 * the keys you enter in the client apps
 */
const key = CryptoJS.enc.Utf8.parse('<enter unique key here>')
const iv = CryptoJS.enc.Utf8.parse('<enter unique key here>')

export const  encrypt = (digest: string) => {
	return CryptoJS.AES.encrypt(digest, key, { iv: iv , mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).ciphertext.toString()
}

export const  decrypt = (ciphertext: string) => {
	ciphertext = CryptoJS.enc.Hex.parse(String(ciphertext))
	const encryptedMessage: WordArray = {
		ciphertext: ciphertext,
		iv: iv,
		key: key,
		salt: undefined
	}
	return CryptoJS.AES.decrypt(encryptedMessage, key, { iv: iv , mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }).toString(CryptoJS.enc.Utf8)
}
