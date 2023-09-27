import { Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./Components/Layout";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import { UserContextProvider } from "./UserContext";
import CreatePost from "./Pages/CreatePost";
import PostPage from "./Pages/PostPage";
import EditPost from "./Pages/EditPost";
import CategoryPages from "./Pages/CategoryPages";
import LatestPage from "./Pages/LatestPage";
import logo from "./assets/logo.png";


function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout logo={logo} />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<CreatePost />} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<EditPost />} />
          <Route path="/:categoryId/posts" element={<CategoryPages />} />
          <Route path="/latest" element={<LatestPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
