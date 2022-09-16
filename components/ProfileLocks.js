import ProfileLock from "./ProfileLock"

export default function DashboardLocks({ locks }) {
  return (
    <div className="">
      <h2 className="text-2xl font-bold">Browse Locks</h2>
      <div className="flex">
      {locks.map((lock) => (
        <ProfileLock lock={lock} key={lock.id}/>
      ))}
      </div>
    </div>
  );
}
