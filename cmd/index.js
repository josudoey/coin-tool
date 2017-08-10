const path = require('path')
exports = module.exports = (prog) => {
  prog
    .option('--conf <config-path>', 'config file path default: <PWD>/etc/config.json', path.join(process.cwd(), 'etc', 'config.json'))
    .option('--test', 'use testnet')
}

