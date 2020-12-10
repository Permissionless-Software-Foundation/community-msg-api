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
const bch = new BCH()

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
