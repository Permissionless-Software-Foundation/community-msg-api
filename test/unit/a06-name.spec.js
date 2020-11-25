const config = require('../../config')
const assert = require('chai').assert
const sinon = require('sinon')

const axios = require('axios').default

const LOCALHOST = `http://localhost:${config.port}`

const Names = require('../../src/modules/names/controller')
const NameModel = require('../../src/models/name')

const mockContext = require('../mocks/ctx-mock').context

let uut = {}
let sandbox

// Ensures that the model stored from the test
// gets deleted once it finishes
// this way we make sure that the controller validations
// are always covered
const deleteName = async (bchAddr) => {
  try {
    const name = await NameModel.find({ bchAddr })

    await name[0].remove()
  } catch (error) {
    console.log(error)
    throw error
  }
}

const getStoredName = async (bchAddr) => {
  const result = await NameModel.find({ bchAddr })
  return result[0]
}
describe('Names', () => {
  const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8m8'

  beforeEach(() => {
    uut = new Names()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())
  after(async () => {
    await deleteName(bchAddr)
  })
  describe('GET /name/:bchaddr', () => {
    it('should throw 404 if an error is thrown', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.Name, 'find').throws('test error')

        // Mock the context object.
        const ctx = mockContext()

        ctx.params = { bchAddr }

        await uut.getName(ctx)

        assert.equal(true, false, 'Unexpected result!')
      } catch (err) {
        assert.equal(err.status, 404)
      }
    })
    it('should get name from bchaddr transactions history', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.Name, 'find')
          .resolves([])
        sandbox
          .stub(uut.bch, 'findName')
          .resolves('My name')

        // Mock the context object.
        const ctx = mockContext()

        ctx.params = { bchAddr }

        await uut.getName(ctx)

        const result = ctx.body

        assert.isString(result.name)
        assert.equal(result.name, 'My name')
      } catch (err) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
    it('should return "notAvailable" if name not found in the transactions history', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.Name, 'find')
          .resolves([])
        sandbox
          .stub(uut.bch, 'findName')
          .resolves(false)

        // Mock the context object.
        const ctx = mockContext()

        ctx.params = { bchAddr }

        await uut.getName(ctx)

        const result = ctx.body

        assert.isString(result.name)
        assert.equal(result.name, 'notAvailable')
      } catch (err) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
    it('Should return "notAvailable" if an error occurs when looking up the name in the transaction history', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.Name, 'find')
          .resolves([])
        sandbox
          .stub(uut.bch, 'findName')
          .throws(new Error('test error'))

        const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp888'

        // Mock the context object.
        const ctx = mockContext()

        ctx.params = { bchAddr }

        await uut.getName(ctx)

        const result = ctx.body
        assert.isString(result.name)
        assert.equal(result.name, 'notAvailable')
      } catch (err) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
    it('Should return the scanned name if the timestamp propety is more than the time limit (24 hours)', async () => {
      try {
        const storedName = await getStoredName(bchAddr)
        // set old timestamp
        storedName.timestamp = new Date('2020-10-23T21:27:11.000').getTime() / 1000

        // Mock live network calls.
        sandbox
          .stub(uut.Name, 'find')
          .resolves([storedName])
        sandbox
          .stub(uut.bch, 'findName')
          .resolves('MyName From Txs')

        // Mock the context object.
        const ctx = mockContext()

        ctx.params = { bchAddr }

        await uut.getName(ctx)

        const result = ctx.body
        assert.isString(result.name)
        assert.equal(result.name, 'MyName From Txs')
      } catch (err) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
    it('Should return the stored name if the findName() function throw error o returned false', async () => {
      try {
        const storedName = await getStoredName(bchAddr)
        // set old timestamp
        storedName.timestamp = new Date('2020-10-23T21:27:11.000').getTime() / 1000

        // Mock live network calls.
        sandbox
          .stub(uut.Name, 'find')
          .resolves([storedName])
        sandbox
          .stub(uut.bch, 'findName')
          .resolves(false)

        // Mock the context object.
        const ctx = mockContext()

        ctx.params = { bchAddr }

        await uut.getName(ctx)

        const result = ctx.body
        assert.isString(result.name)
        assert.equal(result.name, 'MyName From Txs')
      } catch (err) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
    it('Should return the stored name if the timestamp propety is less than the time limit (24 hours)', async () => {
      try {
        const storedName = await getStoredName(bchAddr)
        // set old timestamp
        storedName.timestamp = new Date().getTime() / 1000

        // Mock live network calls.
        sandbox
          .stub(uut.Name, 'find')
          .resolves([storedName])

        // Mock the context object.
        const ctx = mockContext()

        ctx.params = { bchAddr }

        await uut.getName(ctx)

        const result = ctx.body
        assert.isString(result.name)
        assert.equal(result.name, 'MyName From Txs')
      } catch (err) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })

    it('should get name', async () => {
      try {
        const options = {
          method: 'GET',
          url: `${LOCALHOST}/names/${bchAddr}`
        }

        const result = await axios(options)

        assert.equal(result.status, 200, 'Status Code 200 expected.')
        assert.isString(result.data.name)
      } catch (err) {
        assert(false, 'Unexpected result')
      }
    })
  })
})
