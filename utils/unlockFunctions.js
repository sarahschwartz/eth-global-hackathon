import connectContract from "./connectContract";

export const grantKeys = async (lockAddress, wallets, timestamp) => {
  const timestamps = wallets.map(() => timestamp);
  // An array of expiration Timestamps for the keys being granted
  console.log("TIMSTAMPS", timestamps);
  // An array of receiving addresses
  console.log("WALLETS", wallets);

  // to do: import abi for public lock v10

  try {
    const { contract } = connectContract(lockAddress, abi);

    const txn = await contract.grantKeys(wallets, timestamps);
    console.log("Minting...", txn.hash);
    let wait = await txn.wait();
    console.log("Minted -- ", txn.hash);
    console.log("WAITED", wait);
  } catch (error) {
    console.log("ERROR", error);
  }
};
