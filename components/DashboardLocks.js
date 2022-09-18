import UploadContent from "./UploadContent"
import GrantKeysForm from "./GrantKeysForm"
import UpdateLock from "./UpdateLock"
// import LockContent from "./LockContent"

export default function DashboardLocks({locks}){
    return (
      <div>
      <h2 className="text-2xl font-bold">Your Published Locks</h2>
      {locks.map((lock) => (
        <div key={lock.id} className="p-4 my-8 mx-auto rounded-lg shadow-lg max-w-2xl ">
          <h3 className="text-xl font-bold">{lock.name}</h3>
          {/* <LockContent lockAddress={lock.address} /> */}
          {/* <UploadContent lockAddress={lock.address} /> */}
          <GrantKeysForm lockAddress={lock.address} />
          <UpdateLock lockAddress={lock.address} />
        </div>
      ))}
    </div>
    )
}