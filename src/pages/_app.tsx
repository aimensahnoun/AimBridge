// Styles import
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';

// NextJS import
import type { AppProps } from 'next/app'

// Dependencies import
import {
  darkTheme,
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import {
  chain,
  configureChains,
  createClient,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Navbar from '@/components/navbar';

const { chains, provider } = configureChains(
  [chain.polygonMumbai, chain.goerli],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_KEY }),
    publicProvider()
  ]
);
const { connectors } = getDefaultWallets({
  appName: 'AimBridge',
  chains
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider
})

export default function App({ Component, pageProps }: AppProps) {
  return <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider theme={darkTheme({
      accentColor: '#3E7BFA',
    })} chains={chains}>
      <Navbar />
      <Component {...pageProps} />
    </RainbowKitProvider>
  </WagmiConfig>
}
