import { getSigner } from './ethers-service.js';
import { ethers } from 'ethers';
import LENS_HUB_ABI from "./lensABI.json"
import { generateChallenge, authenticate } from './lensQueries.js';

const LENS_HUB_CONTRACT_ADDRESS = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82";

// lens contract info can all be found on the deployed
// contract address on polygon.
// not defining here as it will bloat the code example
export const lensHub = () => {
  let contract = new ethers.Contract(
  LENS_HUB_CONTRACT_ADDRESS,
  LENS_HUB_ABI,
  getSigner()
)

return contract
}

export const loginWithLens = async () => {
  const { ethereum } = window;

  if (ethereum) {
    console.log("HERE")
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();

    // we request a challenge from the server
    const challengeResponse = await generateChallenge(signerAddress);
    console.log("CHALLENGE RESP", challengeResponse)
    const signature = await signer.signMessage(
      challengeResponse.data.challenge.text
      );
      const accessTokens = await authenticate(signerAddress, signature);
      console.log("ACCESS TOKENS", accessTokens)

    localStorage.setItem(
      "lens_auth_token",
      accessTokens.data.authenticate.accessToken
    );
  }

  // you now have the accessToken and the refreshToken
  // {
  //  data: {
  //   authenticate: {
  //    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2NDUxMDQyMzEsImV4cCI6MTY0NTEwNjAzMX0.lwLlo3UBxjNGn5D_W25oh2rg2I_ZS3KVuU9n7dctGIU",
  //    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJyZWZyZXNoIiwiaWF0IjoxNjQ1MTA0MjMxLCJleHAiOjE2NDUxOTA2MzF9.2Tdts-dLVWgTLXmah8cfzNx7sGLFtMBY7Z9VXcn2ZpE"
  //   }
  // }
};
