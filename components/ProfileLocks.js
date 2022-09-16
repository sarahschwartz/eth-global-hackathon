import ProfileLock from "./ProfileLock"

export default function DashboardLocks({ locks }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Browse Locks</h2>
      {locks.map((lock) => (
        <ProfileLock lock={lock} key={lock.id}/>
      ))}
    </div>
  );
}
