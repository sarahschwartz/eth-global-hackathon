import { getSigner } from './ethers-service.js';
import { LENS_HUB_ABI, LENS_HUB_CONTRACT_ADDRESS } from "./lens-config"
import { ethers } from 'ethers';


// lens contract info can all be found on the deployed
// contract address on polygon.
// not defining here as it will bloat the code example
export const lensHub = () => {
  let contract = new ethers.Contract(
  LENS_HUB_CONTRACT_ADDRESS,
  LENS_HUB_ABI,
  getSigner()
)

console.log("CONTRACT", contract)
return contract

}