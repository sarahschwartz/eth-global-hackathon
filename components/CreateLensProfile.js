import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { createProfile, generateChallenge, authenticate } from "../utils/lensQueries";

export default function CreateLensProfile() {
  const [lensHandle, setLensHandle] = useState("");
  const { address } = useAccount();

  const login = async () => {
      const { ethereum } = window;
      
      if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          console.log("PROVIDER", provider)
          const signer = provider.getSigner();
          console.log("SIGNER", signer)
          const signerAddress = await signer.getAddress()
          console.log("SIGNER ADDRESS", signerAddress)
          // we request a challenge from the server
          const challengeResponse = await generateChallenge(address);
          console.log("CHALLENGE", challengeResponse)
          console.log("TEXT", challengeResponse.data.challenge.text)
          const signature = await signer.signMessage(challengeResponse.data.challenge.text)
          console.log("SIGNATURE", signature)
          const accessTokens = await authenticate(signerAddress, signature);
          console.log(accessTokens);
          localStorage.setItem("lens_auth_token", accessTokens.data.authenticate.accessToken)
        }
    
    // you now have the accessToken and the refreshToken
    // {
    //  data: {
    //   authenticate: {
    //    accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2NDUxMDQyMzEsImV4cCI6MTY0NTEwNjAzMX0.lwLlo3UBxjNGn5D_W25oh2rg2I_ZS3KVuU9n7dctGIU",
    //    refreshToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YjE5QzI4OTBjZjk0N0FEM2YwYjdkN0U1QTlmZkJjZTM2ZDNmOWJkMiIsInJvbGUiOiJyZWZyZXNoIiwiaWF0IjoxNjQ1MTA0MjMxLCJleHAiOjE2NDUxOTA2MzF9.2Tdts-dLVWgTLXmah8cfzNx7sGLFtMBY7Z9VXcn2ZpE"
    //   }
    // }
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log("HANDLE", lensHandle)
    // await login();

    const request = { 
        handle: lensHandle
    }
    const response = await createProfile(request);
    console.log("CREATED PROFILE?", response)

  };

  return (
    <div>
      <h2>Create a new lens profile</h2>
      <ConnectButton />
      <button onClick={login} >Login</button>
      {address && (
        <form onSubmit={handleSubmit}>
          <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:pt-5">
            <label
              htmlFor="lens-handle"
              className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
            >
              Lens Handle
            </label>
            <div className="mt-1 sm:mt-0 sm:col-span-2">
              <input
                id="lens-handle"
                name="lens-handle"
                type="text"
                className="block max-w-lg w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md"
                required
                value={lensHandle}
                onChange={(e) => setLensHandle(e.target.value)}
              />
            </div>
          </div>

          <button type="submit">Create a handle</button>
        </form>
      )}
    </div>
  );
}
