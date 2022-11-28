import * as Bridge from "./Bridge.json";
import * as ERC20 from "./WrapperToken.json";
import { chainInfo } from "@/utils/chain-info";
import { ethers } from "ethers";




export const contractConfig = (chainId: number) => {
  return {
    address: chainInfo[chainId]?.contract,
    abi: Bridge.abi,
  };
};


