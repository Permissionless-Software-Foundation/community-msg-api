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
})
