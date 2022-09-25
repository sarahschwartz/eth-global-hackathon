import ProfileLock from "./ProfileLock";

export default function ProfileLocks({ lensHandle, locks }) {
  return (
    <>
      <h4 className="text-lg font-cursive font-normal mt-6">
        Browse memberships
      </h4>
      <p className="text-stone-600 mt-2 mb-6">
        Snag a membership to unlock private content by @{lensHandle}!
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {locks.map((lock) => (
          <ProfileLock lock={lock} key={lock.id} />
        ))}
      </div>
    </>
  );
}
