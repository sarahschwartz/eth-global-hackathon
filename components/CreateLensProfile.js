import { useState } from "react";
import {
  createProfile,
} from "../utils/lensQueries";
import { loginWithLens } from "../utils/lensHub";
import { useRouter } from "next/router";

export default function CreateLensProfile(address) {
  const [lensHandle, setLensHandle] = useState("");
  const router = useRouter


  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      console.log("LOGGING IN")
      await loginWithLens();
      console.log("LOGGED IN!")
      const request = {
        handle: lensHandle,
      };
      const response = await createProfile(request);
      console.log("CREATED PROFILE!", response);
      router.push(`/dashboard/${lensHandle}`);
    } catch (error){
      console.log("ERROR", error)
    }
  };

  return (
    <div>
      <h2>Create a new lens profile</h2>
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
