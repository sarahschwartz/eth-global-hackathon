import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import { useRouter } from "next/router";
import Layout from "../../components/layout/Layout";

export default function Step3() {
  const router = useRouter();

  const { address } = useAccount();

  const [lensProfileId, setLensProfileId] = useState("");
  const [lensHandle, setLensHandle] = useState("");

  return (
    <Layout>
      <Head>
        <title>Make your homebase cozy</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mx-auto my-16 max-w-7xl px-4 sm:my-24 sm:px-6">
        <div className="mx-auto max-w-md sm:max-w-3xl">
          <h2 className="text-center text-3xl font-bold leading-8 tracking-tight text-stone-900 sm:text-4xl">
            Make your homebase cozy
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-stone-500">
            Dropping some alpha? Sharing your works in progress? Releasing
            exclusive bonus content? Let your fans know what to expect when they
            come chill at your homebase.
          </p>
          <div className="mx-auto w-full sm:max-w-md mt-5 md:mt-8">
            <form className="space-y-12">
              <div>
                <label
                  htmlFor="path"
                  className="block font-medium text-stone-700"
                >
                  Path to your homebase
                </label>
                <div className="mt-2 flex rounded-md shadow-sm">
                  <span className="inline-flex items-center rounded-l-md border border-r-0 border-stone-300 bg-stone-50 px-3 text-stone-500 sm:text-sm">
                    homebase.xyz/
                  </span>
                  <input
                    type="text"
                    name="path"
                    id="path"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-stone-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="about"
                  className="block font-medium text-stone-700"
                >
                  What&apos;s poppin&apos; at your homebase?
                </label>
                <div className="mt-2">
                  <textarea
                    id="about"
                    name="about"
                    rows={3}
                    className="block w-full rounded-md border-stone-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    defaultValue={""}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="photo"
                  className="block font-medium text-stone-700"
                >
                  Your homebase profile pic
                </label>
                <div className="mt-2 flex items-center">
                  <span className="h-12 w-12 overflow-hidden rounded-full bg-stone-100">
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
                    className="ml-5 rounded-md border border-stone-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-stone-700 shadow-sm hover:bg-stone-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Change
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="cover-photo"
                  className="block font-medium text-stone-700"
                >
                  Your homebase cover photo
                </label>
                <div className="mt-2 flex justify-center rounded-md border-2 border-dashed border-stone-300 px-6 pt-5 pb-6">
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-stone-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-stone-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                      >
                        <span>Upload a file</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-stone-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Continue
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
