import { useState } from "react";
import { useRouter } from "next/router";
import { purchaseKey } from "../utils/unlockFunctions";

export default function PurchaseKey({ lock }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      await purchaseKey(lock);
      setTimeout(() => {
        router.reload(window.location.pathname);
      }, 500);
    } catch (error) {
      console.log("ERROR", error);
    }
    setLoading(false);
  };

  return (
    <button
      className="inline-flex items-center rounded-md border border-transparent bg-emerald-700 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-75"
      onClick={handlePurchase}
      disabled={loading}
    >
      {loading ? "Loading..." : "Purchase key"}
    </button>
  );
}
