/*
  Library of functions for working with the BCH blockchain.
*/

// Global npm libraries.
const BCHJS = require('@psf/bch-js')

// Local libraries.
const config = require('../../config')
const Message = require('../models/message')
const MessagesLib = require('bch-message-lib')

const axios = require('axios').default
const LOCALHOST = `http://localhost:${config.port}`

class BCHLib {
  constructor () {
    this.bchjs = new BCHJS({ restURL: 'https://free-main.fullstack.cash/v3/' })
    this.Message = Message
    this.messagesLib = new MessagesLib({ bchjs: this.bchjs })
    this.axios = axios
  }

  // This function is called by a timer in the bin/server.js file.
  // It checks the blockchain to see if there are any new community messages to
  // load into the database.
  async checkMessages () {
    try {
      // const newTxs = []

      const { txs, blockHeightNow } = await this.getTransactions()
      console.log('txs: ', txs)

      // Loop through each txid.
      for (let i = 0; i < txs.length; i++) {
        const thisTx = txs[i]

        const msgExists = await this.Message.find({ txid: thisTx.tx_hash })
        // console.log('msgExists: ', msgExists)

        // Skip if the tx was found in the database.
        if (msgExists.length !== 0) {
          // console.log(
          //   `Message with this txid already exists in the database: ${
          //     thisTx.tx_hash
          //   }`
          // )
          continue
        }

        // Pass the block height along.
        thisTx.blockHeightNow = blockHeightNow

        // Create a message object.
        const msgObj = await this.getMessageObj(thisTx)
        // console.log(`msgObj: ${JSON.stringify(msgObj, null, 2)}`)

        if (!msgObj) {
          console.log('Invalid message detected. Skipping.')
          continue
        }

        // Add the message object to the database.
        const newMsg = new this.Message(msgObj)
        await newMsg.save()

        console.log(`Added new message ${msgObj.txid}`)
      }
    } catch (err) {
      console.error('Error in checkMessages(): ', err)
    }
  }

