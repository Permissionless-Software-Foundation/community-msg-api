/*
  REST API controller for *Community* messages.
*/

// Local libraries.
const Message = require('../../models/message')
const BCH = require('../../lib/bch')

let _this

class MessagesController {
  constructor () {
    _this = this
    this.Message = Message
    this.bch = new BCH()
  }

  /**
   * @api {get} /messages Get latest community messages
   * @apiPermission messages
   * @apiName GetMessages
   * @apiGroup Messages
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5000/messages
   *
   */
  async getMessages (ctx) {
    try {
      const blockHeightNow = await _this.bch.getBlockHeight()
      const limit = blockHeightNow - 3000

      let messages = await _this.Message.find({ height: { $gte: limit } })
      // console.log(`messages before filtering: ${JSON.stringify(messages, null, 2)}`)

      // Filter out any messages marked 'invalid'
      messages = messages.filter(elem => elem.isValid)
      // console.log(`messages after filtering: ${JSON.stringify(messages, null, 2)}`)

      ctx.body = { messages }
    } catch (error) {
      console.log('error: ', error)
      ctx.throw(404)
    }
  }
}

module.exports = MessagesController
