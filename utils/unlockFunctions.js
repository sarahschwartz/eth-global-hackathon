import connectContract from "./connectContract";
import abis from "./unlockABIs";
import { ethers } from "ethers";

const abi = abis.PublicLock.v10.abi;
// to do : look up abi by version to make compatible with all versions

export const grantKeys = async (lockAddress, wallets, timestamp) => {
  const timestamps = wallets.map(() => timestamp);
  // Timestamps: An array of expiration Timestamps for the keys being granted
  // Wallets: An array of receiving addresses

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

export const purchaseKey = async (lock) => {
  // to do: add support for if ERC20
  // array of tokens amount to pay for this purchase >= the current keyPrice - any applicable discount
  // (_values is ignored when using ETH)
  const values = [];
  // optional array of addresses to grant managing rights to a specific address on creation
  const keyManagers = [lock.owner];
  // array of arbitrary data populated by the front-end which initiated the sale
  const data = [[]];

  // try {
  const { contract, signer } = connectContract(lock.address, abi);
  console.log("CONTRACT", contract);
  // array of addresses of the recipients of the purchased key
  const recipientAddress = await signer.getAddress();
  const recipients = [recipientAddress];
  // array of addresses of the users making the referral
  const referrers = keyManagers;
  const txn = await contract.purchase(
    values,
    recipients,
    referrers,
    keyManagers,
    data,
    { value: lock.price }
  );
  console.log("Minting...", txn.hash);
  let wait = await txn.wait();
  console.log("Minted -- ", txn.hash);
  console.log("WAITED", wait);
  // } catch (error) {
  //   console.log("ERROR", error);
  // }
};

export const updateLockName = async (lockAddress, newName) => {
  try {
    const { contract, signer } = connectContract(lockAddress, abi);
    const txn = await contract.updateLockName(newName);
    console.log("Minting...", txn.hash);
    let wait = await txn.wait();
    console.log("Minted -- ", txn.hash);
    console.log("WAITED", wait);
  } catch (error) {
    console.log("ERROR", error);
  }
};

export const updateKeyPrice = async (lockAddress, newPrice, tokenAddress) => {
  // tokenAddress is the address of the erc20 token to use for pricing the keys, or 0 to use ETH
  if (!tokenAddress) {
    tokenAddress = 0;
  }
  try {
    const { contract } = connectContract(lockAddress, abi);
    const txn = await contract.updateKeyPricing(newPrice, tokenAddress);
    console.log("Minting...", txn.hash);
    let wait = await txn.wait();
    console.log("Minted -- ", txn.hash);
    console.log("WAITED", wait);
  } catch (error) {
    console.log("ERROR", error);
  }
};

export const updateMaxKeys = async (lockAddress, newMaxKeys) => {
  try {
    const { contract } = connectContract(lockAddress, abi);
    const txn = await contract.setMaxNumberOfKeys(newMaxKeys);
    console.log("Minting...", txn.hash);
    let wait = await txn.wait();
    console.log("Minted -- ", txn.hash);
    console.log("WAITED", wait);
  } catch (error) {
    console.log("ERROR", error);
  }
};

export const getMaxKeys = async (lockAddress) => {
  try {
    const { contract } = connectContract(lockAddress, abi);
    const keys = await contract.maxNumberOfKeys();
    return ethers.BigNumber.from(keys).toNumber();
  } catch (error) {
    console.log("ERROR", error);
  }
};

export const getTotalSupply = async (lockAddress) => {
  try {
    const { contract } = connectContract(lockAddress, abi);
    const supply = await contract.totalSupply();
    return ethers.BigNumber.from(supply).toNumber();
  } catch (error) {
    console.log("ERROR", error);
  }
};
