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
  privateKey: string;
};

type data = {
  tx?: string;
  error?: any;
};

import { chainInfo } from "../../utils/chain-info";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<data>
) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  const secretKey = process.env.NEXT_PUBLIC_API_SECRET_KEY;

  const { selectedChainId, privateKey } = req.body as Parameters;

  if (privateKey === undefined || privateKey !== secretKey) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const result = await axios.post(chainInfo[selectedChainId].webHookUrl, {
    t: req.body.t,
    hash: req.body.hash,
    data: req.body.data,
  });

  const resultTx = JSON.parse(result.data.result);

  res.status(200).json({ tx: resultTx });
}
