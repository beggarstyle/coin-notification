const moment = require('moment')

module.exports = class Balances {
	constructor(params) {
		this.symbol = params.symbol
		this.total = params.total
		this.available = params.available
		this.opened = params.opened
		this.incoming = params.incoming
		this.withdrawal = params.withdrawal
		this.createdTime = moment().format('DD-MM-YYYY H:m:s')
	}
}