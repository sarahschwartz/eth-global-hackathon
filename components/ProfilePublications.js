import ProfilePublication from "./ProfilePublication";

export default function ProfilePublications({ pubs }) {

  return (
    <div className="border-t-2 border-gray-100 my-8 py-8 flex flex-col space-y-8">
      {pubs.map((p, index) => (
        <div key={p.id}>
          <ProfilePublication pub={p} index={index}/>
        </div>
      ))}
    </div>
  );
}
