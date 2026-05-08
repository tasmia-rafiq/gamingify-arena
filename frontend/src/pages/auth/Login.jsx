import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validation/auth.validation";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import { toast } from "react-toastify";
import { Mail, EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { useAuthContext } from "../../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await loginUser(data);
      toast.success(res.message);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="auth_form space-y-4">
      <div className="text-center mb-4">
        <h1 className="text-2xl font-bold text-white mb-2">Welcome back</h1>
        <p className="text-sm text-slate-400">
          Sign in to continue to Gamingify Arena
        </p>
      </div>

      <div className="mb-4">
        <Link
          to={`${import.meta.env.VITE_API_URL}/api/v1/auth/google`}
          className="w-full inline-flex items-center justify-center gap-3 px-4 py-2 bg-white text-slate-900 rounded-full hover:shadow-md"
        >
          <img src="/images/google-icon.svg" alt="Google" className="w-5 h-5" />
          Continue with Google
        </Link>
        <div className="flex items-center my-4">
          <span className="flex-1 h-px bg-slate-800" />
          <span className="px-3 text-slate-400 text-xs">or use your email to sign in</span>
          <span className="flex-1 h-px bg-slate-800" />
        </div>
      </div>

      <Input
        label="Email"
        placeholder="Enter your email"
        type="email"
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
        placeholder="Enter your password"
        type={showPassword ? "text" : "password"}
        name="password"
        {...register("password")}
        error={errors.password?.message}
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

      <Button loading={isSubmitting} loadingText="Signing in">
        Sign in
      </Button>

      <p className="text-sm text-gray-400 text-center">
        Don't have an account?{" "}
        <Link to="/register" className="text-primary font-medium">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default Login;