  // Decode a message on the blockchain and construct a 'message object', which
  // can be inserted into the database. This cache's the transaction data, which
  // cuts down on REST API calls to FullStack.cash.
  async getMessageObj (tx) {
    try {
      const txid = tx.tx_hash
      console.log(`Processing TXID ${txid}`)

      // Get the raw transaction data.
      const txData = await this.bchjs.RawTransactions.getRawTransaction(
        txid,
        true
      )

      // Get the Script of the first output.
      const scriptData = this.bchjs.Script.toASM(
        Buffer.from(txData.vout[0].scriptPubKey.hex, 'hex')
      )

      const script = scriptData.split(' ')

      // Ensure the first output is an OP_RETURN.
      if (script[0] !== 'OP_RETURN') {
        console.log(`txid ${txid} not an OP_RETURN. Skipping.`)

        return {
          txid,
          isValid: false
        }
        // return false
      }

      // Get the code to determine what kind of memo.cash command is being used.
      const memoCode = Buffer.from(script[1], 'hex').toString('hex')

      // The memo code should match that for sending money & messages.
      // https://memo.cash/protocol
      // 6d02 is a post from the PSF community feed account.
      // 6d24 is someone sending money to PSF community feed.
      if (memoCode !== '6d24' && memoCode !== '6d02') {
        console.log('Memo code did not match 6d24 or 6d02.')
        // console.log(`txData: ${JSON.stringify(txData, null, 2)}`)
        // console.log(`memoCode: ${JSON.stringify(memoCode, null, 2)}`)

        // Return an invalid msg object, so the data is saved and this TXID
        // is not processed in the future.
        return {
          txid,
          isValid: false
        }

        // return false
      }

      // Get the message.
      let msg = ''
      if (memoCode === '6d24') {
        msg = Buffer.from(script[3], 'hex').toString('ascii')
      }
      if (memoCode === '6d02') {
        msg = Buffer.from(script[2], 'hex').toString('ascii')
      }
      // const addr = Buffer.from(script[2], 'hex').toString('hex')

      // Get the sender address.
      const addr = await this.getSender(txData)

      // Get the sender name.
      const senderName = await this.getName(addr)

      const sender = senderName || addr

      // console.log(`Raw TX Data: ${JSON.stringify(txData, null, 2)}`)

      let tokenBalance = 0
      let tokenAge = 0
      let merit = 0

      if (memoCode === '6d24') {
        try {
          const obj = await this.getPSFTokenInfo(addr)

          tokenBalance = obj.tokenBalance
          tokenAge = obj.tokenAge
          merit = obj.merit
        } catch (err) {
          // Will throw an error if the address no longer has any UTXOs.
          tokenBalance = 0
          tokenAge = 0
          merit = 0
        }
      }

      // Record or estimate the block height of this transaction.
      let height = tx.blockHeightNow + 1
      if (tx.height !== 0) {
        height = tx.height
      }

      // Generate an ISO timestamp.
      const now = new Date()

      const outObj = {
        txid,
        isValid: true,
        text: msg,
        sender,
        tokenBalance,
        tokenAge,
        merit,
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

  // Scan transaction history looking for an associated name
  async findName (bchAddr) {
    try {
      // Validate Input
      if (!bchAddr || typeof bchAddr !== 'string') {
        throw new Error('bchAddr must be a string of a BCH address.')
      }

      const name = await this.messagesLib.memo.findName(bchAddr, 5)
      return name
    } catch (err) {
      console.error('Error in bch.js/findName()')
      throw err
    }
  }

  // Scan transactions for the input bchAddr for messages that comply with the
  // PS001 specification for message sharing on the BCH blockchain. This
  // function returns an array of objects containing this information:
  // {
  //    hash: "<IPFS hash>",
  //    subject: "clear text subject on the blockchain",
  //    sender: "BCH address of the sender",
  //    txid: "TXID of the message signal",
  //    time: "timestamp"
  // }
  async readMessages (bchAddr, numChunks = 1) {
    try {
      // Validate Input
      if (!bchAddr || typeof bchAddr !== 'string') {
        throw new Error('bchAddr must be a string of a BCH address.')
      }
      if (typeof numChunks !== 'number') {
        throw new Error('numChunks must be a number.')
      }
      // The second parameter is 'preface', passing undefined
      // takes the default value assigned by the library
      const messages = await this.messagesLib.memo.readMsgSignal(
        bchAddr,
        undefined,
        numChunks
      )
      return messages
    } catch (error) {
      console.error('Error in bch.js/readMessages()')
      throw error
    }
  }

  // Gets an associated name to the bch address if this exists
  async getName (bchAddr) {
    try {
      const options = {
        method: 'GET',
        url: `${LOCALHOST}/names/${bchAddr}`
      }

      const result = await this.axios.request(options)
      let name = result.data.name

      if (result.data.name === 'notAvailable') {
        name = false
      }

      return name
    } catch (err) {
      return false
    }
  }

  async getPSFTokenInfo (bchAddr) {
    try {
      if (!bchAddr || typeof bchAddr !== 'string') {
        throw new Error('bchAddr must be a string of a BCH address.')
      }
      // Get tokens utxos
      const hydrateUtxos = await this.messagesLib.merit.getTokenUtxos(bchAddr)
      if (!hydrateUtxos.length) {
        throw new Error('No utxos avialable!')
      }
      // Calculate Merit
      const meritArr = await this.messagesLib.merit.calcMerit(hydrateUtxos)

      // Filter psf token
      const psfTokenUtxos = meritArr.filter(x => x.tokenId === config.tokenId)

      const merit = psfTokenUtxos[0].merit
      const tokenAge = psfTokenUtxos[0].age
      const tokenBalance = psfTokenUtxos[0].tokenQty
      // const tokenBalance = await this.messagesLib.merit.bchUtil.util.round2(balance)
      return { merit, tokenAge, tokenBalance }
    } catch (error) {
      console.error('Error in bch.js/getPSFTokenInfo()')
      throw error
    }
  }
}

module.exports = BCHLib
