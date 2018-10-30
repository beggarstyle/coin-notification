const axios = require('axios')
const moment = require('moment')
const db = require('../database/db.json')
const coinAsset = db.coinAsset

module.exports.getTickers = () => {
  return new Promise( (resolve, reject) => {
    axios.get('https://api.coinasset.co.th/api/v1/tickers',)
      .then(response => resolve(response.data))
      .catch((error) => console.log('error', error))
  })
}

module.exports.getOrderBook = (symbol) => {
	return new Promise( (resolve, reject) => {
	    axios({
	      method: 'get',
	      url: 'https://api.coinasset.co.th/api/v1/order-books?symbol=' + symbol + '&limit=1',
	    })
	      .then(response => {
	        resolve({
	          bids: { price: response.data.bids[0][0], value: response.data.bids[0][1] },
	          asks: { price: response.data.asks[0][0], value: response.data.asks[0][1] }
	        })
	      })
	      .catch((error) => console.log('error', error))
	})
}

module.exports.getBalances = () => {
  let apiKey = coinAsset.api_key
  let signature = coinAsset.signature

	return new Promise((resolve, reject) => {
		let request = axios({
		  method: 'post',
		  url: 'https://api.coinasset.co.th/api/v1/balances',
		  data: {
		    api_key: apiKey,
		    signature: signature,
		    timestamp: moment().format('X')
		  }
		})
		request.then(response => resolve(response))
	})
}

module.exports.getTrades = () => {
  return new Promise( (resolve, reject) => {
    axios.get('https://api.coinasset.co.th/api/v1/trades?symbol=HPC-THB&limit=2')
      .then(response => resolve(response.data))
  })
}

module.exports.buyOrder = () => {
  return new Promise( (resolve, reject) => {
    // axios({
    //   method: 'post',
    //   url: 'https://api.coinasset.co.th/api/v1/buy-order',
    //   data: {
    //     api_key: '',
    //     signature: '',
    //     timestamp: moment().format('X'),
    //     pair_id: pair_id,
    //     quantity: quantity,
    //     price: price,
    //     note: note
    //   }
    // })
    //   .then(response => resolve(response))
  })
}

module.exports.sellOrder = ({ pair_id, quantity, price, note}) => {
	return new Promise( (resolve, reject) => {
    // axios({
    //   method: 'post',
    //   url: 'https://api.coinasset.co.th/api/v1/sell-order',
    //   data: {
    //     api_key: '',
    //     signature: '',
    //     timestamp: moment().format('X'),
    //     pair_id: pair_id,
    //     quantity: quantity,
    //     price: price,
    //     note: note
    //   }
    // })
    //   .then(response => resolve(response))
  })
}
