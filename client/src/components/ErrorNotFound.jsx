import { LucideArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ErrorNotFound = ({ title, desc }) => {
  return (
    <div className="text-center flex items-center flex-col justify-center m-auto text-red-400">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-lg text-slate-400 my-4">
        {desc}
      </p>
      <Link
        to="/"
        className="text-primary hover:underline text-xl flex items-center gap-2"
      >
        <LucideArrowLeft /> Back to Home
      </Link>
    </div>
  );
};

export default ErrorNotFound;
