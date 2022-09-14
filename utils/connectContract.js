import unlockABI from "./unlockABIs.json";
import { ethers } from "ethers";

function connectContract(contractAddress, abi) {
    let contractABI
    if(abi){
      contractABI = abi;
    } else if(contractAddress === "0x1FF7e338d5E582138C46044dc238543Ce555C963"){
        contractABI = unlockABI
    }

    let contract;
    let signer;
    try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          signer = provider.getSigner();
          contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          ); // instantiating new connection to the contract
        } else {
          throw new Error('Please connect to the Polygon Mumbai network.')
        }
      } catch (error) {
        console.log("ERROR:", error);
      }
    //   return rsvpContract;
    return {
        contract,
        signer
    }
  }
  
  export default connectContract;
  