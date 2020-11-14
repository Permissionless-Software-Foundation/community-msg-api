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
   * @api {get} /messages Get latest messages
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

      const messages = await _this.Message.find({ height: { $gte: limit } })
      ctx.body = { messages }
    } catch (error) {
      console.log('error: ', error)
      ctx.throw(404)
    }
  }
}

module.exports = MessagesController
