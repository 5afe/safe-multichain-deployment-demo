import { PIMLICO_API_KEY, chainLogo, chains, rpcUrls } from '@/config'
import styles from '@/styles/styles.module.css'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { SafeProvider, createConfig } from '@safe-global/safe-react-hooks'
import { useAccount, useDisconnect } from 'wagmi'
import SafeAccount from './SafeAccount'

export default function Application() {
  const { openConnectModal } = useConnectModal()
  const { disconnect } = useDisconnect()
  const { address } = useAccount()
  const isSignerConnected = !!address

  if (!isSignerConnected) {
    return (
      <button onClick={openConnectModal}>
        Connect
      </button>
    )
  }
  
  return (
    <div>
      <button onClick={() => disconnect()}>
        Disconnect
      </button>
      <p className={styles.ownerlabel}>
        Owner: {address}
      </p>
      <h2 className={styles.safetitle}>Safe Accounts</h2>
      {chains.map((chain) => {
        const BUNDLER_URL = `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${PIMLICO_API_KEY}`
        const PAYMASTER_URL = `https://api.pimlico.io/v2/${chain.id}/rpc?apikey=${PIMLICO_API_KEY}`

        const config = createConfig({
          chain: chain as any,
          provider: rpcUrls[chain.id] || chain.rpcUrls.default.http[0],
          signer: address,
          safeOptions: {
            owners: [address],
            threshold: 1,
            saltNonce: '123'
          },
          safeOperationOptions: {
            isSponsored: true,
            bundlerUrl: BUNDLER_URL,
            paymasterUrl: PAYMASTER_URL
          }
        })
        
        return (
          <SafeProvider config={config} key={chain.id}>
            <SafeAccount
              chain={chain}
              ownerAddress={address}
              chainLogo={chainLogo[chain.id]}
            />
          </SafeProvider>
        )
      })}
    </div>
  )
}
