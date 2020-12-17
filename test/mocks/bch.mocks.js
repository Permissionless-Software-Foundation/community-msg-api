const blockchainInfo = {
  chain: 'main',
  blocks: 649680,
  headers: 649680,
  bestblockhash:
    '0000000000000000024b18bdbc5a2e32e794354047917f4c7101242ad6edf4bc',
  difficulty: 386320472476.4109,
  mediantime: 1598222870,
  verificationprogress: 0.9999922232956203,
  initialblockdownload: false,
  chainwork: '000000000000000000000000000000000000000001444bf932f7e05eb71fced5',
  size_on_disk: 169201325301,
  pruned: false,
  softforks: {
    minerfund: {
      type: 'bip9',
      bip9: {
        status: 'failed',
        start_time: 1573819200,
        timeout: 1589544000,
        since: 637056
      },
      active: false
    },
    minerfundabc: {
      type: 'bip9',
      bip9: {
        status: 'failed',
        start_time: 1573819200,
        timeout: 1589544000,
        since: 637056
      },
      active: false
    },
    minerfundbchd: {
      type: 'bip9',
      bip9: {
        status: 'failed',
        start_time: 1573819200,
        timeout: 1589544000,
        since: 637056
      },
      active: false
    },
    minerfundelectroncash: {
      type: 'bip9',
      bip9: {
        status: 'failed',
        start_time: 1573819200,
        timeout: 1589544000,
        since: 637056
      },
      active: false
    }
  },
  warnings:
    'This is a pre-release test build - use at your own risk - do not use for mining or merchant applications'
}

const txs = [
  {
    height: 649551,
    tx_hash: '1f0fbd4f3c4bcfae57b55dd4275fc1822533dcfbcaa3bd1d00cf758ebfa3f5d3'
  },
  {
    height: 649551,
    tx_hash: '5033512b7d442ada5306179869d20f9a04aaaf782e2ae65b8d60de9dccd049ef'
  },
  {
    height: 649551,
    tx_hash: '5b2bd0d2d21519560481adb72b08abc4d14b6eeb092cdc69f9cc0e3cbce2d5d2'
  },
  {
    height: 649551,
    tx_hash: '6f201c6e38a7f26f3b7aa14a86d612ce454c46b54f70c7c38ba980f31a19feac'
  },
  {
    height: 649551,
    tx_hash: 'aee22603436d29b19c35abea71c2461d1870c0a5ce9d0c9a98d177e4315d618b'
  },
  {
    height: 649553,
    tx_hash: '5b679c803425bae04fc88b726ebf9f5497aa0a272a433410a8a0e0957449ee67'
  },
  {
    height: 649554,
    tx_hash: '39a4d36f0d25bf81a1296a28d6afd0a5cebbfa0f7ac994492c2955210dc59b5c'
  },
  {
    height: 649554,
    tx_hash: 'fed84a875d9be3b88df4ab9cfcc0e5ee6c1ad94182fb853eefa67330769254fc'
  },
  {
    height: 649556,
    tx_hash: '79a66a641566c5d53a4137fc4016c8ce29cfc8e31e5ca4780140068ca83d2862'
  },
  {
    height: 649562,
    tx_hash: '7aa4b4509dc85d2d80f10c53434d2c014acd63b3328667d4d28eaefaf7a72848'
  },
  {
    fee: 316,
    height: 0,
    tx_hash: 'da2ad45ab60e7b80b7c3952175a1752b8fabda537d5497e4d11cf5b898831d37'
  }
]
const messages = [
  {
    sender: 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma',
    subject: 'Subject',
    hash: 'QmPD3BaqEJLL74KLFnk1HKYmmCPZkaXBc8dUKcA51a6BjA',
    txid: 'c42ec10e2196bcf070f6fa0024c368ccab03c52fef2db7583477b59d564db2e2',
    time: '1605376672'
  },
  {
    sender: 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma',
    subject: 'Subject',
    hash: 'QmPD3BaqEJLL74KLFnk1HKYmmCPZkaXBc8dUKcA51a6BjA',
    txid: 'c42ec10e2196bcf070f6fa0024c368ccab03c52fef2db7583477b59d564db2e2',
    time: '1605376672'

  }
]

