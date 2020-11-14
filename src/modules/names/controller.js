// Local libraries.
const Name = require('../../models/name')
const BCH = require('../../lib/bch')

// let _this

class NamesController {
  constructor () {
    // _this = this
    this.Message = Name
    this.bch = new BCH()
  }

  /**
   * @api {get} /names/:bchAddr Get Memo handle associated with an address.
   * @apiPermission names
   * @apiName GetName
   * @apiGroup Names
   *
   * @apiExample Example usage:
   * curl -H "Content-Type: application/json" -X GET localhost:5000/names/<bchAddr>
   *
   */
  async getName (ctx) {
    try {
      const bchAddr = ctx.params.bchAddr
      console.log(bchAddr)

      // Retrieve the name from the database.

      // If the name does not exist, scan the transaction history of the
      // address for an OP_RETURN that sets the handle.

      ctx.body = { bchAddr }
    } catch (error) {
      console.error('Error in getName()')
      ctx.throw(404)
    }
  }
}

module.exports = NamesController
