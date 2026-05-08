import clsx from "clsx";

const Input = ({
  label,
  error,
  loading,
  className,
  labelClass,
  children,
  ...props
}) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className={clsx("mb-2 font-light text-sm text-white/90 p-0!", labelClass)}>{label}</label>
      )}
      <div className="relative">
        <input
          disabled={loading}
          className={clsx(
            "auth_input",
            error && "border-red-400 focus:ring-red-400",
            className,
          )}
          {...props}
        />
        {children}
      </div>
      {error && <p className="text-red-400 mt-1 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
