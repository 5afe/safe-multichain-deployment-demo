import { chainLogo, chainShortname } from '@/config'
import styles from '@/styles/styles.module.css'
import { useSafe } from '@safe-global/safe-react-hooks'
import Image from 'next/image'
import { Chain } from 'viem'
import { useWalletClient } from 'wagmi'
import DeploySafeButton from './DeploySafeButton'

type SafeAccountComponentType = {
  chain: Chain
  ownerAddress: string
}

export default function SafeAccount({
  chain,
  ownerAddress
}: SafeAccountComponentType) {
  const { data: walletClient } = useWalletClient()
  const { getSafeInfo } = useSafe()
  const { data: safeInfo } = getSafeInfo()

  const safeAddress = safeInfo?.address

  const chainLabel = chainShortname[chain.id]
  const baseWalletUrl = `https://app.safe.global/home?safe=`
  const walletUrl = `${baseWalletUrl}${chainLabel}:${safeAddress}`

  return (
    <div className={styles.card}>
      <div className={styles.title}>
        <Image
          aria-hidden
          src={chainLogo[chain.id]}
          alt={`${chain.name} icon`}
          height={30}
          width={30}
        />
        <h2>{chain.name}</h2>
      </div>
      {!safeInfo?.address ? (
        <pre>Loading...</pre>
      ) : (
        <>
          <pre>{safeInfo?.address}</pre>
          {!!safeInfo?.isDeployed && (
            <a href={walletUrl} target="_blank">
              <button>Open app</button>
            </a>
          )}
          {walletClient && (
            <DeploySafeButton
              chain={chain}
              signer={ownerAddress}
              safeAddress={safeInfo?.address}
              isDeployed={!!safeInfo?.isDeployed}
              walletClient={walletClient}
            />
          )}
        </>
      )}
    </div>
  )
}
