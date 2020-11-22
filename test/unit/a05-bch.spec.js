// const config = require('../../config')
const assert = require('chai').assert
const sinon = require('sinon')

const mockData = require('../mocks/bch.mocks.js')

const BCH = require('../../src/lib/bch')
let uut = {}
let sandbox

describe('#bch', () => {
  beforeEach(() => {
    uut = new BCH()

    sandbox = sinon.createSandbox()
  })

  afterEach(() => sandbox.restore())

  describe('#getBlockHeight', () => {
    it('should get the block height', async () => {
      // Mock live network calls.
      sandbox
        .stub(uut.bchjs.Blockchain, 'getBlockchainInfo')
        .resolves(mockData.blockchainInfo)

      const info = await uut.getBlockHeight()
      // console.log(`info: ${JSON.stringify(info, null, 2)}`)

      assert.isAbove(info, 649670)
    })
  })
  describe('#findName', () => {
    it('should throw an error if a bchAddr is not provided.', async () => {
      try {
        await uut.findName()

        assert.equal(true, false, 'Unexpected result!')
      } catch (err) {
        // console.log(err)
        assert.include(
          err.message,
          'bchAddr must be a string of a BCH address.'
        )
      }
    })
    it('should return false if name not found', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.messagesLib.memo, 'findName')
          .resolves(false)

        const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma'
        const result = await uut.findName(bchAddr)
        // console.log(`info: ${JSON.stringify(info, null, 2)}`)

        assert.isBoolean(result)
        assert.isFalse(result)
      } catch (error) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
    it('should get name', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.messagesLib.memo, 'findName')
          .resolves('My name')

        const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma'
        const result = await uut.findName(bchAddr)
        // console.log(`info: ${JSON.stringify(info, null, 2)}`)
        assert.isString(result)
        assert.equal(result, 'My name')
      } catch (error) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
  })
})
