const mongoose = require('mongoose')

const config = require('../../config')

const Message = require('../../src/models/message')

async function getMessages () {
  // Connect to the Mongo Database.
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true) // Stop deprecation warning.
  await mongoose.connect(config.database, { useNewUrlParser: true })

  const messages = await Message.find({})
  console.log(`messages: ${JSON.stringify(messages, null, 2)}`)

  mongoose.connection.close()
}
getMessages()
