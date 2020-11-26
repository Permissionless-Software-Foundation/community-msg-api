const config = require('../../config')
const assert = require('chai').assert

const axios = require('axios').default
const sinon = require('sinon')

const util = require('util')
util.inspect.defaultOptions = { depth: 1 }

const LOCALHOST = `http://localhost:${config.port}`

const MailsController = require('../../src/modules/mail/controller')
const mockContext = require('../mocks/ctx-mock').context
const mockData = require('../mocks/bch.mocks')

let sandbox
let uut
describe('LogsApi', () => {
  const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8m8'

  beforeEach(() => {
    uut = new MailsController()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('GET /mail/:bchaddr', () => {
    it('should throw 404 if an error is thrown', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.bch, 'readMessages').throws('test error')

        // Mock the context object.
        const ctx = mockContext()

        ctx.params = { bchAddr }

        await uut.getMail(ctx)

        assert.equal(true, false, 'Unexpected result!')
      } catch (err) {
        assert.equal(err.status, 404)
      }
    })

    it('should trhow error 404 if bchAddr is wrong', async () => {
      try {
        const options = {
          method: 'GET',
          url: `${LOCALHOST}/mail/1`
        }

        await axios(options)

        assert(false, 'Unexpected result')
      } catch (err) {
        assert.equal(err.response.status, 404)
      }
    })
    it('should get mail', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.bch, 'readMessages').resolves(mockData.messages)

        // Mock the context object.
        const ctx = mockContext()

        ctx.params = { bchAddr }

        await uut.getMail(ctx)

        const result = ctx.body

        assert.isArray(result.mail)
        assert.property(result.mail[0], 'hash')
        assert.property(result.mail[0], 'subject')
        assert.property(result.mail[0], 'sender')
        assert.property(result.mail[0], 'txid')
        assert.property(result.mail[0], 'time')
      } catch (err) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
  })
})
