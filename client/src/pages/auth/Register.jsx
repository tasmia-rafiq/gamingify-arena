import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../../validation/auth.validation";
import { registerUser } from "../../api/auth.api";
import { toast } from "react-toastify";
import Input from "../../components/ui/Input";
import { Eye, EyeOff, Mail, SquareUserRound, User2 } from "lucide-react";
import Button from "../../components/ui/Button";
import { useMemo, useState } from "react";

function passwordScore(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 4);
}

const Register = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const res = await registerUser(data);
      toast.success(res.message);
      navigate("/check-email");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const score = useMemo(() => passwordScore(passwordValue), [passwordValue]);
  const strengthLabel =
    ["Very weak", "Weak", "Okay", "Good", "Strong"][score] ?? "Very weak";
  const strengthPct = (score / 4) * 100;
  const passwordTooShort = passwordValue.length > 0 && passwordValue.length < 8;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth_form space-y-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
        <p className="text-sm text-slate-400">
          Join Gamingify Arena — share guides, reviews and tips
        </p>
      </div>

      <div className="mb-4">
        <a
          href={`${import.meta.env.VITE_API_URL}/api/v1/auth/google`}
          className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 bg-white text-slate-900 rounded-md hover:shadow-md"
        >
          <img src="/images/google-icon.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </a>
        <div className="flex items-center my-4">
          <span className="flex-1 h-px bg-slate-800" />
          <span className="px-3 text-slate-400 text-xs">or use your email to create an account</span>
          <span className="flex-1 h-px bg-slate-800" />
        </div>
      </div>

      <Input
        label="Full Name"
        placeholder="Enter your full name"
        name="fullname"
        {...register("fullname")}
        error={errors.fullname?.message}
        loading={isSubmitting}
        required
      >
        <SquareUserRound className="input_icon" />
      </Input>

      <Input
        label="Username"
        placeholder="Enter your username"
        name="username"
        {...register("username")}
        error={errors.username?.message}
        loading={isSubmitting}
        required
      >
        <User2 className="input_icon" />
      </Input>

      <Input
        label="Email"
        type="email"
        placeholder="Enter your email"
        name="email"
        {...register("email")}
        error={errors.email?.message}
        loading={isSubmitting}
        required
      >
        <Mail className="input_icon" />
      </Input>

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        placeholder="Create a password"
        name="password"
        {...register("password")}
        error={errors.password?.message}
        aria-invalid={passwordTooShort}
        loading={isSubmitting}
        required
      >
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="input_icon" />
          ) : (
            <Eye className="input_icon" />
          )}
        </button>
      </Input>

      {/* live helper */}
      <div className="mt-2 flex items-center justify-between text-xs">
        <div className={passwordTooShort ? "text-red-400" : "text-slate-400"}>
          {passwordTooShort
            ? "Password must be at least 8 characters."
            : "Use 8+ characters for better security."}
        </div>
        <div className="text-slate-400">{passwordValue.length} chars</div>
      </div>

      {/* strength bar */}
      <div className="mt-2">
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${strengthPct}%`,
              background:
                score >= 3
                  ? "linear-gradient(90deg,#10b981,#06b6d4)"
                  : "linear-gradient(90deg,#f97316,#f43f5e)",
            }}
            aria-hidden
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1">
          <span>{strengthLabel}</span>
          <span>{passwordValue.length} chars</span>
        </div>
      </div>

      <Button loading={isSubmitting} loadingText="Creating account">
        Sign up
      </Button>

      <p className="text-sm text-gray-400 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-primary font-medium">
          Sign in
        </Link>
      </p>
    </form>
  );
};

export default Register;
