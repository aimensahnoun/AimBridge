import axios from "axios";
import { useToken } from "wagmi";
import { chainInfo } from "./chain-info";

export const getAllErc20Tokens = async (address: string, chainId: number) => {
  const data = JSON.stringify({
    jsonrpc: "2.0",
    method: "alchemy_getTokenBalances",
    headers: {
      "Content-Type": "application/json",
    },
    params: [`${address}`, "erc20"],
    id: chainId,
  });

  const config = {
    method: "post",
    url: chainInfo[chainId].alchemyUrl,
    headers: {
      "Content-Type": "application/json",
    },
    data: data,
  };

  const response = await axios(config);

  const result = response.data.result;

  const nonZeroBalances = result["tokenBalances"].filter((token: any) => {
    return token["tokenBalance"] !== "0";
  });

  let i = 1;

  const tokenList: any[] = [];

  // Loop through all tokens with non-zero balance
  for (let token of nonZeroBalances) {
    // Get balance of token
    let balance = token["tokenBalance"];

    const metadataParams = JSON.stringify({
      jsonrpc: "2.0",
      method: "alchemy_getTokenMetadata",
      params: [`${token["contractAddress"]}`],
      id: chainId,
    });

    const metadataConfig = {
      method: "post",
      url: chainInfo[chainId].alchemyUrl,
      headers: {
        "Content-Type": "application/json",
      },
      data: metadataParams,
    };

    const result2 = await axios(metadataConfig);

    const tokenData = result2.data.result;

    console.log(tokenData)

    balance = balance / Math.pow(10, tokenData["decimals"]);
    balance = balance.toFixed(2);

    const tokenInfo = {
      address: token["contractAddress"],
      name: tokenData["name"],
      symbol: tokenData["symbol"],
      decimals: tokenData["decimals"],
      logo: tokenData["logo"],
      balance: balance,
    };

    tokenList.push(tokenInfo);
  }

  return tokenList;
};
