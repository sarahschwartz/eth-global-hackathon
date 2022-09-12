export default function ProfileDetails({profile}){
    return (
        <div>
          <h2>{profile.name}</h2>
          <h3>{profile.handle}</h3>
          <div className="flex flex-wrap gap-x-2 text-gray-600 text-sm sm:text-base mb-4 justify-center md:justify-start">
            <p>
              <span className="text-gray-900 font-medium">
                {profile.stats.totalFollowers}
              </span>{" "}
              Followers
            </p>
            <p>
              <span className="text-gray-900 font-medium">
                {profile.stats.totalFollowing}
              </span>{" "}
              Following
            </p>
          </div>
          <p className="mb-4">{profile.bio}</p>
        </div>
    )
}