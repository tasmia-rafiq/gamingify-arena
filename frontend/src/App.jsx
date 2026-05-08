import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Suspense, lazy } from "react";
import AppLayout from "./layouts/AppLayout";
import AppLoader from "./components/ui/AppLoader";
import Home from "./pages/Home";
import CheckEmail from "./pages/auth/CheckEmail";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const OAuthCallback = lazy(() => import("./pages/auth/OAuthCallback"));
const VerifyEmail = lazy(() => import("./pages/auth/VerifyEmail"));
const ForgotPassword = lazy(() => import("./pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/auth/ResetPassword"));
const ProtectedRoute = lazy(() => import("./routes/ProtectedRoute"));
const PublicRoute = lazy(() => import("./routes/PublicRoute"));
const SubmitBlog = lazy(() => import("./pages/post/SubmitBlog"));
const EditBlog = lazy(() => import("./pages/post/EditBlog"));
const SingleBlog = lazy(() => import("./pages/post/SingleBlog"));

const Latest = lazy(() => import("./pages/Latest"));
const Reviews = lazy(() => import("./pages/Reviews"));
const News = lazy(() => import("./pages/News"));
const TipsAndGuides = lazy(() => import("./pages/TipsAndGuides"));
const Profile = lazy(() => import("./pages/Profile"));

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/latest", element: <Latest /> },
      { path: "/reviews", element: <Reviews /> },
      { path: "/news", element: <News /> },
      { path: "/tips-and-guides", element: <TipsAndGuides /> },
      { path: "/:slug", element: <SingleBlog /> },
      { path: "/author/:id", element: <Profile /> },

      {
        element: <PublicRoute />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/forgot-password", element: <ForgotPassword /> },
          { path: "/reset-password/:token", element: <ResetPassword /> },
          { path: "/register", element: <Register /> },
          { path: "/check-email", element: <CheckEmail /> },
          { path: "/verify-email/:token", element: <VerifyEmail /> },
          { path: "/auth/oauth-callback", element: <OAuthCallback /> },
        ],
      },
      {
        element: <ProtectedRoute />,
        children: [
          { path: "/profile", element: <Profile /> },
          { path: "/submit-blog", element: <SubmitBlog /> },
          { path: "/:slug/edit", element: <EditBlog /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <>
      <Suspense fallback={<AppLoader />}>
        <RouterProvider router={router} />
      </Suspense>
      <ToastContainer position="bottom-right" />
    </>
  );
};

export default App;
