const moment = require('moment')

module.exports = class Coin {
	constructor({ symbol, bids, asks }) {
		this.symbol = symbol
		this.bids = bids
		this.asks = asks
		this.time = moment().format('DD-MM-YYYY H:m:s')
	}
}