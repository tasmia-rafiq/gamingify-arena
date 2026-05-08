import { MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

const CheckEmail = () => {
  return (
    <div className="max-w-xl mt-24 auth_form text-center">
      <MailCheck className="size-16 text-primary mx-auto mb-4" />

      <h1 className="blue_gradient text-4xl">Check your email</h1>

      <p className="text-slate-300 mb-4">
        If your email address is valid, we’ve sent you a verification link.
        Please check your inbox and follow the instructions to verify your
        account.
      </p>

      <p className="text-sm text-slate-400 mb-6">
        The link will expire in 10 minutes.
      </p>

      <Link
        to="/login"
        className="btn-primary"
      >
        Go to Login
      </Link>
    </div>
  );
};

export default CheckEmail;