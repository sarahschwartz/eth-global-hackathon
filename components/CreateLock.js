import { ethers } from "ethers";
import connectContract from "../utils/connectContract";
import abis from "../utils/unlockABIs";


export default function CreateLock() {

  const createUpgradeableLock = async () => {
    try {
      const { contract, signer } = connectContract(
        "0x1FF7e338d5E582138C46044dc238543Ce555C963"
      );
      const lockCreator = await signer.getAddress();

      const defaultParams = {
        expirationDuration: ethers.BigNumber.from(60 * 60 * 24 * 30), // 30 days
        keyPrice: ethers.utils.parseEther("0.001"), // in wei
        maxNumberOfKeys: 100,
        lockName: "Another Unlock Lock",
      };

      const lockParams = [
        defaultParams.expirationDuration,
        ethers.constants.AddressZero,
        defaultParams.keyPrice,
        defaultParams.maxNumberOfKeys,
        defaultParams.lockName,
      ];

      const lockVersion = 10;
      const version = `v${lockVersion}`;

      const lockAbi = abis.PublicLock[version].abi;
      const lockInterface = new ethers.utils.Interface(lockAbi);

      const calldata = lockInterface.encodeFunctionData(
        "initialize(address,uint256,address,uint256,uint256,string)",
        [lockCreator, ...lockParams]
      );

      const txn = await contract.createUpgradeableLockAtVersion(
        calldata,
        lockVersion
      );
      console.log("Minting...", txn.hash);
      let wait = await txn.wait();
      console.log("Minted -- ", txn.hash);
      console.log("WAITED", wait);
    } catch (error) {
      console.log("CAUGHT ERROR!", error);
    }
  };

  return (
    <div>
      <button 
      class="my-4 border-2 hover:bg-green-500 hover:text-white border-green-500 px-4 py-2"
      onClick={createUpgradeableLock}
      >
        Create Lock
      </button>
    </div>
  );
}
