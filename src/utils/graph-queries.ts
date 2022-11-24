import { gql } from "@apollo/client";

export const GET_USER_HISTORY = gql`
  query userHistor($user: String!) {
    transferInitiateds(where: { user: $user }) {
      id
      user
      tokenAddress
      sourceChainId
      targetChainId
      amount
      timestamp
    }
    tokenMinteds(where: { user: $user }) {
      id
      user
      tokenAddress
      amount
      chainId
      timestamp
    }
    unWrappedTokens(where: { user: $user }) {
      id
      user
      nativeTokenAddress
      amount
      chainId
      timestamp
    }
    burnedTokens(where: { user: $user }) {
      id
      user
      tokenAddress
      amount
      chainId
      timestamp
    }
  }
`;
