import Link from "next/link";
import LockDetails from "../LockDetails";

export default function DashboardLocks({ locks }) {
  return (
    <div className="mx-auto w-full mt-5 md:mt-8 pt-5 md:pt-8 border-t border-stone-300">
      <div className="flex flex-wrap justify-between items-center">
        <h2 className="text-lg text-stone-900 sm:text-xl font-cursive font-normal">
          My home locks
        </h2>
        <Link href="/locks/create">
          <a className="inline-flex items-center rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm hover:bg-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            Create lock
          </a>
        </Link>
      </div>
      <p className="text-stone-600 mt-2 mb-5">
        Memberships that I&apos;ve set up to grant access to my private content.
      </p>
      {locks.length > 0 ? (
        <ul role="list" className="-my-5 divide-y divide-stone-300">
          {locks.map((lock) => (
            <li key={lock.id} className="py-4">
              <LockDetails lock={lock} />
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center rounded-lg border-2 border-dashed border-stone-300 p-12">
          <h3 className="mt-2 text-sm font-medium text-stone-900">No locks</h3>
          <p className="mt-1 text-sm text-stone-500">
            Create a lock to set up memberships for your homebase
          </p>
        </div>
      )}
    </div>
  );
}
