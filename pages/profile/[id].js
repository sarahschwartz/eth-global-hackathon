import CreateLock from "../../components/CreateLock"
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Profile(){
    return(
        <div>
            <h1>Profile Page</h1>
            <ConnectButton/>
            <CreateLock/>
        </div>
    )
}