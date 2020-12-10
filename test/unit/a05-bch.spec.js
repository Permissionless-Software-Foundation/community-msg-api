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
  describe('#readMessages', () => {
    it('should throw an error if a bchAddr is not provided.', async () => {
      try {
        await uut.readMessages()

        assert.equal(true, false, 'Unexpected result!')
      } catch (err) {
        // console.log(err)
        assert.include(
          err.message,
          'bchAddr must be a string of a BCH address.'
        )
      }
    })
    it('should throw an error if a numChunks is not a number.', async () => {
      try {
        const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma'

        await uut.readMessages(bchAddr, null)

        assert.equal(true, false, 'Unexpected result!')
      } catch (err) {
        // console.log(err)
        assert.include(
          err.message,
          'numChunks must be a number'
        )
      }
    })
    it('should get messages', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.messagesLib.memo, 'readMsgSignal')
          .resolves(mockData.messages)

        const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma'
        const result = await uut.readMessages(bchAddr)

        assert.isArray(result)
        assert.property(result[0], 'hash')
        assert.property(result[0], 'subject')
        assert.property(result[0], 'sender')
        assert.property(result[0], 'txid')
        assert.property(result[0], 'time')
      } catch (error) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
  })
  describe('#getPSFTokenInfo', () => {
    it('should throw an error if a bchAddr is not provided.', async () => {
      try {
        await uut.getPSFTokenInfo()

        assert.equal(true, false, 'Unexpected result!')
      } catch (err) {
        // console.log(err)
        assert.include(
          err.message,
          'bchAddr must be a string of a BCH address.'
        )
      }
    })
    it('should throw an error if the address has no utxos', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.messagesLib.merit, 'getTokenUtxos')
          .resolves([])

        const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma'
        await uut.getPSFTokenInfo(bchAddr)
        // console.log(`info: ${JSON.stringify(info, null, 2)}`)

        assert.equal(true, false, 'Unexpected result!')
      } catch (error) {
        // console.log(err)
        assert.include(
          error.message,
          'No utxos avialable!'
        )
      }
    })
    it('should handle error if the messages lib thrown an error', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.messagesLib.merit, 'getTokenUtxos')
          .resolves(mockData.mockTokenUtxos)
        sandbox
          .stub(uut.messagesLib.merit, 'calcMerit')
          .throws(new Error('test error'))

        const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma'
        await uut.getPSFTokenInfo(bchAddr)
        // console.log(`info: ${JSON.stringify(info, null, 2)}`)

        assert.equal(true, false, 'Unexpected result!')
      } catch (error) {
        // console.log(err)
        assert.include(
          error.message,
          'test error'
        )
      }
    })
    it('should return token info', async () => {
      try {
        // Mock live network calls.
        // Mock live network calls.
        sandbox
          .stub(uut.messagesLib.merit, 'getTokenUtxos')
          .resolves(mockData.mockTokenUtxos)
        sandbox
          .stub(uut.messagesLib.merit, 'calcMerit')
          .resolves(mockData.meritHydratedUtxos)

        const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma'
        const result = await uut.getPSFTokenInfo(bchAddr)

        assert.property(result, 'merit')
        assert.property(result, 'tokenAge')
        assert.property(result, 'tokenBalance')
      } catch (error) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
  })
  describe('#getName', () => {
    it('should return false if an error occurs', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.axios, 'request')
          .throws(new Error('axios error'))

        const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma'
        const result = await uut.getName(bchAddr)
        // console.log(`info: ${JSON.stringify(info, null, 2)}`)

        assert.isFalse(result)
      } catch (error) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
    it('should return false if the name returned is "notAvailable"', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.axios, 'request')
          .resolves({ data: { name: 'notAvailable' } })

        const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma'
        const result = await uut.getName(bchAddr)
        // console.log(`info: ${JSON.stringify(info, null, 2)}`)

        assert.isFalse(result)
      } catch (error) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
    it('should get name', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.axios, 'request')
          .resolves({ data: { name: 'My Name' } })

        const bchAddr = 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma'
        const result = await uut.getName(bchAddr)
        // console.log(`info: ${JSON.stringify(info, null, 2)}`)
        assert.isString(result)
        assert.equal(result, 'My Name')
      } catch (error) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
  })

  describe('#getMessageObj', () => {
    it('should handle error', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
          .throws(new Error('test error'))

        const tx = {
          tx_hash: '60fece763732d398aaf3afe44b4b5dcd81f61813accbd6b615cbf4815a74aac8'
        }
        await uut.getMessageObj(tx)
        assert.equal(true, false, 'Unexpected result!')
      } catch (error) {
        assert.include(
          error.message,
          'test error'
        )
      }
    })
    it('should return false if txid not an OP_RETURN', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
          .resolves(mockData.rawTransactions)
        sandbox
          .stub(uut.bchjs.Script, 'toASM')
          .callsFake(() => { return 'NOT_OP_RETURN 6d24 1da089f65bc1937e87894a69426c05041ef40cef 48656c6c6f2050534620436f6d6d756e697479203a44' })

        const tx = {
          tx_hash: '60fece763732d398aaf3afe44b4b5dcd81f61813accbd6b615cbf4815a74aac8'
        }
        const result = await uut.getMessageObj(tx)
        assert.isFalse(result)
      } catch (error) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
    it('should return false if the script has not memo code', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
          .resolves(mockData.rawTransactions)
        sandbox
          .stub(uut.bchjs.Script, 'toASM')
          .callsFake(() => { return 'OP_RETURN 6d30 1da089f65bc1937e87894a69426c05041ef40cef 48656c6c6f2050534620436f6d6d756e697479203a44' })

        const tx = {
          tx_hash: '60fece763732d398aaf3afe44b4b5dcd81f61813accbd6b615cbf4815a74aac8'
        }
        const result = await uut.getMessageObj(tx)
        assert.isFalse(result)
      } catch (error) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
    it('should get messagesObject with memo code "6d24"', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
          .resolves(mockData.rawTransactions)

        sandbox
          .stub(uut.bchjs.Script, 'toASM')
          .callsFake(() => { return 'OP_RETURN 6d24 1da089f65bc1937e87894a69426c05041ef40cef 48656c6c6f2050534620436f6d6d756e697479203a44' })

        sandbox
          .stub(uut.messagesLib.merit, 'getTokenUtxos')
          .resolves(mockData.mockTokenUtxos)

        sandbox
          .stub(uut.messagesLib.merit, 'calcMerit')
          .resolves(mockData.meritHydratedUtxos)
        const tx = {
          tx_hash: '60fece763732d398aaf3afe44b4b5dcd81f61813accbd6b615cbf4815a74aac8'
        }
        const result = await uut.getMessageObj(tx)

        assert.property(result, 'txid')
        assert.property(result, 'text')
        assert.property(result, 'height')
        assert.property(result, 'merit')
        assert.property(result, 'tokenAge')
        assert.property(result, 'tokenBalance')
        assert.property(result, 'sender')
        assert.property(result, 'timestamp')
      } catch (error) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
    it('should get messagesObject with memo code "6d02"', async () => {
      try {
        // Mock live network calls.
        sandbox
          .stub(uut.bchjs.RawTransactions, 'getRawTransaction')
          .resolves(mockData.rawTransactions)

        sandbox
          .stub(uut.bchjs.Script, 'toASM')
          .callsFake(() => { return 'OP_RETURN 6d02 1da089f65bc1937e87894a69426c05041ef40cef 48656c6c6f2050534620436f6d6d756e697479203a44' })

        sandbox
          .stub(uut.messagesLib.merit, 'getTokenUtxos')
          .resolves(mockData.mockTokenUtxos)

        sandbox
          .stub(uut.messagesLib.merit, 'calcMerit')
          .resolves(mockData.meritHydratedUtxos)
        const tx = {
          tx_hash: '60fece763732d398aaf3afe44b4b5dcd81f61813accbd6b615cbf4815a74aac8'
        }
        const result = await uut.getMessageObj(tx)

        assert.property(result, 'txid')
        assert.property(result, 'text')
        assert.property(result, 'height')
        assert.property(result, 'merit')
        assert.property(result, 'tokenAge')
        assert.property(result, 'tokenBalance')
        assert.property(result, 'sender')
        assert.property(result, 'timestamp')
      } catch (error) {
        assert.equal(true, false, 'Unexpected result!')
      }
    })
  })
})
