import * as Bridge from "./Bridge.json";
import { chainInfo } from "@/utils/chain-info";

export const contractConfig = (chainId: number) => {
  return {
    address: chainInfo[chainId]?.contract,
    abi: Bridge.abi,
  };
};
