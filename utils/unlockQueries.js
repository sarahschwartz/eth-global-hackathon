import { apolloClient } from "../apollo-client";
import { gql } from "@apollo/client";

const LOCKS_BY_USER = `
    query($owner: Bytes!) {
      locks(where: {owner: $owner}) {
        id
        address
        name
        price
        expirationDuration
        totalSupply
        maxNumberOfKeys
        owner
      }
    }
`;

export const getLocksByUser = async (address) => {
  return apolloClient.query({
    query: gql(LOCKS_BY_USER),
    variables: {
      owner: address ? address : "",
    },
    context: { clientName: "unlock-subgraph" }
  });
};
