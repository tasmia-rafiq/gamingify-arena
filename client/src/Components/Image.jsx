const Image = ({ src, ...rest }) => {
  src =
    src && src.includes("https://") ? src : `https://gamingify-arena.vercel.app/${src}`;
  return <img {...rest} src={src} alt="Cover" />;
};

export default Image;
