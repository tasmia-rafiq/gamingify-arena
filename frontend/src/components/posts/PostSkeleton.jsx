const PostSkeleton = () => {
  return (
    <div className="post skeleton">
      <div className="post_in">
        <div className="image skeleton-image"></div>
        <div className="texts">
          <div className="title skeleton-title"></div>
          <div className="info skeleton-info"></div>
          <div className="summary skeleton-summary"></div>
          <div className="read_more h-0.75 w-30"></div>
        </div>
      </div>
    </div>
  );
}

export default PostSkeleton