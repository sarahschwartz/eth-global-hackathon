import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Layout from "../components/layout/Layout";

export default function Home() {
  const router = useRouter();

  const { address } = useAccount();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <Layout>
        <Head>
          <title>Home</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="mx-auto my-16 max-w-7xl px-4 sm:my-24 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-stone-900 sm:text-5xl md:text-6xl">
              <span className="block">Homebase for you and your fans</span>
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-stone-500 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Connect with your followers from all corners of the decentralized
              web in one place. Build a space where you can nurture deeper
              relationships with your fans.
            </p>
            <div className="mx-auto mt-5 max-w-md sm:flex sm:justify-center md:mt-8">
              {address ? (
                <button
                  type="button"
                  onClick={() => router.push("/create/step1")}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Get started
                </button>
              ) : (
                <ConnectButton />
              )}
            </div>
          </div>
        </div>
      </Layout>
    )
  );
}
