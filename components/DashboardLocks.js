export default function DashboardLocks(){

    const QUERY = `{
        unlockEntities(where: {lockOwner: ${address}}) {
          id
          count
          lockOwner
          newLockAddress
        }
      }`


    return (
        <div>
            All Locks
        </div>
    )
}