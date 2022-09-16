import { ethers } from "ethers";
import Link from "next/link";

export default function ProfileLocks({ lock }) {

  return (
        <Link href={`/locks/${lock.address}`}>
          <div className="cursor-pointer p-4 my-8 rounded-lg shadow-lg max-w-2xl">
            <h3 className="text-xl font-bold">{lock.name}</h3>
            <p>Price: {ethers.utils.formatEther(lock.price)} MATIC</p>          
          </div>
        </Link>
  )
}
