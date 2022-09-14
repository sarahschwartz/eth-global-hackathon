import { ethers } from "ethers"
export default function DashboardLocks({locks}){
    console.log("LOCKS!", locks)

    return (
      <div>
      <h2 className="text-2xl font-bold">Browse Locks</h2>
      {locks.map((lock) => (
        <div key={lock.id} className="py-4">
          <h3 className="text-xl font-bold">{lock.name}</h3>
          <p>Price: {ethers.utils.formatEther(lock.price)} MATIC</p>
        </div>
      ))}
    </div>
    )
}