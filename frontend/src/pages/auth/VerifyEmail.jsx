import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../../api/auth.api";
import { CheckCircle, XCircle } from "lucide-react";
import AppLoader from "../../components/ui/AppLoader";

const VerifyEmail = () => {
  const { token } = useParams();
  const hasVerified = useRef(false);

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (hasVerified.current) return;
    hasVerified.current = true;

    const verifyUser = async () => {
      try {
        const res = await verifyEmail(token);
        setMessage(res.message || "Email verified successfully.");
        setStatus("success");
      } catch (error) {
        setMessage(
          error?.response?.data?.message ||
            "Verification link is invalid or expired."
        );
        setStatus("error");
      }
    };

    verifyUser();
  }, [token]);

  if (status === "loading") {
    return <AppLoader />;
  }

  return (
    <div className="mt-24 auth_form text-center">
      {status === "success" && (
        <>
          <CheckCircle className="size-16 text-primary mx-auto mb-4" />
          <h1 className="blue_gradient text-4xl">
            Email Verified
          </h1>
          <p className="text-slate-300 mb-6">{message}</p>

          <Link
            to="/login"
            className="btn-primary"
          >
            Login to Continue
          </Link>
        </>
      )}

      {status === "error" && (
        <>
          <XCircle className="w-14 h-14 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Verification Failed
          </h1>
          <p className="text-gray-600 mb-6">{message}</p>

          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Go to Login
          </Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;