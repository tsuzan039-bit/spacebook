import { Outlet } from "react-router-dom";
import { AppNav } from "../Navbar/Navbar";

export default function Layout() {
  return (
    <>
      <AppNav/>
      <Outlet />
    </>
  );
}