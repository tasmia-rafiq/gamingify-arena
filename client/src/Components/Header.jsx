import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { LiaUserCircleSolid } from "react-icons/lia";
import { FiEdit3 } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import LOGO from "../assets/logo.png";

const Header = () => {
  //we using useContext beccause after logging in our header was not changing to create new post instead we needed to refresh the page
  const { setUserInfo, userInfo } = useContext(UserContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();
  const location = useLocation(); // Add this line to get the current route
  const [navActive, setNavActive] = useState("/");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://gamingify-arena-api.vercel.app/profile", {
      credentials: "include",
    }).then((response) => {
      response.json().then((userInfo) => {
        setUserInfo(userInfo);
      });
    });
  }, []);

  useEffect(() => {
    // Fetch categories
    fetch("https://gamingify-arena-api.vercel.app/category")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  }, []);

  useEffect(() => {
    setNavActive(location.pathname);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  function logout() {
    fetch("https://gamingify-arena-api.vercel.app/logout", {
      credentials: "include",
      method: "POST",
    });
    setUserInfo(null);
    navigate('/');
  }

  const username = userInfo?.username; //since username can be sometimes new so we will use userinfo?

  return (
    <header>
      <Link to="/" className="logo">
        <img src={LOGO} alt="Gamingify Arena" />
      </Link>
      <nav>
        <Link to="/" className={navActive === "/" ? "nav-active" : ""}>
          Home
        </Link>
        <Link
          to="/latest"
          className={navActive === "/latest" ? "nav-active" : ""}
        >
          Latest
        </Link>

        {/* fetching category dynamically */}
        {categories.map((category) => (
          <Link
            to={`/${category._id}/posts`}
            className={
              navActive ===
              `/${category._id}/posts`
                ? "nav-active"
                : ""
            }
            key={category._id}
            onClick={() =>
              navigate(
                `/${category._id}/posts`
              )
            }
          >
            {category.category_title}
          </Link>
        ))}
        {username ? (
          <>
            <div className="user-dropdown" ref={dropdownRef}>
              <span
                className="username"
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <div className="user-avatar">
                  {username.charAt(0).toUpperCase()}
                </div>
              </span>
              {showDropdown && (
                <div className="dropdown-content">
                  <Link to={"/profile"} onClick={() => setShowDropdown(!showDropdown)} className="user-profile-info">
                    <div className="user-avatar">
                      {username.charAt(0).toUpperCase()}
                    </div>
                    <p>{username}</p>
                  </Link>
                  <Link
                    to="/create"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    <FiEdit3 /> Create New Post
                  </Link>
                  <a onClick={logout}>
                    <MdLogout /> Logout
                  </a>
                </div>
              )}
            </div>
          </>
        ) : (
          <div
            className={`user-dropdown ${
              navActive === "/login" || navActive === "/register"
                ? "nav-active"
                : ""
            }`}
            ref={dropdownRef}
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <LiaUserCircleSolid className="user-icon" />
            {showDropdown && (
              <div className="dropdown-content">
                <Link
                  to="/login"
                  className={navActive === "/login" ? "nav-active" : ""}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={navActive === "/register" ? "nav-active" : ""}
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
