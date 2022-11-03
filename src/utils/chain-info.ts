type Chain = {
  name: string;
  contract: string;
  alchemyUrl: string;
  webHookUrl: string;
  explorer: string;
};

export const chainInfo: Record<string, Chain> = {
  5: {
    name: "Goerli",
    contract: "0x18771a45c1ce701AC329675dc6Fe913880B757fE",
    alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_GOERLI as string,
    webHookUrl: process.env.NEXT_PUBLIC_GOERLI_WEBHOOK as string,
    explorer: "https://goerli.etherscan.io/tx/",
  },
  80001: {
    name: "Mumbai",
    contract: "0x34c5A670835556F4150841e4Af1736f2e5d55d62",
    alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI as string,
    webHookUrl: process.env.NEXT_PUBLIC_MUMBAI_WEBHOOK as string,
    explorer: "https://mumbai.polygonscan.com/tx/",
  },
};
