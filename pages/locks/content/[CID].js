import ShowContent from "../../../components/ShowContent";
import { useRouter } from "next/router";

export default function ShowLockContent(){
    const router = useRouter();
    const { CID } = router.query;

    return (
        <div>
            {CID && <ShowContent CID={CID}/>}
        </div>
    )
}