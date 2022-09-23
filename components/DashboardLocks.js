import LockDetails from "./LockDetails";
import GrantKeysForm from "./GrantKeysForm";
import UpdateLock from "./UpdateLock";

export default function DashboardLocks({ locks }) {
  return (
    <div>
      <h2 className="text-2xl font-bold">Your Published Locks</h2>
      {locks.map((lock) => (
        <div
          key={lock.id}
          className="p-4 my-8 mx-auto rounded-lg shadow-lg max-w-2xl "
        >
          <LockDetails lock={lock} />
          <GrantKeysForm lockAddress={lock.address} />
          <UpdateLock lockAddress={lock.address} />
        </div>
      ))}
    </div>
  );
}
