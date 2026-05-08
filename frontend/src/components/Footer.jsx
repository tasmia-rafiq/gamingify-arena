import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-bg p-5 flex flex-col items-center gap-2 mt-12">
      <Link className="block w-40 pb-4" to={"/"}>
        <img src="/images/logo.png" alt="LOGO" />
      </Link>

      <ul className="list-none flex gap-x-4 gap-y-2 flex-wrap items-center justify-center text-primary">
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/latest">Latest</Link>
        </li>
        <li>
          <Link to="/news">News</Link>
        </li>
        <li>
          <Link to="/reviews">Reviews</Link>
        </li>
        <li>
          <Link to="/tips-and-guids">Tips & Guides</Link>
        </li>
        
      </ul>

      <p className="font-light text-sm pt-5">&copy; {new Date().getFullYear()} Gamingify Arena | All rights reserverd.</p>
    </footer>
  );
};

export default Footer;