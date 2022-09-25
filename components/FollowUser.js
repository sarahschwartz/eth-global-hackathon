import { useState } from "react";
import { lensHub } from "../utils/lensHub";

export default function FollowUser({ profile }) {
  const [loading, setLoading] = useState(false);
  const [notFollowing, setNotFollowing] = useState(!profile.isFollowedByMe);

  const follow = async () => {
    setLoading(true);
    try {
      let contract = lensHub();
      const tx = await contract.follow([profile.id], [0x0]);
      await tx.wait();
      console.log("Followed user successfully");
      setNotFollowing(false);
    } catch (err) {
      console.log("Failed to follow user due to", err);
      setNotFollowing(true);
    }
    setLoading(false);
  };

  return (
    <>
      {notFollowing ? (
        <button
          onClick={follow}
          disabled={loading}
          className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-75"
        >
          Follow
        </button>
      ) : (
        <span className="inline-flex items-center rounded-full border border-emerald-700 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-800">
          Following
        </span>
      )}
    </>
  );
}
