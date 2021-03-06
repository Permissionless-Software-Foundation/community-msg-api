// npm libraries
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const convert = require('koa-convert')
const logger = require('koa-logger')
const mongoose = require('mongoose')
const session = require('koa-generic-session')
const passport = require('koa-passport')
const mount = require('koa-mount')
const serve = require('koa-static')
const cors = require('kcors')

// Local libraries
const config = require('../config') // this first.

const AdminLib = require('../src/lib/admin')
const adminLib = new AdminLib()

const errorMiddleware = require('../src/middleware')
const wlogger = require('../src/lib/wlogger')
const BCH = require('../src/lib/bch')
let bch = new BCH()

const JwtLib = require('jwt-bch-lib')
const jwtLib = new JwtLib({
  // Overwrite default values with the values in the config file.
  server: 'https://auth.fullstack.cash',
  login: process.env.FULLSTACKLOGIN,
  password: process.env.FULLSTACKPASS
})

async function startServer () {
  // Create a Koa instance.
  const app = new Koa()
  app.keys = [config.session]

  // Connect to the Mongo Database.
  mongoose.Promise = global.Promise
  mongoose.set('useCreateIndex', true) // Stop deprecation warning.
  await mongoose.connect(
    config.database,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true
    }
  )

  // MIDDLEWARE START

  app.use(convert(logger()))
  app.use(bodyParser())
  app.use(session())
  app.use(errorMiddleware())

  // Used to generate the docs.
  app.use(mount('/', serve(`${process.cwd()}/docs`)))

  // Mount the page for displaying logs.
  app.use(mount('/logs', serve(`${process.cwd()}/config/logs`)))

  // User Authentication
  require('../config/passport')
  app.use(passport.initialize())
  app.use(passport.session())

  // Custom Middleware Modules
  const modules = require('../src/modules')
  modules(app)

  // Enable CORS for testing
  // THIS IS A SECURITY RISK. COMMENT OUT FOR PRODUCTION
  app.use(cors({ origin: '*' }))

  // MIDDLEWARE END

  console.log(`Running server in environment: ${config.env}`)
  wlogger.info(`Running server in environment: ${config.env}`)

  await app.listen(config.port)
  console.log(`Server started on ${config.port}`)

  // Create the system admin user.
  const success = await adminLib.createSystemUser()
  if (success) console.log('System admin user created.')

  // Get the JWT token needed to interact with the FullStack.cash API.
  if (process.env.FULLSTACKLOGIN) {
    await getJwt()
    bch = new BCH() // Reinitialize bchjs with the JWT token.

    // Renew the JWT token every 24 hours
    setInterval(async function () {
      wlogger.info('Updating FullStack.cash JWT token')
      await getJwt()
      bch = new BCH() // Reinitialize bchjs with the JWT token.
    }, 60000 * 60 * 24)
  }

  // setInterval(async function () {
  //   const now = new Date()
  //   console.log(
  //     `Checking for new community messages at ${now.toLocaleString()}`
  //   )
  //   bch.checkMessages()
  // }, 60000 * 5)
  // bch.checkMessages()

  // Kick off the first message scan right away.
  // bch.checkMessages()

  // Periodically scan for more community messages.
  periodicallyScanForMessages()

  return app
}
// startServer()

// export default app
// module.exports = app
module.exports = {
  startServer
}

// This is a timer based function that scans for community messages on the
// blockchain. Because scanning can take an indeterminant amount of time, the
// timer is suspended while scanning is in progress. It is then resumed after
// each scanner run completes.
async function periodicallyScanForMessages () {
  // Start the timer
  const timerHandle = setInterval(async function () {
    try {
      // Pause the timer.
      clearInterval(timerHandle)

      // Scan for new messages
      const now = new Date()
      console.log(
        `Checking for new community messages at ${now.toLocaleString()}`
      )
      await bch.checkMessages()

      // Let this function recursively call itself, to resume scans for new
      // messages on a periodic basis.
      periodicallyScanForMessages()
    } catch (err) {
      // In the event of an error, wait 2 minutes then resume scans.
      clearInterval(timerHandle)
      await sleep(60000 * 2) // Wait 2 minutes
      periodicallyScanForMessages()
    }
  }, 60000 * 1) // One minute
}

function sleep (ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Get's a JWT token from FullStack.cash.
// This code based on the jwt-bch-demo:
// https://github.com/Permissionless-Software-Foundation/jwt-bch-demo
async function getJwt () {
  try {
    // Log into the auth server.
    await jwtLib.register()

    let apiToken = jwtLib.userData.apiToken

    // Ensure the JWT token is valid to use.
    const isValid = await jwtLib.validateApiToken()

    // Get a new token with the same API level, if the existing token is not
    // valid (probably expired).
    if (!isValid.isValid) {
      apiToken = await jwtLib.getApiToken(jwtLib.userData.apiLevel)
      console.log('The JWT token was not valid. Retrieved new JWT token.\n')
    } else {
      console.log('JWT token is valid.\n')
    }

    // Set the environment variable.
    process.env.BCHJSTOKEN = apiToken
  } catch (err) {
    wlogger.error('Error in token-liquidity.js/getJwt(): ', err)
    throw err
  }
}
