import { base, gnosis, polygon, sepolia } from 'viem/chains'

export const chains = [gnosis, base, polygon, sepolia] as const

export const PIMLICO_API_KEY = 'pim_mAzX6WFFpSLoZDDWDKHsSE'

export const chainLogo: Record<number, string> = {
  [gnosis.id]: '/gnosis.png',
  [base.id]: '/base.png',
  [polygon.id]: '/polygon.png',
  [sepolia.id]: '/sepolia.png'
}

export const chainShortname: Record<number, string> = {
  [gnosis.id]: 'gno',
  [base.id]: 'base',
  [polygon.id]: 'matic',
  [sepolia.id]: 'sep'
}

export const rpcUrls = {
  [gnosis.id]: 'https://rpc.ankr.com/gnosis',
  [polygon.id]: '',
  [base.id]: '',
  [sepolia.id]: 'https://sepolia.gateway.tenderly.co'
}
