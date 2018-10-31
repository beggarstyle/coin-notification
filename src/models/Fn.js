const cTable = require('console.table')

const axios = require('axios')
const Line = require('./Line.js')
const Coin = require('./Coin')
const loadJsonFile = require('load-json-file')
const writeJsonFile = require('write-json-file')

module.exports.getPublicIp = () => {
	return new Promise((resolve, reject) => {
		axios.get('http://checkip.dyndns.org')
			.then(response => resolve(response.data.replace(/[^0-9\.]/g, '')))
			.catch((error) => console.log('error', error))
	})
}

module.exports.hasPublicIp = (cmd) => {
  let publicIp = new Promise( (resolve, reject) => {
		resolve(this.getPublicIp())
  })

  let localPublicIp = this.loadDatabase()

  Promise.all([publicIp, localPublicIp])
    .then((response) => {
      let publicIp = response[0].trim()
      let db = response[1]

      if (publicIp === db.publicIp) return Promise.resolve(false)
      return new Promise((resolve, reject) => resolve({ publicIp, db }))
    })
    .then(async response => {
      if (!response) return Promise.resolve(false)

      response.db.publicIp = response.publicIp

      Line.notification(`Your Public Ip is change: ${response.publicIp}`)

      await this.writeDatabase(response.db)
    })
}

module.exports.initCoinTable = async (cmd, res) => {
  let assetCoin = Object.values(res)

  if (!cmd.symbol) { return console.table(assetCoin) }

	let loopCoin = new Promise(async (resolve, reject) => {
    let tablesCoin = []
		await assetCoin.map(async (coin) => {
			await cmd.symbol.filter((symbol) => {
				if (symbol.trim() === coin.symbol) tablesCoin.push(coin)
			})
		})
		resolve(tablesCoin)
	})

	loopCoin.then(res => console.table(res))
}

module.exports.orderBookManagement = (cmd, res) => {
	let label = []
	let modelsCoin = new Coin({
		symbol: cmd.symbol,
		bids: res.bids.price,
		asks: res.asks.price
	})

	console.table([modelsCoin])

	let condition = isMoreThanOrLessThan(cmd)
	if (cmd.watchBids && isPriceMoreThan(cmd, res.bids.price)) {
		label.push(`Bids ${res.bids.price} ${condition} ${cmd[condition]}`)
	}

  if (cmd.watchAsks && isPriceMoreThan(cmd, res.asks.price)) {
		label.push(`Asks ${res.asks.price} ${condition} ${cmd[condition]}`)
  }

	// if (cmd.watchBids && cmd.moreThan && (res.bids.price >= cmd.moreThan)) {
	// 	label.push(`Bids ${res.bids.price}`)
	// }

	// if (cmd.watchBids && cmd.lessThan && (res.bids.price <= cmd.lessThan)) {
  //   label.push(`Bids ${res.bids.price}`)
  // }

  // if (cmd.watchAsks && cmd.moreThan && (res.asks.price >= cmd.moreThan)) {
  //   label.push(`Asks ${res.asks.price}`)
  // }

  // if (cmd.watchAsks && cmd.lessThan && (res.bids.price <= cmd.lessThan)) {
  //   label.push(`Asks ${res.asks.price}`)
  // }

	if (!cmd.notification) return false

	if (!label.length) return false
	Line.notification(label.join(' '))
}

module.exports.storeBalances = async (cmd, res) => {
	let assetCoin = res
	let initBalances = new Promise(async (resolve, reject) => {
		let storeBalances = []

		await Object.keys(assetCoin).forEach((symbol) => {
			storeBalances.push({
				symbol: symbol,
				total: assetCoin[symbol].total,
				available: assetCoin[symbol].available,
				opened: assetCoin[symbol].opened,
				incoming: assetCoin[symbol].incoming,
				withdrawal: assetCoin[symbol].withdrawal
			})
		})

		resolve(storeBalances)
	})

	return initBalances
		.then(response => {
			return new Promise(async (resolve, reject) => {
				await this.loadDatabase()
					.then(db => resolve({ balances: response, db }))
			})
		})
		.then(async (response) => {
			response.db.balances = response.balances
			return new Promise(async (resolve, reject) => {
				await this.writeDatabase(response.db)
			})
		})
}

// ----------------------------------------------------------- Function --------

// module.exports.getPercentGrow = (price) => {
// 	return parseFloat((price - initHpcPrice) / initHpcPrice * 100).toFixed(2) + "%"
// }

module.exports.loadDatabase = async () => {
	return await new Promise((resolve, reject) => {
		loadJsonFile('./src/database/db.json')
			.then(json => resolve(json))
	})
}

module.exports.writeDatabase = async (json) => {
	return await new Promise((resolve, reject) => {
		writeJsonFile('./src/database/db.json', json)
	})
}

module.exports.lists = (symbol) => { return symbol.split(',') }

module.exports.converterMinutes = (minutes) => {
	return (minutes * 60) * 1000
}

const isMoreThanOrLessThan = (cmd) => {
	return (!! cmd.moreThan) ? 'moreThan' : 'lessThan'
}
const isPriceMoreThan = (cmd, price) => {
	let condition = isMoreThanOrLessThan(cmd)
	if (condition === 'moreThan') return price >= cmd['moreThan']

	return price <= cmd['lessThan']
}