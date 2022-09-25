import ProfilePublication from "./ProfilePublication";

export default function ProfilePublications({ pubs }) {
  return (
    <ul role="list" className="space-y-4">
      {pubs.map((p, index) => (
        <ProfilePublication key={p.id} pub={p} index={index} />
      ))}
    </ul>
  );
}
