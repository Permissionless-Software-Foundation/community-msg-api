// Global npm libraries.
const mongoose = require('mongoose')

// Local libraries
// const config = require('../../config')

const Message = new mongoose.Schema({
  txid: { type: String, default: '', required: true },
  text: { type: String, default: '' },
  sender: { type: String, default: '' },
  tokenBalance: { type: Number, default: 0 },
  tokenAge: { type: Number, default: 1 },
  merit: { type: Number, default: 0 },
  height: { type: Number, default: 0 },
  timestamp: { type: String, default: '' }
})

module.exports = mongoose.model('message', Message)
