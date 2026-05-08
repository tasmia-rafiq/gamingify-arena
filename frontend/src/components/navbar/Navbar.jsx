import { Link, NavLink } from "react-router-dom";
import { useState, useRef } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import NavLinks from "./NavLinks";
import UserMenu from "./UserMenu";
import AuthMenu from "./AuthMenu";
import { Menu, X, UserCircle2, LogOut, Plus, User } from "lucide-react";
import { useClickOutside } from "../../hooks/useClickOutside";
import { categories } from "../../constants";

const Navbar = () => {
  const { isAuth, user, logoutUser } = useAuthContext();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useClickOutside(menuRef, () => setOpen(false));

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-50 flex justify-between items-center sm:px-12 px-4 sm:py-4 py-2 bg-bg shadow-sm">
      <Link to="/" className="flex items-center gap-2 lg:w-40 md:w-48 w-42">
        <img src={"/images/logo.png"} alt="Gamingify Arena" className="w-full h-full object-contain" />
      </Link>

      {/* Desktop links */}
      <NavLinks />

      {/* Desktop user/auth menus */}
      <div className="hidden md:flex items-center gap-4">
        {isAuth ? <UserMenu /> : <AuthMenu />}
      </div>

      {/* Mobile hamburger */}
      <div className="md:hidden">
        <button
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
          className="p-2 rounded-md focus:outline-none focus:ring-2"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile slide-over menu */}
      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div
            ref={menuRef}
            className="absolute right-0 top-0 w-80 max-w-full h-full bg-bg p-6 shadow-lg overflow-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <Link to="/" onClick={close} className="flex items-center gap-2">
                <img src={"/images/logo.png"} alt="Gamingify Arena" className="h-12 object-contain" />
              </Link>
              <button onClick={close} aria-label="Close" className="p-2">
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-3 pt-4">
              <NavLink to="/" onClick={close} className={({ isActive }) => isActive ? "text-primary font-medium" : "text-slate-200"}>
                Home
              </NavLink>

              <NavLink to="/latest" onClick={close} className={({ isActive }) => isActive ? "text-primary font-medium" : "text-slate-200"}>
                Latest
              </NavLink>

              {categories.map((cat) => (
                <NavLink
                  key={cat.slug}
                  to={`/${cat.slug}`}
                  onClick={close}
                  className={({ isActive }) => isActive ? "text-primary font-medium" : "text-slate-200"}
                >
                  {cat.name}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-slate-200 mt-6 pt-4">
              {isAuth ? (
                <div className="flex flex-col gap-3">
                  <Link to="/submit-blog" onClick={close} className="flex items-center gap-2 text-slate-200">
                    <Plus className="h-4 w-4" /> Submit Blog
                  </Link>
                  
                  <Link to="/profile" onClick={close} className="flex items-center gap-2 text-slate-200">
                    <User className="h-4 w-4" /> Profile
                  </Link>

                  <button onClick={() => { logoutUser(); close(); }} className="flex items-center gap-2 text-red-500">
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" onClick={close} className="text-slate-200">
                    Login
                  </Link>
                  <Link to="/register" onClick={close} className="text-slate-200">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </header>
  );
};

export default Navbar;
