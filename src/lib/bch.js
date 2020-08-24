/*
  Library of functions for working with the BCH blockchain.
*/

// Global npm libraries.
const BCHJS = require('@psf/bch-js')

// Local libraries.
const config = require('../../config')
const Message = require('../models/message')

class BCHLib {
  constructor () {
    this.bchjs = new BCHJS()
    this.Message = Message
  }

  // This function is called by a timer in the bin/server.js file.
  // It checks the blockchain to see if there are any new messages to load into
  // the database.
  async checkMessages () {
    try {
      // const newTxs = []

      const { txs, blockHeightNow } = await this.getTransactions()
      console.log('txs: ', txs)

      // Loop through each txid.
      for (let i = 0; i < txs.length; i++) {
        const thisTx = txs[i]

        const msgExists = await this.Message.find({ txid: thisTx.tx_hash })
        console.log('msgExists: ', msgExists)

        // Skip if the tx was found in the database.
        if (msgExists.length !== 0) continue

        // Pass the block height along.
        thisTx.blockHeightNow = blockHeightNow

        // Create a message object.
        const msgObj = await this.getMessageObj(thisTx)
        console.log(`msgObj: ${JSON.stringify(msgObj, null, 2)}`)

        // Add the message object to the database.
        const newMsg = new this.Message(msgObj)
        await newMsg.save()
      }
    } catch (err) {
      console.error('Error in checkMessages(): ', err)
    }
  }

  // Decode a message on the blockchain and construct a 'message object', which
  // can be inserted into the database.
  async getMessageObj (tx) {
    try {
      const txid = tx.tx_hash

      // Get the raw transaction data.
      const txData = await this.bchjs.RawTransactions.getRawTransaction(
        txid,
        true
      )

      // Get the Script of the first output.
      const script = this.bchjs.Script.toASM(
        Buffer.from(txData.vout[0].scriptPubKey.hex, 'hex')
      ).split(' ')

      // Ensure the first output is an OP_RETURN.
      if (script[0] !== 'OP_RETURN') {
        console.log(`txid ${txid} not an OP_RETURN. Skipping.`)
        return false
      }

      // Get the code to determine what kind of memo.cash command is being used.
      const memoCode = Buffer.from(script[1], 'hex').toString('hex')

      // The memo code should match that for sending money & messages.
      if (memoCode !== '6d24') {
        console.log('Memo code did not match 6d24!')
        return false
      }

      // Get the message.
      const msg = Buffer.from(script[3], 'hex').toString('ascii')
      // const addr = Buffer.from(script[2], 'hex').toString('hex')

      // Get the sender.
      const sender = await this.getSender(txData)
      // console.log(`Raw TX Data: ${JSON.stringify(txData, null, 2)}`)

      const { tokenBalance, tokenAge } = await this.getTokenInfo(sender)

      // Record or estimate the block height of this transaction.
      let height = tx.blockHeightNow + 1
      if (tx.height !== 0) { height = tx.height }

      // Generate an ISO timestamp.
      const now = new Date()

      const outObj = {
        txid,
        text: msg,
        sender,
        tokenBalance,
        tokenAge,
        merit: tokenBalance * tokenAge,
        height,
        timestamp: now.toISOString()
      }

      // console.log(`outObj: ${JSON.stringify(outObj, null, 2)}`)

      return outObj
    } catch (err) {
      console.error('Error in getMessageObj()')
      throw err
    }
  }

  // Retrieve the quantity of PSF tokens and token age held by the address.
  async getTokenInfo (sender) {
    try {
      let tokenBalance = 0
      const tokenAge = 1 // Hard coded until I come up with a better
      // const tokenUtxos = []

      // Get tokens held by this address.
      let tokens = await this.bchjs.SLP.Utils.balancesForAddress(sender)

      // Filter out the PSF token.
      tokens = tokens.filter(x => x.tokenId === config.tokenId)
      // console.log(`tokens: ${JSON.stringify(tokens, null, 2)}`)

      if (tokens[0].balance) {
        tokenBalance = tokens[0].balance
      }

      return { tokenBalance, tokenAge }
    } catch (err) {
      console.error('Error in getTokenInfo()')
      throw err
    }
  }

  // Get the BCH address of the sender of the message.
  async getSender (txData) {
    try {
      const vinTxid = txData.vin[0].txid
      const origVout = txData.vin[0].vout

      const origTx = await this.bchjs.RawTransactions.getRawTransaction(
        vinTxid,
        true
      )

      const sender = origTx.vout[origVout].scriptPubKey.addresses[0]

      return sender
    } catch (err) {
      console.error('Error in getSender()')
      throw err
    }
  }

  // Get transactions for the address tracking the PSF Community feed.
  // Returns an array of txids (with block height) for any TXS that associated
  // with the address in the last 50 blocks.
  async getTransactions () {
    try {
      const blockHeightNow = await this.getBlockHeight()

      let txs = await this.bchjs.Electrumx.transactions(config.communityAddress)
      txs = txs.transactions

      const unconfirmedTxs = txs.filter(x => x.height === 0)
      const confirmedTxs = txs.filter(x => x.height > blockHeightNow - 50)

      txs = confirmedTxs.concat(unconfirmedTxs)

      return { txs, blockHeightNow }
    } catch (err) {
      console.error('Error in bch.js/getTransactions()')
      throw err
    }
  }

  // Gets the current block height of the BCH mainnet blockchain.
  async getBlockHeight () {
    try {
      const info = await this.bchjs.Blockchain.getBlockchainInfo()
      // console.log(`info: ${JSON.stringify(info, null, 2)}`)

      return info.blocks
    } catch (err) {
      console.error('Error in bch.js/getBlockHeight()')
      throw err
    }
  }
}

module.exports = BCHLib
