// const validator = require('../../middleware/validators')
const CONTROLLER = require('./controller')
const controller = new CONTROLLER()

// export const baseUrl = '/users'
module.exports.baseUrl = '/mail'

module.exports.routes = [
  {
    method: 'GET',
    route: '/:bchAddr',
    handlers: [controller.getMail]
  }
]
