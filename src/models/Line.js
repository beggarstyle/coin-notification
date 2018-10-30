const axios = require('axios')
const qs = require('qs')
const Fn = require('./Fn.js')

module.exports.notification = async (target, message) => {
	let data = { message: message }

	const db = await Fn.loadDatabase()

	axios({
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Authorization': `Bearer ${db.lineToken[target.trim()]}`
		},
		method: 'post',
		url: 'https://notify-api.line.me/api/notify',
		data: qs.stringify(data)
	})
		.catch(error => console.log('error', error))
}

// sendNotificationLine('HPC { bids: ' + response.bids.price + ' asks: ' + response.asks.price + ' }')