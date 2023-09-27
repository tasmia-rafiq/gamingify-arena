import React from "react";

const PostCategory = ({categoryTitle, pageTitle, categoryTag}) => {
  return (
    <>
      <div className="post_category">
      <span className="circle_design"></span>
      <span className="middle">{categoryTitle || pageTitle}</span>
      <span className="circle_design"></span>
    </div>

    <div className="category_tag">
      <p>{categoryTag}</p>
    </div>
    </>
  );
};

export default PostCategory;
