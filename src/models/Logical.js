const CoinAsset = require('./CoinAsset.js')
const Fn = require('./Fn.js')

module.exports.tickers = (cmd) => {
  if (cmd.exchange === 'ca') coinExchange = CoinAsset.getTickers()

  if (!cmd.times) {
   return coinExchange
    .then(response => Fn.initCoinTable(cmd, response))
    .catch(error => console.log('Tickers Error:', error))
  }

  setInterval(() => {
    coinExchange
      .then(response => Fn.initCoinTable(cmd, response))
      .catch(error => console.log('Tickers Error:', error))
  }, Fn.converterMinutes(cmd.times))
}

module.exports.trades = (cmd) => {
  if (cmd.exchange === 'ca') coinExchange = CoinAsset.getOrderBook(cmd.symbol)

  if (!cmd.times) return coinExchange.then(res => Fn.orderBookManagement(cmd, res))

  setInterval(() => {
    coinExchange
      .then(response => Fn.orderBookManagement(cmd, response))
      .catch(error => console.log('Trades Error:', error))
  }, Fn.converterMinutes(cmd.times))
}

module.exports.balances = (cmd) => {
  if (cmd.exchange === 'ca') coinExchange = CoinAsset.getBalances()

  if (cmd.local) {
    return Fn.loadDatabase()
      .then(dbFile => console.table(dbFile.balances))
  }
		coinExchange
			.then(response => Fn.storeBalances(cmd, response.data))
			.catch(error => console.log('Trades Error:', error))
}