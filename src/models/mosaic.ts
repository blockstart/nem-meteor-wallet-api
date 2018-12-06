import { MosaicId, MosaicLevy, MosaicProperties } from 'meteor-nem-library'

export interface MosaicJSON {
	mosaicId: MosaicId
	properties: MosaicProperties
	levy: MosaicLevy
	quantity: number
}