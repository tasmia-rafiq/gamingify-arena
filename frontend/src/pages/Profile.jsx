import { Link, useSearchParams, useParams } from "react-router-dom";
import { useAuthContext } from "../contexts/AuthContext";
import UserAvatar from "../components/ui/UserAvatar";
import { usePosts } from "../hooks/usePosts";
import PostGrid from "../components/posts/PostGrid";
import PostSkeleton from "../components/posts/PostSkeleton";
import { useUserProfile } from "../hooks/useUserProfile";
import { useState } from "react";
import { Edit, Plus } from "lucide-react";
import Pagination from "../components/posts/Pagination";

const Profile = () => {
  const { user } = useAuthContext();

  const [tab, setTab] = useState("posts"); // posts | top | activity

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;

  const { id: paramId } = useParams();

  // viewId can be username or id; useUserProfile (server) will resolve both
  const viewId = paramId || user?._id;

  // Fetch profile details (counts)
  const {
    data: profileData,
    isLoading: profileLoading,
    isError: profileError,
    followMutate,
    unfollowMutate,
  } = useUserProfile(viewId);

  // Fetch user's posts (for the viewed profile)
  const { data, isLoading, isError } = usePosts({
    author: viewId,
    page,
    limit: 5,
  });

  const meta = data?.meta;

  const { data: topData, isLoading: topLoading } = usePosts({
    author: viewId,
    sort: "popular",
    limit: 6,
  });

  const posts = data?.data || [];
  const topPosts = topData?.data || [];

  const profile = profileData?.user;

  const total = profileData?.counts?.posts || data?.meta?.total || posts.length;
  const followers = profileData?.counts?.followers || 0;
  const following = profileData?.counts?.following || 0;

  const isOwner =
    !paramId ||
    (user &&
      profile &&
      (user._id === profile._id || user.username === paramId));
  const isFollowing =
    profile &&
    user &&
    profile.followers?.some((f) => f.toString() === user._id.toString());

  if (isError || profileError) {
    return (
      <div className="container mx-auto py-12 text-center">
        <p className="text-red-400">
          Failed to load your profile. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <section className="container mx-auto py-12 px-4">
      <div className="bg-bg rounded-xl mb-8">
        <div className="px-6 py-8">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="-mt-12">
              <UserAvatar
                user={profile || user}
                className="size-28 text-3xl border-4 border-bg shadow-md"
              />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">
                {profile?.fullname ||
                  profile?.username ||
                  user?.fullname ||
                  user?.username}
              </h1>
              <p className="text-sm text-slate-300 mt-1">
                @{profile?.username || user?.username}
              </p>
              {(profile?.bio || user?.bio) && (
                <p className="mt-3 max-w-2xl text-sm text-slate-300">
                  {profile?.bio || user?.bio}
                </p>
              )}
              <div className="mt-6 flex items-center gap-6">
                <div>
                  <p className="text-2xl font-semibold">{total}</p>
                  <p className="text-base text-slate-400">Posts</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">{followers}</p>
                  <p className="text-base text-slate-400">Followers</p>
                </div>
                <div>
                  <p className="text-2xl font-semibold">{following}</p>
                  <p className="text-base text-slate-400">Following</p>
                </div>
              </div>
            </div>

            <div className="sm:ml-auto flex gap-3">
              {isOwner ? (
                <>
                  <Link
                    to="/profile/account"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border border-slate-700 text-slate-200 rounded-md"
                  >
                    Edit profile <Edit />
                  </Link>
                  <Link
                    to="/submit-blog"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-bg rounded-md"
                  >
                    New post <Plus />
                  </Link>
                </>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      if (isFollowing) {
                        await unfollowMutate.mutateAsync(viewId);
                      } else {
                        await followMutate.mutateAsync(viewId);
                      }
                    } catch (err) {
                      // swallow — use toast elsewhere
                    }
                  }}
                  disabled={followMutate.isLoading || unfollowMutate.isLoading}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-md ${isFollowing ? "bg-white text-slate-700 border border-slate-200" : "bg-primary text-bg"}`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
        <section>
          <div className="bg-bg border border-slate-800 rounded-xl p-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setTab("posts")}
                className={`px-4 py-2 rounded-md ${tab === "posts" ? "bg-primary text-bg" : "text-slate-300"}`}
              >
                Posts
              </button>
              <button
                onClick={() => setTab("top")}
                className={`px-4 py-2 rounded-md ${tab === "top" ? "bg-primary text-bg" : "text-slate-300"}`}
              >
                Top posts
              </button>
              <button
                onClick={() => setTab("activity")}
                className={`px-4 py-2 rounded-md ${tab === "activity" ? "bg-primary text-bg" : "text-slate-300"}`}
              >
                Activity
              </button>
            </div>
          </div>

          <div className="mt-6">
            {tab === "posts" && (
              <>
                {isLoading ? (
                  <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <PostSkeleton key={i} />
                    ))}
                  </div>
                ) : posts.length > 0 ? (
                  <div>
                    <PostGrid posts={posts} />
                    {meta?.totalPages > 1 && (
                      <Pagination
                        currentPage={meta?.page}
                        totalPages={meta?.totalPages}
                        onPageChange={(newPage) =>
                          setSearchParams({ page: newPage })
                        }
                      />
                    )}
                  </div>
                ) : (
                  <div className="bg-bg p-6 rounded-md border border-slate-800 text-center">
                    <p className="text-slate-400">
                      {isOwner
                        ? "You haven't written any blogs yet."
                        : "This user hasn't written any blogs yet."}
                    </p>
                    {isOwner && (
                      <Link
                        to="/submit-blog"
                        className="mt-4 inline-block text-primary"
                      >
                        Write your first blog
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}

            {tab === "top" && (
              <div>
                {topLoading ? (
                  <div className="space-y-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <PostSkeleton key={i} />
                    ))}
                  </div>
                ) : topPosts.length > 0 ? (
                  <div className="space-y-4">
                    {topPosts.map((p) => (
                      <div key={p._id} className="flex gap-4 items-center">
                        <img
                          src={p.coverImage}
                          alt={p.title}
                          className="w-28 h-16 object-cover rounded-md"
                        />
                        <div>
                          <Link
                            to={`/${p.slug}`}
                            className="text-lg font-semibold"
                          >
                            {p.title}
                          </Link>
                          <p className="text-xs text-slate-400">
                            {new Date(p.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-400">No top posts available.</p>
                )}
              </div>
            )}

            {tab === "activity" && (
              <div className="bg-bg p-6 rounded-md border border-slate-800">
                <p className="text-slate-400">
                  Recent activity will appear here (comments, likes, new
                  followers).
                </p>
              </div>
            )}
          </div>
        </section>

        <aside>
          <div className="bg-bg p-6 rounded-xl border border-slate-800">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-sm text-slate-400 mt-2">
              Member since:{" "}
              {new Date(
                profile?.createdAt || user?.createdAt,
              ).toLocaleDateString()}
            </p>
            <p className="text-sm text-slate-400 mt-2">
              Location: {profile?.location || user?.location || "—"}
            </p>
            <div className="mt-4">
              <h4 className="text-sm font-medium">Follow</h4>
              <div className="flex items-center gap-3 mt-2">
                <div className="text-center">
                  <p className="font-semibold">{followers}</p>
                  <p className="text-xs text-slate-400">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{following}</p>
                  <p className="text-xs text-slate-400">Following</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {isOwner ? (
                <Link
                  to="/profile/account"
                  className="block w-full text-center px-4 py-2 bg-primary text-bg rounded-md"
                >
                  Edit profile
                </Link>
              ) : (
                <Link
                  to="#followers"
                  className="block w-full text-center px-4 py-2 bg-transparent border border-slate-700 text-slate-200 rounded-md"
                >
                  View followers
                </Link>
              )}
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
};

export default Profile;
