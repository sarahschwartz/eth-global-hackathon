export default function DashboardPosts({ pubs }) {
  return (
    <div className="mx-auto w-full mt-5 md:mt-8 pt-5 md:pt-8 border-t border-stone-300">
      <div className="flex flex-wrap justify-between items-center">
        <h5 className="text-lg text-stone-900 sm:text-xl font-cursive font-normal">
          My recent posts
        </h5>
        <a className="inline-flex items-center rounded-md border border-emerald-600 px-4 py-2 text-sm font-medium text-emerald-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
          View all
        </a>
      </div>
      <p className="text-stone-600 mt-2 mb-4">
        Recent content I&apos;ve made on Lens
      </p>
      {pubs.length > 0 ? (
        <>got stuff</>
      ) : (
        <div className="text-center rounded-lg border-2 border-dashed border-stone-300 p-12">
          <h3 className="mt-2 text-sm font-medium text-stone-900">No posts</h3>
          <p className="mt-1 text-sm text-stone-500">
            Get started by creating a new post
          </p>
        </div>
      )}
    </div>
  );
}
