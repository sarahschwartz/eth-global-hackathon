import connectContract from "./connectContract";
import abis from "./unlockABIs"

export const grantKeys = async (lockAddress, wallets, timestamp) => {
  const timestamps = wallets.map(() => timestamp);
  // An array of expiration Timestamps for the keys being granted
  console.log("TIMSTAMPS", timestamps);
  // An array of receiving addresses
  console.log("WALLETS", wallets);

  const abi = abis.PublicLock.v10.abi

  try {
    const { contract, signer } = connectContract(lockAddress, abi);
    const lockOwner = await signer.getAddress();
    const txn = await contract.grantKeys(wallets, timestamps, [lockOwner]);
    console.log("Minting...", txn.hash);
    let wait = await txn.wait();
    console.log("Minted -- ", txn.hash);
    console.log("WAITED", wait);
  } catch (error) {
    console.log("ERROR", error);
  }
};
