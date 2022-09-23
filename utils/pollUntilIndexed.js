import { hasTxBeenIndexed } from "./lensQueries"

const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

export default async function pollUntilIndexed(txHash) {
  while (true) {
    const result = await hasTxBeenIndexed(txHash);
    console.log('pool until indexed: result', result.data);

    const response = result.data.hasTxHashBeenIndexed;
    if (response.__typename === 'TransactionIndexedResult') {
      console.log('pool until indexed: indexed', response.indexed);
      console.log('pool until metadataStatus: metadataStatus', response.metadataStatus);

      if (response.metadataStatus) {
        if (response.metadataStatus.status === 'SUCCESS') {
          return response;
        }

        if (response.metadataStatus.status === 'METADATA_VALIDATION_FAILED') {
          throw new Error(response.metadataStatus.reason);
        }
      } else {
        if (response.indexed) {
          return response;
        }
      }

      console.log('pool until indexed: sleep for 1500 milliseconds then try again');
      // sleep for a second before trying again
      await sleep(1500);
    } else {
      // it got reverted and failed!
      throw new Error(response.reason);
    }
  }
};

