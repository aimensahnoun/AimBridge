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
    contract: "0x62Ec8f234E5583d267c4Fbcba2D536d3EA043986",
    alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_GOERLI as string,
    webHookUrl: process.env.NEXT_PUBLIC_GOERLI_WEBHOOK as string,
    explorer: "https://goerli.etherscan.io/tx/",
  },
  80001: {
    name: "Mumbai",
    contract: "0x7957BfB53E91329E9A5C332Fd932d2172209c120",
    alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI as string,
    webHookUrl: process.env.NEXT_PUBLIC_MUMBAI_WEBHOOK as string,
    explorer: "https://mumbai.polygonscan.com/tx/",
  },
};
