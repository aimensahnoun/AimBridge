// Styles import
import '../styles/globals.css'
import '@rainbow-me/rainbowkit/styles.css';

// NextJS import
import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic';

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
  useNetwork,
  WagmiConfig,
} from 'wagmi';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import Navbar from '@/components/navbar';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, ApolloLink, HttpLink } from '@apollo/client';


const DynamicNavbar = dynamic(() => import('@/components/navbar'), {
  ssr: false
})

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

const MumbaiGQL = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/aimensahnoun/aimbridgemumbai2"
})

const GoerliGQL = new HttpLink({
  uri: "https://api.thegraph.com/subgraphs/name/aimensahnoun/aimbridgegoerli2"
})

const GqlClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: ApolloLink.split(
    operation => {
      return operation.getContext().chain == 80001},
    MumbaiGQL,
    GoerliGQL
  )

})

export default function App({ Component, pageProps }: AppProps) {


  return <WagmiConfig client={wagmiClient}>
    <RainbowKitProvider coolMode={true} theme={darkTheme({
      accentColor: '#3E7BFA',
    })} chains={chains}>
      <ApolloProvider client={GqlClient}>

        <DynamicNavbar />
        <Component {...pageProps} />
      </ApolloProvider>
    </RainbowKitProvider>
  </WagmiConfig>
}
