import { useRef, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useClickOutside } from "../../hooks/useClickOutside";
import { UserCircle2 } from "lucide-react";

const AuthMenu = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const close = useCallback(() => setOpen(false), []);

  useClickOutside(ref, close);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen((prev) => !prev)}>
        <UserCircle2 className="text-3xl" />
      </button>

      {open && (
        <div className="dropdown_content">
          <Link to="/login" onClick={close}>
            Login
          </Link>
          <Link
            to="/register"
            onClick={close}
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
};

export default AuthMenu;