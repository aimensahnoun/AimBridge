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
    contract: "0x4198e6BeB97dfe80e86A0c7CEFdeF1aDdD0a5687",
    alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_GOERLI as string,
    webHookUrl: process.env.NEXT_PUBLIC_GOERLI_WEBHOOK as string,
    explorer: "https://goerli.etherscan.io/tx/",
    subgraph: "https://api.thegraph.com/subgraphs/name/aimensahnoun/aimbridgegoerli2",
  },
  80001: {
    name: "Mumbai",
    contract: "0x3771E772A2716E3d3Db380A156921E786f10aA46",
    alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI as string,
    webHookUrl: process.env.NEXT_PUBLIC_MUMBAI_WEBHOOK as string,
    explorer: "https://mumbai.polygonscan.com/tx/",
    subgraph: "https://api.thegraph.com/subgraphs/name/aimensahnoun/aimbridgemumbai2"
  },
};
