import Application from '@/components/Application'
import { chains } from '@/config'
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Head from 'next/head'
import { WagmiProvider } from 'wagmi'

const queryClient = new QueryClient()

const config = getDefaultConfig({
  appName: 'My RainbowKit App',
  projectId: 'YOUR_PROJECT_ID',
  chains: chains,
  ssr: true // If your dApp uses server side rendering (SSR)
})

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Head>
            <title>Multichain Safe Deployer</title>
            <meta name="description" content="Multichain Safe deployer" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
          </Head>
          <main>
            <Application />
          </main>
          <footer>
            <a
              href="https://docs.safe.global/home/what-is-safe"
              target="_blank"
              rel="noopener noreferrer"
            >
              Check the Safe developer docs
            </a>
          </footer>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
