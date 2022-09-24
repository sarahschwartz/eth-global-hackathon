import { lensHub } from "../utils/lensHub";
export default function FollowUser({profileIdToFollow}){

    const follow = async () => {
        try {
            let contract = lensHub()
            const tx = await contract.follow([profileIdToFollow], [0x0]);
            await tx.wait();
            console.log("Followed user successfully");
          } catch (err) {
            console.log("Failed to follow user due to", err);
          }
    }
    
    return (
        <button onClick={follow} className="bg-blue-600 text-white px-4 py-2">
            Follow
        </button>
    )
}