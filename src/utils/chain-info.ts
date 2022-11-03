type Chain = {
  name: string;
  contract: string;
  alchemyUrl: string;
  webHookUrl: string;
};

export const chainInfo: Record<string, Chain> = {
  5: {
    name: "Goerli",
    contract: "0x58bC544C284cCF8f95Ee2BadCb0E56203D7cE674",
    alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_GOERLI as string,
    webHookUrl : process.env.NEXT_PUBLIC_GOERLI_WEBHOOK as string
  },
  80001: {
    name: "Mumbai",
    contract: "0xb50676dF038AFFE12373394D112e89DE28e7b7e3",
    alchemyUrl: process.env.NEXT_PUBLIC_ALCHEMY_MUMBAI as string,
    webHookUrl : process.env.NEXT_PUBLIC_MUMBAI_WEBHOOK as string
  },
};
