// *Community* messages.

// const validator = require('../../middleware/validators')
const CONTROLLER = require('./controller')
const controller = new CONTROLLER()

// export const baseUrl = '/users'
module.exports.baseUrl = '/messages'

module.exports.routes = [
  {
    method: 'GET',
    route: '/',
    handlers: [controller.getMessages]
  }
]
