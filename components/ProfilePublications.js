import LockedContent from "./LockedContent";

const mockPubs = [
  {
    __typename: "Post",
    id: "0x4612-0x0a",
    profile: {
      __typename: "Profile",
      id: "0x4612",
      name: null,
      bio: null,
      attributes: [],
      isFollowedByMe: false,
      isFollowing: false,
      followNftAddress: null,
      metadata: null,
      isDefault: false,
      handle: "terppps.test",
      picture: null,
      coverPicture: null,
      ownedBy: "0xE54D28FD942744A28fbD4Dd68Ddd9570CBA947e7",
      dispatcher: null,
      stats: {
        __typename: "ProfileStats",
        totalFollowers: 0,
        totalFollowing: 0,
        totalPosts: 3,
        totalComments: 0,
        totalMirrors: 0,
        totalPublications: 3,
        totalCollects: 0,
      },
      followModule: null,
    },
    stats: {
      __typename: "PublicationStats",
      totalAmountOfMirrors: 0,
      totalAmountOfCollects: 0,
      totalAmountOfComments: 0,
    },
    metadata: {
      __typename: "MetadataOutput",
      name: "Custom attributes",
      description: "testing custom attributes",
      content: "This content requires a Homebase key",
      media: [],
      attributes: [
        {
          __typename: "MetadataAttributeOutput",
          displayType: "string",
          traitType: "access",
          value: "private",
        },
        {
          __typename: "MetadataAttributeOutput",
          displayType: "string",
          traitType: "dbRef",
          value: "12345",
        },
        {
          __typename: "MetadataAttributeOutput",
          displayType: "string",
          traitType: "lockAddress1",
          value: "0xb30b2fc2f5cfc045ddaae98270dca075c9b8a63b",
        },
        {
          __typename: "MetadataAttributeOutput",
          displayType: "string",
          traitType: "lockAddress2",
          value: "0x2516152fab0217e2cc8961d8b5762dcf84b82e32",
        },
      ],
    },
    createdAt: "2022-09-21T17:37:44.000Z",
    collectModule: {
      __typename: "FreeCollectModuleSettings",
    },
    referenceModule: null,
    appId: "homebase420",
    hidden: false,
    reaction: null,
    mirrors: [],
    hasCollectedByMe: false,
  },
];

export default function ProfilePublications({ pubs }) {
  console.log("ACTUAL PUBS", pubs)

  return (
    <div className="border-t-2 border-gray-100 my-8 py-8 flex flex-col space-y-8">
      {mockPubs.map((p, index) => (
        <div key={p.id}>
          {p.__typename === "Post" && (
            <div>
              <p className="font-bold">{p.metadata.name}</p>
              <p>{p.metadata.content}</p>
              {p.metadata.attributes[0].traitType === "access" && p.metadata.attributes[0].value === "private" && <div>
                Private Content
                <LockedContent dbRef={p.metadata.attributes[1].value} />
              </div>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
