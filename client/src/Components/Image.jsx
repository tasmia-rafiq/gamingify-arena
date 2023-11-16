const Image = ({ src, ...rest }) => {
  src =
    src && src.includes("https://") ? src : `http:localhost:4000/${src}`;
  return <img {...rest} src={src} alt="Cover" />;
};

export default Image;
