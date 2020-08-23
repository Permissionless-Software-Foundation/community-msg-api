/*
  Library of functions for working with the BCH blockchain.
*/

// Global npm libraries.
const BCHJS = require('@psf/bch-js')

// Local libraries.
const config = require('../../config')

class BCHLib {
  constructor () {
    this.bchjs = new BCHJS()
  }

  // Get transactions for the address tracking the PSF Community feed.
  async getTransactions () {
    try {
      let txs = await this.bchjs.Electrumx.transactions(config.communityAddress)
      txs = txs.transactions

      return txs
    } catch (err) {
      console.error('Error in bch.js/getTransactions()')
      throw err
    }
  }

  // Gets the current block height of the BCH blockchain.
  async getBlockHeight () {
    try {
      const info = await this.bchjs.Blockchain.getBlockchainInfo()
      return info.blocks
    } catch (err) {
      console.error('Error in bch.js/getBlockHeight()')
      throw err
    }
  }
}

module.exports = BCHLib
