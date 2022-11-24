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

export const parseDate = (date : any) => {
  // Parse epoch (second timestamp) to day month (Jan), year (2020) and time (12:00)
  const parsedDate = new Date(date * 1000);
  
  const day = parsedDate.getDate();
  const month = parsedDate.toLocaleString('default', { month: 'short' });
  const year = parsedDate.getFullYear();
  const time = parsedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return `${day} ${month}, ${year} ${time}`;
};
