import { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useClickOutside } from "../../hooks/useClickOutside";
import { useAuthContext } from "../../contexts/AuthContext";
import { Edit2, ArrowUpRightFromCircleIcon, User2, Plus } from "lucide-react";
import UserAvatar from "../ui/UserAvatar";

const UserMenu = () => {
  const { user, logoutUser } = useAuthContext();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useClickOutside(dropdownRef, close);

  return (
    <div className="relative align-middle flex items-center justify-center gap-4" ref={dropdownRef}>
      <Link
        to="/submit-blog"
        className="flex items-center justify-center btn-primary hover:bg-transparent! hover:text-primary border border-primary w-fit! py-2.5 px-4.5 text-base"
      >
        Submit <Plus />
      </Link>

      <button onClick={() => setOpen((prev) => !prev)}>
        <UserAvatar user={user} className={"size-11 text-xl"} />
      </button>

      {open && (
        <div className="dropdown_content">
          <Link to="/profile" onClick={close}>
            <UserAvatar user={user} className={"size-7"} /> {user.username}
          </Link>

          <Link to="/profile/account" onClick={close}>
            <User2 /> Account
          </Link>

          <Link to="/create" onClick={close}>
            <Edit2 /> Submit Blog
          </Link>

          <button
            onClick={logoutUser}
            className="flex items-center gap-2 text-red-400 hover:text-red-500 w-full"
          >
            <ArrowUpRightFromCircleIcon /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
