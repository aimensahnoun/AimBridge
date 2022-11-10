// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";

type Parameters = {
  symbol: string;
  tokenName: string;
  to: string;
  amount: string;
  tokenAddress: string;
  contractAddress: string;
  type: string;
  selectedChainId: string;
};

type data = {
  tx?: string;
  error?: any;
};

import { chainInfo } from "../../utils/chain-info";

const hash = (body: any, secret: string) => {
  const encrypted = crypto
    .createHash("sha256")
    .update(secret + body)
    .digest("hex");

  return encrypted;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<data>
) {
  const {
    symbol,
    tokenName,
    to,
    amount,
    tokenAddress,
    contractAddress,
    type,
    selectedChainId,
  } = req.body as Parameters;

  const transactionSecret = process.env.WEBHOOK_SECRET as string;

  const timeStamp = Math.floor(Date.now() / 1000);

  let data = {
    t: timeStamp,
    content: req.body,
  };

  const hashed = hash(JSON.stringify(data), transactionSecret);

  console.log({
    t: timeStamp,
    hash: hashed,
    data: req.body,
  });

  const result = await axios.post(chainInfo[selectedChainId].webHookUrl, {
    t: timeStamp,
    hash: hashed,
    data: req.body,
  });

  const resultTx = JSON.parse(result.data.result);

  res.status(200).json({ tx: resultTx });
}
