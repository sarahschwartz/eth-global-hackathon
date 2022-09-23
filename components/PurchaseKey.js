import { purchaseKey } from "../utils/unlockFunctions"

export default function PurchaseKey({lock}){    
    const handlePurchase = async () => {
        await purchaseKey(lock);
    }

    return(
        <button 
        className="my-4 border-2 hover:bg-green-500 hover:text-white border-green-500 px-4 py-2"
        onClick={handlePurchase}
        >
            Purchase Key
        </button>
    )
}