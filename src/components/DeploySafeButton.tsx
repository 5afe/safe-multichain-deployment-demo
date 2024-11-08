import { PIMLICO_API_KEY } from '@/config'
import {
  createConfig,
  useSendSafeOperation
} from '@safe-global/safe-react-hooks'
import { Chain } from 'viem'
import { useSwitchChain } from 'wagmi'

type DeploySafeButtonProps = {
  chain: Chain
  safeAddress: string
  signer: any, //
  walletClient: any //
}

export default function DeploySafeButton({
  chain,
  safeAddress,
  signer,
  walletClient
}: DeploySafeButtonProps) {
  const { switchChain } = useSwitchChain()

  const BUNDLER_URL = `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${PIMLICO_API_KEY}`
  const PAYMASTER_URL = `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${PIMLICO_API_KEY}`

  const config = createConfig({
    chain,
    provider: {
      request: walletClient.request
    },
    signer: signer,
    safeOptions: {
      owners: [signer],
      threshold: 1,
      saltNonce: '123'
    },
    safeOperationOptions: {
      isSponsored: true,
      bundlerUrl: BUNDLER_URL,
      paymasterUrl: PAYMASTER_URL
    }
  })

  const { sendSafeOperation } = useSendSafeOperation({ config })

  const transactions = [{
    to: safeAddress,
    data: '0x',
    value: '0'
  }]

  async function deploySafeAccount() {
    switchChain({ chainId: chain.id })
    sendSafeOperation({ transactions })
  }

  return (
    <button onClick={deploySafeAccount}>
      Deploy Safe
    </button>
  )
}