const mockTokenUtxos = [
  {
    height: 656881,
    tx_hash: '7b0813748b9861b0487bae20568d9fde4691f92c1b8c2db944d6a2186d7394b1',
    tx_pos: 1,
    value: 546,
    satoshis: 546,
    txid: '7b0813748b9861b0487bae20568d9fde4691f92c1b8c2db944d6a2186d7394b1',
    vout: 1,
    utxoType: 'token',
    transactionType: 'send',
    tokenId: '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0',
    tokenTicker: 'PSF',
    tokenName: 'Permissionless Software Foundation',
    tokenDocumentUrl: 'psfoundation.cash',
    tokenDocumentHash: '',
    decimals: 8,
    tokenType: 1,
    tokenQty: 5,
    isValid: true
  },
  {
    height: 656883,
    tx_hash: 'f9e1c54f561477749a46c0ed6377150b32a9f876989e09f79a2038afbad9cd7e',
    tx_pos: 1,
    value: 546,
    satoshis: 546,
    txid: 'f9e1c54f561477749a46c0ed6377150b32a9f876989e09f79a2038afbad9cd7e',
    vout: 1,
    utxoType: 'token',
    transactionType: 'send',
    tokenId: '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0',
    tokenTicker: 'PSF',
    tokenName: 'Permissionless Software Foundation',
    tokenDocumentUrl: 'psfoundation.cash',
    tokenDocumentHash: '',
    decimals: 8,
    tokenType: 1,
    tokenQty: 3,
    isValid: true
  },
  {
    height: 656886,
    tx_hash: 'b616cd9e19c5182cf026b2ed3ca8352799a797531c06528821cc14b00011b2cc',
    tx_pos: 1,
    value: 546,
    satoshis: 546,
    txid: 'b616cd9e19c5182cf026b2ed3ca8352799a797531c06528821cc14b00011b2cc',
    vout: 1,
    utxoType: 'token',
    transactionType: 'send',
    tokenId: '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0',
    tokenTicker: 'PSF',
    tokenName: 'Permissionless Software Foundation',
    tokenDocumentUrl: 'psfoundation.cash',
    tokenDocumentHash: '',
    decimals: 8,
    tokenType: 1,
    tokenQty: 2.12345678,
    isValid: true
  }
]

