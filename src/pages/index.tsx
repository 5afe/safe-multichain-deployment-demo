import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import {
  useAccount,
  useDisconnect,
  usePublicClient,
  useSwitchChain,
} from "wagmi";
import { gnosis, base, polygon, sepolia, Chain } from "viem/chains";
import { createWalletClient, custom } from "viem";

import {
  SafeProvider,
  createConfig,
  useSafe,
  useSendTransaction,
} from "@safe-global/safe-react-hooks";

const chains = [gnosis, base, polygon, sepolia] as const;

const PIMLICO_API_KEY = "f8492c09-7cad-43ed-83d3-548a3692583d";

const chainLogo: Record<number, string> = {
  [gnosis.id]: "/gnosis.png",
  [base.id]: "/base.png",
  [polygon.id]: "/polygon.png",
  [sepolia.id]: "/sepolia.png",
  // [arbitrum.id]: "/arbitrum.png",
  // [optimism.id]: "/optimism.png",
};

const chainShortname: Record<number, string> = {
  [gnosis.id]: "gno",
  [base.id]: "base",
  [polygon.id]: "matic",
  [sepolia.id]: "sep",
  // [arbitrum.id]: "arb1",
  // [optimism.id]: "oeth",
};

function App() {
  const { address } = useAccount();

  const { openConnectModal } = useConnectModal();
  const { disconnect } = useDisconnect();

  const isSignerConnected = !!address;

  return (
    <div className={styles.content}>
      {isSignerConnected && (
        <div>
          <button onClick={() => disconnect()} className={styles.button}>
            Disconnect Wallet
          </button>
        </div>
      )}

      <p>this a demo app to showcase the safe react hooks!</p>
      <p>
        You can deploy your Safe account in different chains with the same
        adress!
      </p>

      {isSignerConnected ? (
        <div>
          <p className={styles.ownerlabel}>owner: {address}</p>

          {/* Safe list */}
          <h2 className={styles.safetitle}>Safe Accouts</h2>

          <ul className={styles.safelist}>
            {chains.map((chain) => {
              // Safe options
              const safeOptions = {
                owners: [address!],
                threshold: 1,
                saltNonce: "123",
              };

              // Bundler URL
              const BUNDLER_URL = `https://api.pimlico.io/v2/${chain.name.toLowerCase()}/rpc?apikey=${PIMLICO_API_KEY}`; // PIMLICO

              // Paymaster URL
              const PAYMASTER_URL = `https://api.pimlico.io/v2/${chain.name.toLowerCase()}/rpc?apikey=${PIMLICO_API_KEY}`; // PIMLICO

              const config = createConfig({
                chain: chain as any,
                provider: chain.rpcUrls.default.http[0],
                signer: address!,
                safeOptions,
                safeOperationOptions: {
                  isSponsored: true,
                  bundlerUrl: BUNDLER_URL,
                  paymasterUrl: PAYMASTER_URL,
                },
              });

              return (
                <SafeProvider config={config} key={chain.id}>
                  <li className={styles.safeitem}>
                    <SafeAccountComponent
                      chain={chain}
                      ownerAddress={address}
                      chainLogo={chainLogo[chain.id]}
                    />
                  </li>
                </SafeProvider>
              );
            })}
          </ul>
        </div>
      ) : (
        <button onClick={openConnectModal} className={styles.button}>
          Connect Wallet
        </button>
      )}
    </div>
  );
}

import {
  getDefaultConfig,
  RainbowKitProvider,
  useConnectModal,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

import "@rainbow-me/rainbowkit/styles.css";

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: "My RainbowKit App",
  projectId: "YOUR_PROJECT_ID",
  chains: chains,
  ssr: true, // If your dApp uses server side rendering (SSR)
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export default function Home() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Head>
            <title>Create Next App</title>
            <meta name="description" content="Generated by create next app" />
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1"
            />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <div
            className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}
          >
            <Image
              className={styles.logo}
              src="./safe.svg"
              alt="Safe logo"
              height={200}
              width={300}
              priority
            />

            <main className={styles.main}>
              <App />
            </main>

            <footer className={styles.footer}>
              <a
                href="https://docs.safe.global/home/what-is-safe"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Image
                  aria-hidden
                  src="https://nextjs.org/icons/globe.svg"
                  alt="Globe icon"
                  width={16}
                  height={16}
                />
                Go to Safe docs →
              </a>
            </footer>
          </div>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

type SafeAccountComponentType = {
  chain: Chain;
  chainLogo: string;
  ownerAddress: string;
};

function SafeAccountComponent({
  chain,
  chainLogo,
  ownerAddress,
}: SafeAccountComponentType) {
  const { getSafeInfo } = useSafe();

  const safeInfo = getSafeInfo();

  // const publicClient = usePublicClient();

  // const client = createWalletClient({
  //   chain,
  //   transport: custom(publicClient!),
  // });

  // const config = safeInfo?.data?.address
  //   ? createConfig({
  //       chain: chain as any,
  //       provider: { request: client.request as any },
  //       signer: ownerAddress,
  //       safeAddress: safeInfo.data.address,
  //     })
  //   : undefined;

  // const { sendTransaction } = useSendTransaction({ config });
  const { sendTransaction } = useSendTransaction();

  const transactions = [
    {
      to: safeInfo?.data?.address as string,
      data: "0x",
      value: "0",
    },
  ];

  const { chains, switchChain } = useSwitchChain();

  console.log(
    "chain.name: ",
    chain.name,
    " address: ",
    safeInfo?.data?.address,
    " isDeployed: ",
    safeInfo?.data?.isDeployed
  );

  const walletUrl = `https://app.safe.global/home?safe=${
    chainShortname[chain.id]
  }:${safeInfo?.data?.address}`;

  // transaction + deploy
  async function deploySafeAccount() {
    switchChain({ chainId: chain.id });
    sendTransaction({ transactions });
  }

  return (
    <>
      <Image
        aria-hidden
        src={chainLogo}
        alt={`${chain.name} icon`}
        width={24}
        height={24}
      />{" "}
      {!!safeInfo?.data?.address ? (
        <>
          <a href={walletUrl} target={"_blank"}>
            {safeInfo?.data?.address}
          </a>{" "}
          {!safeInfo?.data?.isDeployed && (
            <button onClick={deploySafeAccount} className={styles.button}>
              Deploy Safe
            </button>
          )}
        </>
      ) : (
        <span>Loading...</span>
      )}
    </>
  );
}