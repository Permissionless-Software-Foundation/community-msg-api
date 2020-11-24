// Local libraries.
const Name = require('../../models/name')
const BCH = require('../../lib/bch')
const wlogger = require('../../lib/wlogger')

let _this

class NamesController {
  constructor () {
    _this = this
    this.Name = Name
    this.bch = new BCH()
  }

  /**
   * @api {get} /names/:bchAddr Get Memo Name associated with an address.
   * @apiPermission names
   * @apiName GetName
   * @apiGroup Names
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5002/names/<bchAddr>
   *
   */
  async getName (ctx) {
    try {
      const bchAddr = ctx.params.bchAddr

      // Retrieve the name from the database.
      const message = await _this.Name.find({ bchAddr })

      let name

      // If the name does not exist, scan the transaction history of the
      // address for an OP_RETURN that sets the handle.
      if (message.length) {
        name = message[0].name
      } else {
        name = await _this.bch.findName(bchAddr)

        if (name) {
          // Stores the name found in the database
          const nameModel = new _this.Name({ name, bchAddr })
          await nameModel.save()
        }
      }

      ctx.body = { name }
    } catch (error) {
      wlogger.error('Error in src/modules/names/controller/getName():', error)
      ctx.throw(404)
    }
  }
}

module.exports = NamesController
