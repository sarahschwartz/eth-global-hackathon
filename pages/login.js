import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { generateChallenge, authenticate } from "../utils/lensQueries";
import { loginWithLens } from "../utils/lensHub";
import Layout from "../components/layout/Layout";

export default function Login() {
  const router = useRouter();

  const { address } = useAccount();

  const login = async () => {
    try {
      await loginWithLens();
      router.push("/create");
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Login | Homebase</title>
      </Head>

      <div className="mx-auto my-2 max-w-7xl px-4 sm:my-4 sm:px-6">
        <div className="text-center mx-auto max-w-md sm:max-w-3xl">
          <Image
            width="200"
            height="160"
            src="/assets/plant.png"
            alt="Plant"
            className="mb-4"
          />
          <h1 className="text-3xl leading-8 text-emerald-800 sm:text-4xl font-cursive font-normal">
            Connect to Lens
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-stone-500">
            Your homebase is powered by Lens, the composable and decentralized
            social graph of web3. Connect your wallet and sign in to Lens to get
            started.
          </p>
          <div className="mx-auto my-5 max-w-md sm:flex sm:justify-center md:my-8">
            {address ? (
              <button
                type="button"
                onClick={login}
                className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
              >
                Connect to Lens
              </button>
            ) : (
              <ConnectButton />
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
