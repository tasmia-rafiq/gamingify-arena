const PostCategory = ({ name, tagline }) => {
  if (!name) return null;

  return (
    <>
      <div className="post_category" aria-label={`Category: ${name}`}>
        <span className="circle_design" aria-hidden="true" />
        <span className="middle">{name}</span>
        <span className="circle_design" aria-hidden="true" />
      </div>

      <div className="text-center pt-5 sm:text-xl text-lg font-light"><p>{tagline}</p></div>
    </>
  );
};

export default PostCategory;
