import { useState } from "react";
import { getProfiles, getFollowers } from "../utils/lensQueries";

export default function Test() {
  // address here defaults to donosonaumczuk.test
  const [addressForProfiles, setAddressForProfiles] = useState(
    "0x42a578e3557f5854B27D48E7d753fEb2f428546D"
  );
  const [profiles, setProfiles] = useState([]);

  // profile id here defaults to
  const [profileIdForFollowers, setProfileIdForFollowers] = useState("0x02");
  const [followers, setFollowers] = useState([]);

  async function fetchProfiles(e) {
    e.preventDefault();

    try {
      let response = await getProfiles({ ownedBy: [addressForProfiles] });
      console.log("fetchProfiles RESPONSE", response);
      setProfiles(response.data.profiles.items);
    } catch (error) {
      console.log("fetchProfiles ERROR:", error);
    }
  }

  async function fetchFollowers(e) {
    e.preventDefault();

    try {
      let response = await getFollowers(profileIdForFollowers);
      console.log("fetchFollowers RESPONSE", response);
      setFollowers(response.data.followers.items);
    } catch (error) {
      console.log("fetchFollowers ERROR:", error);
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {/* Fetch Lens profile by wallet address */}
      <div>
        <form className="space-y-6" onSubmit={fetchProfiles}>
          <h3>Fetch Lens profile by wallet address</h3>
          <div>
            <label
              htmlFor="wallet-address"
              className="block text-sm font-medium text-gray-700"
            >
              Wallet address
            </label>
            <div className="mt-1">
              <input
                id="wallet-address"
                name="wallet-address"
                type="text"
                value={addressForProfiles}
                onChange={(e) => setAddressForProfiles(e.target.value)}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Fetch
          </button>
        </form>
        {profiles.length > 0 && (
          <div>
            <h6>Fetched Lens profiles</h6>
            {profiles.map((profile) => (
              <p key={profile.id}>{profile.id}</p>
            ))}
          </div>
        )}
      </div>

      {/* Fetch my followers */}
      <div>
        <form className="space-y-6" onSubmit={fetchFollowers}>
          <h3>Fetch my followers</h3>
          <div>
            <label
              htmlFor="profile-id"
              className="block text-sm font-medium text-gray-700"
            >
              Lens profile id
            </label>
            <div className="mt-1">
              <input
                id="profile-id"
                name="profile-id"
                type="text"
                value={profileIdForFollowers}
                onChange={(e) => setProfileIdForFollowers(e.target.value)}
                className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Fetch
          </button>
        </form>
        {followers.length > 0 && (
          <div>
            <h6>My followers</h6>
            {followers.map((follower) => (
              <p key={follower.wallet.address}>{follower.wallet.address}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
