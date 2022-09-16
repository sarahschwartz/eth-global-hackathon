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

const LOCK_FROM_ADDRESS = `
    query($id: ID!) {
      lock(id: $id) {
        id
        address
        name
        price
        expirationDuration
        totalSupply
        maxNumberOfKeys
        owner
        keys{
          id
          owner
          expiration
        }
      }
    }
`;

export const getLockFromAddress = async (lockAddress) => {
  return apolloClient.query({
    query: gql(LOCK_FROM_ADDRESS),
    variables: {
      id: lockAddress ? lockAddress : "",
    },
    context: { clientName: "unlock-subgraph" }
  });
};

const IS_KEY_OWNER = `
    query($lockAddress: ID!, $keyOwner: ID!) {
      keys(where: {lock: $lockAddress, owner: $keyOwner}) {
        id
        lock {
          id
        }
        keyId
        owner {
          id
        }
      }
    }
`;

export const checkIfKeyOwner = async (lockAddress, walletAddress) => {
  return apolloClient.query({
    query: gql(IS_KEY_OWNER),
    variables: {
      lockAddress: lockAddress,
      keyOwner: walletAddress.toLowerCase(),
    },
    context: { clientName: "unlock-subgraph" }
  });
};


