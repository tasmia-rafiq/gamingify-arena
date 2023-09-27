import { Outlet } from "react-router-dom"
import Header from "./Header"
import Footer from "./Footer"

const Layout = ({logo}) => {
  return (
    <main>
        <Header />
        {/* If it's homepage, then it will show posts, if it's login/register then it shows forms */}
        <Outlet />
        <Footer logo={logo} />
    </main>
  )
}

export default Layout