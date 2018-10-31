#!/usr/bin/env node

const program = require('commander')
const Logical = require('./src/models/Logical.js')
const Fn = require('./src/models/Fn.js')
const path = require('path')

global.appDir = path.resolve(__dirname)

// program
//   .command('lists')
//   .version('1.0.0')
//   .description('Tickers Selected Lists')
//   .option('-e, --exchange [exchange]', 'Set exchange', 'ca')
//   .option('-l, --lists [lists]', 'Set Time for Interval')
//   .action((cmd) => Logical.tickers(cmd))
  // .action((cmd) => {
    // console.log('lists', cmd.lists.split(','))
    // Logical.tickers(cmd)
    // s.split
  // })

program
  .command('tickers')
  .version('1.0.0')
  .description('Return all Markets data')
  .option('-s, --symbol [symbol]', 'Set Coin symbol', Fn.lists)
  .option('-e, --exchange [exchange]', 'Set exchange', 'ca')
  .option('-t, --times <times>', 'Set Time for Interval')
  .action((cmd) => Logical.tickers(cmd))

program
	.command('trades')
	.version('1.0.0')
	.description('Get recent trades')
  .option('-s, --symbol [symbol]', 'Set Coin symbol', 'HPC-THB')
  .option('-e, --exchange [exchange]', 'Set exchange', 'ca')
  .option('-b, --watch-bids [watchBids]', 'Watch Bids use with price', false)
  .option('-a, --watch-asks [watchAsks]', 'Watch asks use with price', false)
  .option('-m, --more-than <moreThan>', 'Set More Then Price Target', Number)
  .option('-l, --less-than <lessThan>', 'Set Less Then Price Target', Number)
  // .option('-p, --price <price>', 'Set Price Target', Number)
  .option('-n, --notification [notification]', 'Set Notification', Boolean, false)
  .option('-t, --times <times>', 'Set Time for Interval')
  .action((cmd) => Logical.trades(cmd))

program
  .command('balances')
  .version('1.0.0')
  .description('Get Balances and store')
  .option('-e, --exchange [exchange]', 'Set exchange', 'ca')
  .option('-l, --local [local]', 'Get balances from localStorage', false)
  .action((cmd) => Logical.balances(cmd))

program
  .command('ip')
  .version('1.0.0')
  .description('Return Public IP')
  .option('-t, --times <times>', 'Set Time for Interval')
  .action((cmd) => {
    if (!cmd.times) return Fn.hasPublicIp()
    setInterval(() => { Fn.hasPublicIp() }, Fn.converterMinutes(cmd.times))
  })

program.parse(process.argv)
