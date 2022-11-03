import { BigNumber } from "ethers";
import { atom } from "jotai";
import { Chain } from "wagmi";
import { Erc20Token } from "./types";

export const navbarHeightAtom = atom<number>(0);
export const selectedTargetChainAtom = atom<Chain | null>(null);
export const selectedTokenAtom = atom<Erc20Token | null>(null);
export const amountAtom = atom<BigNumber | null>(null);
export const selectedSourceChainAtom = atom<Chain | null>(null);
