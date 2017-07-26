const prog = require('commander')
const path = require('path')
const fs = require('fs')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')

module.exports = function (prog) {
  prog
    .command('seed <mnemonic>')
    .description('use bip39 mnemonic code to seed code')
    .action(function (mnemonic, opts) {
      const seed = bip39.mnemonicToSeedHex(mnemonic).toString('hex')
      console.log(seed)
    })

  prog
    .command('seed2key <seed-hex>')
    .description('use bip32 generate hdnode key')
    .action(function (hex, opts) {
      var node = bitcoin.HDNode.fromSeedHex(hex)
      console.log(node.toBase58())
    })

  prog
    .command('neutered <bip32-key>')
    .description('remove private key for bip32')
    .action(function (key, opts) {
      var node = bitcoin.HDNode.fromBase58(key)
      console.log(node.neutered().toBase58())
    })

  prog
    .command('wif <bip32-key>')
    .description('convert bip32 key to WIF key')
    .action(function (key, opts) {
      var node = bitcoin.HDNode.fromBase58(key)
      console.log(node.keyPair.toWIF())
    })

  prog
    .command('show <bip32-key>')
    .description('show key information')
    .action(function (key, opts) {
      var node = bitcoin.HDNode.fromBase58(key)
      console.log('chainCode', node.chainCode.toString('hex'))
      console.log('depth', node.depth)
      console.log('index', node.index)
    })
}

