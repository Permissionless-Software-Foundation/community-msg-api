/*
  REST API controller for *Community* messages.
*/

// Local libraries.
const BCH = require('../../lib/bch')

let _this

class MailController {
  constructor () {
    _this = this
    this.bch = new BCH()
  }

  /**
   * @api {get} /mail Get community mails
   * @apiPermission mail
   * @apiName GetMail
   * @apiGroup Mail
   * @apiDescription Returns an array of objects of signal transactions on the
   * BCH blockchain, for the given address. Each object in the array looks like
   * this:
   * {
   *   hash: "<IPFS hash>",
   *   subject: "clear text subject on the blockchain",
   *   sender: "BCH address of the sender",
   *   txid: "TXID of the message signal",
   *   time: JS timestamp
   * }
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5000/mail/:bchAddr
   *
   */
  async getMail (ctx) {
    try {
      const bchAddr = ctx.params.bchAddr

      const numChunks = 0
      const mail = await _this.bch.readMessages(bchAddr, numChunks)

      ctx.body = { mail }
    } catch (err) {
      ctx.throw(404)
    }
  }
}

module.exports = MailController
