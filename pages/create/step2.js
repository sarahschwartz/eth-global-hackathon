import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import Layout from "../../components/layout/Layout";

export default function Step2() {
  const router = useRouter();

  const { address } = useAccount();

  const [lensHandle, setLensHandle] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // // console.log("HANDLE", lensHandle)
    // // await login();

    // const request = {
    //   handle: lensHandle,
    // };
    // const response = await createProfile(request);
    // console.log("CREATED PROFILE?", response);
    router.push("/create/step3");
  };

  return (
    <Layout>
      <Head>
        <title>Create your Lens profile</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto my-16 max-w-7xl px-4 sm:my-24 sm:px-6">
        <div className="mx-auto max-w-md sm:max-w-3xl">
          <h2 className="text-center text-3xl font-bold leading-8 tracking-tight text-stone-900 sm:text-4xl">
            Create your Lens profile
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-stone-600">
            Join the user-owned, decentralized web and grow your roots with
            Lens.
          </p>
          <div className="mx-auto w-full sm:max-w-md mt-5 md:mt-8">
            <form className="space-y-12" onSubmit={handleSubmit}>
              <div className="flex flex-col items-center space-y-4">
                <label
                  htmlFor="photo"
                  className="block text-sm font-medium text-stone-700 sr-only"
                >
                  Photo
                </label>
                <span className="h-32 w-32 overflow-hidden rounded-full bg-stone-100">
                  <svg
                    className="h-full w-full text-stone-300"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </span>
                <button
                  type="button"
                  className="rounded-md border border-stone-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Upload
                </button>
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-stone-700"
                >
                  Your handle
                </label>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                    @
                  </span>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    value={lensHandle}
                    onChange={(e) => setLensHandle(e.target.value)}
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-stone-300 px-3 py-2 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                  />
                </div>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Create Lens profile
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
