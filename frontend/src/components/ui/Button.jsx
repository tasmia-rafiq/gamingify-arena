import { Loader2 } from "lucide-react";

const Button = ({ loading, loadingText, children, ...props }) => (
  <button {...props} disabled={loading} className="btn-primary mt-2" type="submit">
    {loading ? (
      <>
        <Loader2 className="animate-spin" size={16} />
        <span>{loadingText}...</span>
      </>
    ) : (
      <span>{children}</span>
    )}
  </button>
);

export default Button;