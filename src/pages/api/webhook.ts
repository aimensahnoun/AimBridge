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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<data>
) {
  const { selectedChainId } = req.body as Parameters;

  const result = await axios.post(chainInfo[selectedChainId].webHookUrl, {
    t: req.body.t,
    hash: req.body.hash,
    data: req.body.data,
  });

  const resultTx = JSON.parse(result.data.result);

  res.status(200).json({ tx: resultTx });
}
