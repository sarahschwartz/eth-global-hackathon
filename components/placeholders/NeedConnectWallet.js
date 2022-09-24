import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function NeedConnectWallet() {
  return (
    <div className="mx-auto max-w-md sm:max-w-3xl">
      <h1 className="text-center text-3xl leading-8 text-emerald-900 sm:text-4xl font-cursive font-normal">
        Connect your wallet
      </h1>
      <p className="mx-auto mt-4 max-w-3xl text-center text-xl text-stone-600">
        Connect your wallet to access your homebase.
      </p>
      <div className="flex flex-col items-center mt-5 md:mt-8">
        <ConnectButton />
      </div>
    </div>
  );
}
