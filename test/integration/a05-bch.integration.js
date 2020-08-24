// const config = require('../config')
const assert = require('chai').assert

const BCH = require('../../src/lib/bch')
let uut = {}

describe('#bch', () => {
  beforeEach(() => (uut = new BCH()))

  describe('#getBlockHeight', () => {
    it('should get the block height', async () => {
      const info = await uut.getBlockHeight()
      // console.log(`info: ${JSON.stringify(info, null, 2)}`)

      assert.isAbove(info, 649670)
    })
  })

  describe('#getTransactions', () => {
    it('should get transactions', async () => {
      const txs = await uut.getTransactions()
      console.log('txs: ', txs)
    })
  })
})
