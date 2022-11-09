import { gql } from "@apollo/client";

export const GET_USER_HISTORY = gql`
    query userHistor($user : String!) {
        transferInitiateds(where:{
            user : $user
          }){
            id,
            user,
            tokenAddress,
            sourceChainId,
            targetChainId,
            amount
          },
          transferCompleteds(where:{
            user : $user
          }){
            id,
            user,
            tokenAddress,
            amount,
            chainId
          },
          uwrappedTokens(where:{
            user : $user
          }){
            id,
            user,
            nativeTokenAddress,
            amount,
            chainId
          },
          burnedTokens(where:{
            user : $user
          }){
            id,
            user,
            tokenAddress,
            amount,
            chainId
          },
    }
`;

