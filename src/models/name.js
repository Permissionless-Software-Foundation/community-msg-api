// Global npm libraries.
const mongoose = require('mongoose')

// Local libraries
// const config = require('../../config')

const Name = new mongoose.Schema({
  bchAddr: { type: String, default: '', required: true },
  slpAddr: { type: String, default: '' },
  name: { type: String, default: '' },
  timestamp: { type: String, required: true }
})

module.exports = mongoose.model('name', Name)
