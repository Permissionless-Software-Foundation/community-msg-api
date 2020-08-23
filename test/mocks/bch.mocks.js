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

module.exports = {
  blockchainInfo
}
