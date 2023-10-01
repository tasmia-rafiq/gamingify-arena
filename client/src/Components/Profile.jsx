import Loader from "./Loader";
import Post from "./Post";

const Profile = ({ name, desc, data }) => {
  return (
    <section className="profile_page">
      <h1 className="head_text text-left">
        <span className="head_title blue_gradient">{name} Profile</span>
      </h1>
      <p className="profile_desc">{desc}</p>

      <div className="post_grid">
        {Array.isArray(data) && data.length > 0 ? (
          data.map((post) => (
            <Post key={post._id} {...post} category={post.category} />
          ))
        ) : data.length === 0 ? (
          <div className="text-center text-black font-semibold light_purple_gradient_bg rounded-xl px-6 py-3 font-poppins">
            No posts available
          </div>
        ) : (
          <Loader />
        )}
      </div>
    </section>
  );
};

export default Profile;
