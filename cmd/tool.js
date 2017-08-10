const prog = require('commander')
const path = require('path')
const fs = require('fs')
const bip39 = require('bip39')
const bitcoin = require('bitcoinjs-lib')
const crypto = require('crypto')

module.exports = function (prog) {
  const getNetwork = function () {
    const name = (prog.test) ? 'testnet' : 'bitcoin'
    return bitcoin.networks[name]
  }

  prog
    .command('seed [mnemonic]')
    .description('use bip39 mnemonic code to seed code')
    .action(function (mnemonic, opts) {
      if (!mnemonic) {
        const rnd = crypto.randomBytes(32).toString('hex')
        console.log(rnd)
        return
      }
      const seed = bip39.mnemonicToSeedHex(mnemonic).toString('hex')
      console.log(seed)
    })

  prog
    .command('mnemonic [seed]')
    .description('use bip39 mnemonic code to seed code')
    .action(function (seed, opts) {
      if (!seed) {
        const mnemonic = bip39.generateMnemonic()
        console.log(mnemonic)
        return
      }
      const mnemonic = bip39.entropyToMnemonic(seed)
      console.log(mnemonic)
    })

  prog
    .command('bip32 [mnemonic]')
    .description('use bip32 generate hdnode key')
    .action(function (mnemonic, opts) {
      if (!mnemonic) {
        mnemonic = bip39.generateMnemonic()
      }
      const seed = bip39.mnemonicToSeedHex(mnemonic).toString('hex')
      const node = bitcoin.HDNode.fromSeedHex(seed, getNetwork())
      console.log(node.toBase58())
    })

  prog
    .command('neutered <bip32-key>')
    .description('remove private key for bip32')
    .action(function (key, opts) {
      const node = bitcoin.HDNode.fromBase58(key, getNetwork())
      console.log(node.neutered().toBase58())
    })

  prog
    .command('wif <bip32-key>')
    .description('convert bip32 key to WIF key')
    .action(function (key, opts) {
      const node = bitcoin.HDNode.fromBase58(key, getNetwork())
      console.log(node.keyPair.toWIF())
    })

  prog
    .command('show <bip32-key>')
    .description('show key information')
    .action(function (key, opts) {
      const node = bitcoin.HDNode.fromBase58(key, getNetwork())
      console.log('chainCode', node.chainCode.toString('hex'))
      console.log('depth', node.depth)
      console.log('index', node.index)
    })

  prog
    .command('derive <bip32-key> <path>')
    .description('derive key')
    .action(function (key, dPath, opts) {
      const node = bitcoin.HDNode.fromBase58(key, getNetwork())
      const newNode = node.derivePath(dPath)
      console.log(newNode.toBase58())
    })

  prog
    .command('p2pkh <bip32-key>')
    .description('show p2pkh address')
    .action(function (key, opts) {
      const node = bitcoin.HDNode.fromBase58(key, getNetwork())
      console.log(node.getAddress())
    })

  prog
    .command('p2sh <m> <bip32-key...>')
    .description('show p2sh address')
    .action(function (mStr, keys, opts) {
      const m = parseInt(mStr)
      if (isNaN(m)) {
        console.log('<m> require interger')
        return
      }
      const pks = keys.map(function (key) {
        const node = bitcoin.HDNode.fromBase58(key, getNetwork())
        return node.getPublicKeyBuffer()
      })
      const redeemScript = bitcoin.script.multisig.output.encode(m, pks)
      const scriptPubKey = bitcoin.script.scriptHash.output.encode(bitcoin.crypto.hash160(redeemScript))
      const address = bitcoin.address.fromOutputScript(scriptPubKey, getNetwork())
      console.log(address)
    })
}

