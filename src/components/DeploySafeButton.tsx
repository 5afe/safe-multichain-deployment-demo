import { PIMLICO_API_KEY } from '@/config'
import {
  createConfig,
  useSendSafeOperation
} from '@safe-global/safe-react-hooks'
import { useState } from 'react'
import { Chain } from 'viem'
import { useSwitchChain } from 'wagmi'

type DeploySafeButtonProps = {
  chain: Chain
  signer: string
  safeAddress: string
  isDeployed: boolean
  walletClient: any
}

export default function DeploySafeButton({
  chain,
  signer,
  safeAddress,
  isDeployed,
  walletClient
}: DeploySafeButtonProps) {
  const [isDeploymentLoading, setIsDeploymentLoading] = useState(false)
  const [deploymentUserOp, setDeploymentUserOp] = useState('')
  const { switchChainAsync } = useSwitchChain()

  const showDeploySafeButton = safeAddress && !isDeployed && walletClient
  
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
  const { sendSafeOperationAsync } = useSendSafeOperation({ config })

  const transactions = [
    {
      to: safeAddress,
      data: '0x',
      value: '0'
    }
  ]

  async function deploySafeAccount() {
    try {
      setIsDeploymentLoading(true)
      await switchChainAsync({ chainId: chain.id })
      const { safeOperations } = await sendSafeOperationAsync({ transactions })
      const deploymentUserOpLink = `https://jiffyscan.xyz/userOpHash/${safeOperations?.userOperationHash}?network=${chain.name.toLowerCase()}`
      setDeploymentUserOp(deploymentUserOpLink)
      setIsDeploymentLoading(false)
    } catch(e) {
      setDeploymentUserOp('')
      setIsDeploymentLoading(false)
    }
  }

  if (isDeploymentLoading) {
    return <span>Deploying account...</span>
  }

  if (showDeploySafeButton) {
    return <button onClick={deploySafeAccount}>Deploy Safe</button>
  }

  if (deploymentUserOp) {
    return (
      <a href={deploymentUserOp} target="_blank">
        <span>Deployment transaction</span>
      </a>
    )
  }
}
