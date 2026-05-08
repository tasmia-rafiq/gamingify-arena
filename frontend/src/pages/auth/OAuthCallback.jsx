import { useSearchParams, Link } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");
  const success = searchParams.get("oauth") || searchParams.get("success");

  useEffect(() => {
    if (error) {
      toast.error(decodeURIComponent(error));
    } else if (success) {
      toast.success("Signed in successfully.");
    }
  }, [error, success]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-bg/60 border border-slate-800 rounded-xl p-8 text-center">
        {error ? (
          <>
            <h2 className="text-xl font-semibold text-white">Sign in with Google failed</h2>
            <p className="text-slate-400 mt-3">{decodeURIComponent(error)}</p>
            <div className="mt-6 flex flex-col gap-3">
              <Link to="/login" className="inline-block px-4 py-2 bg-primary text-bg rounded-md">Go to Login</Link>
              <Link to="/register" className="inline-block px-4 py-2 bg-transparent border border-slate-700 text-slate-200 rounded-md">Create account</Link>
            </div>
          </>
        ) : (
          <>
            <h2 className="text-xl font-semibold text-white">You're signed in</h2>
            <p className="text-slate-400 mt-3">Redirecting to home…</p>
            <div className="mt-6">
              <Link to="/" className="inline-block px-4 py-2 bg-primary text-bg rounded-md">Go Home</Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OAuthCallback;
