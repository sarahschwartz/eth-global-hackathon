import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import Link from "next/link";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    mounted && (
      <Layout>
        <Head>
          <title>Homebase</title>
        </Head>

        <div className="mx-auto my-8 max-w-7xl px-4 sm:my-12 sm:px-6">
          <div className="text-center">
            <h1 className="text-4xl text-emerald-800 sm:text-5xl md:text-6xl font-cursive font-normal">
              Homebase for you and your fans
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-stone-600 sm:text-lg md:mt-5 md:max-w-3xl md:text-xl">
              Nurture deeper relationships with your fans from all corners of
              the decentralized web in one place.
            </p>
            <div className="mx-auto my-5 max-w-md sm:flex sm:justify-center md:my-8">
              <Link href="/login">
                <a className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                  Get started
                </a>
              </Link>
            </div>
            <Image width="800" height="400" src="/assets/home.png" alt="Home" />
          </div>
        </div>
      </Layout>
    )
  );
}
