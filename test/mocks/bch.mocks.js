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
module.exports = {
  blockchainInfo,
  txs,
  messages
}
