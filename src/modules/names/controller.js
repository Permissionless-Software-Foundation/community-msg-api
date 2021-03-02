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
    this.limitTime = 24
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
      const result = await _this.Name.find({ bchAddr })

      // Boolean that will indicate if 24 hours has been past
      // since the last model update
      let scan = true
      let name // Represents the name associated to the address

      let nameModel = result[0]

      // If a model associated with the bchAddr exist
      // in the database, gets the name of it
      if (nameModel) {
        name = nameModel.name
        const timestamp = nameModel.timestamp

        // Obtains the time of the last update
        // that the model got
        const now = new Date()
        const lastUpdate = new Date(timestamp * 1000)

        // Calculates the time difference
        const dateDiff = now.getTime() - lastUpdate.getTime()
        const hourDiff = Math.floor(dateDiff / 1000 / 60 / 60)
        // console.log('hourDiff', hourDiff)

        // Stablish the variable as true if more than
        // 24 hours has passed since the last model update
        // with the name found in the txs history
        scan = hourDiff >= _this.limitTime
      } else {
        // Creates a new model if no results were
        // found on the database
        nameModel = new _this.Name({ bchAddr })
      }

      // Searchs the name associated to the bchAddr in the txs history
      // if more than 24 hours has passed since the last search
      // or if theres no name associated on the database
      if (scan || typeof name === 'undefined') {
        // If the findName() method returns false or an error,
        // the name property of the Name model should be set to false.
        try {
          name = await _this.bch.findName(bchAddr)
          if (!name) {
            // if the function returs false use the stored
            // name in the database if it exists
            // otherwise return "notAvailable"
            name = nameModel.name || 'notAvailable'
          }
        } catch (error) {
          console.log(
            'Error finding name. Skipping. Error message: ',
            error.message
          )
          // if the function returs false use the stored
          // name in the database if it exists
          // otherwise return "notAvailable"
          name = nameModel.name || 'notAvailable'
        }

        // Update the timestamp and store
        // the model in the database
        nameModel.timestamp = new Date().getTime() / 1000
        nameModel.name = name
        await nameModel.save()
      }

      ctx.body = { name }
    } catch (error) {
      wlogger.error('Error in src/modules/names/controller/getName():', error)
      ctx.throw(404)
    }
  }
}

module.exports = NamesController
