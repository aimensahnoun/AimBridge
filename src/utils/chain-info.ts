type Chain = {
  name: string;
  contract: string;
  alchemyUrl: string;
  webHookUrl: string;
  explorer: string;
  subgraph: string;
};

export const chainInfo: Record<string, Chain> = {
  5: {
    name: "Goerli",
    contract: "0xa30aaaE39586Ee5Ac81D23F82eb422B62a237dC7",
    alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_GOERLI as string,
    webHookUrl: process.env.NEXT_PUBLIC_GOERLI_WEBHOOK as string,
    explorer: "https://goerli.etherscan.io/tx/",
    subgraph: "https://api.thegraph.com/subgraphs/name/aimensahnoun/aimbridgegoerli2",
  },
  80001: {
    name: "Mumbai",
    contract: "0x45b6467180de2D9ac3290BC880D7f5faAd09E26a",
    alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI as string,
    webHookUrl: process.env.NEXT_PUBLIC_MUMBAI_WEBHOOK as string,
    explorer: "https://mumbai.polygonscan.com/tx/",
    subgraph: "https://api.thegraph.com/subgraphs/name/aimensahnoun/aimbridgemumbai2"
  },
};
