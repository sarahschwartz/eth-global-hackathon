import Link from "next/link";

export default function NeedProfile() {
  return (
    <div className="mx-auto max-w-md sm:max-w-3xl my-8 sm:my-12">
      <h1 className="text-center text-3xl leading-8 text-emerald-800 sm:text-4xl font-cursive font-normal">
        Need a Lens profile?
      </h1>
      <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-stone-600">
        You will need a Lens profile to start building your homebase.
      </p>
      <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
        <Link href="/login">
          <a className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
            Get started
          </a>
        </Link>
      </div>
    </div>
  );
}