const meritHydratedUtxos = [
  {
    height: 656881,
    tx_hash: '7b0813748b9861b0487bae20568d9fde4691f92c1b8c2db944d6a2186d7394b1',
    tx_pos: 1,
    value: 546,
    satoshis: 546,
    txid: '7b0813748b9861b0487bae20568d9fde4691f92c1b8c2db944d6a2186d7394b1',
    vout: 1,
    utxoType: 'token',
    transactionType: 'send',
    tokenId: '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0',
    tokenTicker: 'PSF',
    tokenName: 'Permissionless Software Foundation',
    tokenDocumentUrl: 'psfoundation.cash',
    tokenDocumentHash: '',
    decimals: 8,
    tokenType: 1,
    tokenQty: 5,
    isValid: true,
    age: 11,
    merit: 55
  },
  {
    height: 656883,
    tx_hash: 'f9e1c54f561477749a46c0ed6377150b32a9f876989e09f79a2038afbad9cd7e',
    tx_pos: 1,
    value: 546,
    satoshis: 546,
    txid: 'f9e1c54f561477749a46c0ed6377150b32a9f876989e09f79a2038afbad9cd7e',
    vout: 1,
    utxoType: 'token',
    transactionType: 'send',
    tokenId: '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0',
    tokenTicker: 'PSF',
    tokenName: 'Permissionless Software Foundation',
    tokenDocumentUrl: 'psfoundation.cash',
    tokenDocumentHash: '',
    decimals: 8,
    tokenType: 1,
    tokenQty: 3,
    isValid: true,
    age: 9,
    merit: 27
  },
  {
    height: 656886,
    tx_hash: 'b616cd9e19c5182cf026b2ed3ca8352799a797531c06528821cc14b00011b2cc',
    tx_pos: 1,
    value: 546,
    satoshis: 546,
    txid: 'b616cd9e19c5182cf026b2ed3ca8352799a797531c06528821cc14b00011b2cc',
    vout: 1,
    utxoType: 'token',
    transactionType: 'send',
    tokenId: '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0',
    tokenTicker: 'PSF',
    tokenName: 'Permissionless Software Foundation',
    tokenDocumentUrl: 'psfoundation.cash',
    tokenDocumentHash: '',
    decimals: 8,
    tokenType: 1,
    tokenQty: 2.12345678,
    isValid: true,
    age: 6,
    merit: 12
  }
]
const rawTransactions = {
  txid: '60fece763732d398aaf3afe44b4b5dcd81f61813accbd6b615cbf4815a74aac8',
  hash: '60fece763732d398aaf3afe44b4b5dcd81f61813accbd6b615cbf4815a74aac8',
  version: 1,
  size: 283,
  locktime: 0,
  vin: [
    {
      txid: 'e1cb9c07751f6352058ec7d3c7724b7d9ec496769a08c30eea88dfbd3eaf37c7',
      vout: 0,
      scriptSig: [Object],
      sequence: 4294967295
    }
  ],
  vout: [
    {
      value: 0,
      n: 0,
      scriptPubKey: {
        hex: '6a026d24141da089f65bc1937e87894a69426c05041ef40cef1648656c6c6f2050534620436f6d6d756e697479203a44',
        addresses: ['bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma']
      }

    },
    { value: 0.000006, n: 1, scriptPubKey: [Object] },
    { value: 0.22801157, n: 2, scriptPubKey: [Object] }
  ],
  hex: '0100000001c737af3ebddf88ea0ec3089a7696c49e7d4b72c7d3c78e0552631f75079ccbe1000000006b483045022100b27f426afcf03c95dc19d507cd2ff8c1469526c1d04c48cb7fe426315f54db07022018b6f65f3aa7afb5a6523b35f36e0d2b6a654eebf17ce842e02b63c4f4952323412103a7add9f08612d14476f395dcf058409d1ce4b50c84b652329e53e8af5d430c94ffffffff030000000000000000306a026d24141da089f65bc1937e87894a69426c05041ef40cef1648656c6c6f2050534620436f6d6d756e697479203a4458020000000000001976a9141da089f65bc1937e87894a69426c05041ef40cef88ac05eb5b01000000001976a914135239f14e5894b5e415c2ac1cf37e882eb6e1a988ac00000000',
  blockhash: '00000000000000000295fb14b54fe4d5c5dd627ecf47dcee3dfe4ae25f76a327',
  confirmations: 208,
  time: 1607369490,
  blocktime: 1607369490
}

// balance for address
const tokenBalance = [{
  balanceString: '1010',
  slpAddress: 'simpleledger:qpnty9t0w93fez14h7yzevujpv8oun204qqp0jfafg',
  tokenId: '38e97c5d7d3585a2cbf3f9580c82ca33985f9cb0845d4dcce220cb709f9538b0',
  balance: 1010,
  decimalCount: 0
}
]

//  Mock message model
const msjObj = {
  txid: 'da2ad45ab60e7b80b7c3952175a1752b8fabda537d5497e4d11cf5b898831d37',
  isValid: true,
  text: '\u001d \tv[A\u0013~\u0007\tJiBl\u0005\u0004\u001et\fo',
  sender: 'bitcoincash:qp0x969mxggq2ykvkt8x508kacauvq6hgy0ewpp8ma',
  tokenBalance: 0,
  tokenAge: 0,
  merit: 0,
  height: 649681,
  timestamp: '2020-12-17T02:53:59.894Z'
}
module.exports = {
  blockchainInfo,
  txs,
  messages,
  mockTokenUtxos,
  meritHydratedUtxos,
  rawTransactions,
  tokenBalance,
  msjObj
}
