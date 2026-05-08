import { Outlet, ScrollRestoration } from "react-router-dom"
import Footer from "../components/Footer"
import Navbar from "../components/navbar/Navbar"

const AppLayout = () => {
  return (
    <main>
        <Navbar />
        <Outlet />
        <Footer />
        <ScrollRestoration />
    </main>
  )
}

export default AppLayout