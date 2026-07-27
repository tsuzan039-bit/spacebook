import { Avatar, Dropdown, DropdownDivider, DropdownHeader, DropdownItem, Navbar, NavbarBrand } from "flowbite-react";
import { useContext } from "react";
import { Link, useNavigate ,NavLink} from "react-router-dom";
import { AuthContext } from "../../Context/AuthContext";
import NotificationsWrapper from "../NotificationsWrapper/NotificationsWrapper";
import "./AppNav.css";

export function AppNav() {
  const { token, setToken, userData } = useContext(AuthContext);
  const { name, email, photo } = userData || {};
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  return (
    <Navbar fluid rounded className="space-navbar">
      <div className="nav-star" style={{ top: "20%", left: "10%" }}></div>
      <div className="nav-star" style={{ top: "60%", left: "30%" }}></div>
      <div className="nav-star" style={{ top: "35%", left: "75%" }}></div>
      <div className="nav-star" style={{ top: "70%", left: "90%" }}></div>

      <div className="navbar-top-row">
        <NavbarBrand as={Link} to="/" className="space-logo">
          <div className="planet-container">
            <div className="planet-ring"></div>
            <div className="planet-core"></div>
            <div className="planet-glow"></div>
          </div>

          <div className="flex flex-col">
            <span className="space-brand-title">Spacebook</span>
            <span className="space-brand-subtitle">Explore The Universe</span>
          </div>
        </NavbarBrand>

        {token && (
          <div className="flex items-center gap-4">
            <NotificationsWrapper />

            <Dropdown
              arrowIcon={false}
              inline
              className="!w-[300px] !bg-[#0a0618]/95 backdrop-blur-xl border border-cyan-400/30 rounded-3xl overflow-hidden shadow-[0_0_40px_rgba(34,211,238,.25)]"
              label={
                <div className="relative group cursor-pointer">
                  <div className="absolute inset-0 rounded-full bg-cyan-400/30 blur-xl group-hover:scale-125 transition duration-500"></div>
                  <Avatar
                    alt="User"
                    img={photo || "https://i.pravatar.cc/100"}
                    rounded
                    className=" relative ring-2 ring-cyan-400/70 group-hover:ring-fuchsia-400 transition-all duration-300 rounded-full"
                  />
                </div>
              }
            >
              <DropdownHeader className="!bg-transparent border-b border-cyan-400/20">
                <div className="flex items-center gap-3 ">
                  <img
                    src={photo || "https://i.pravatar.cc/100"}
                    className="w-14 h-14 rounded-full object-cover ring-2 ring-cyan-400 shadow-[0_0_20px_#22d3ee] "
                  />
                  <div>
                    <h3 className="text-white font-bold">{name}</h3>
                    <p className="text-cyan-300 text-xs break-all">{email}</p>
                    <span className="inline-flex mt-2 px-2 py-1 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      🚀 Space Explorer
                    </span>
                  </div>
                </div>
              </DropdownHeader>

              <DropdownItem as={Link} to="/" className="text-white hover:!bg-cyan-500/10">
                🏠 Posts
              </DropdownItem>
              <DropdownItem as={Link} to="/profile" className="text-white hover:!bg-cyan-500/10">
                👨‍🚀 My Profile
              </DropdownItem>
              <DropdownItem as={Link} to="/bookmarks" className="text-white hover:!bg-fuchsia-500/10">
                ⭐ Bookmarks
              </DropdownItem>
              <DropdownItem as={Link} to="/settings" className="text-white hover:!bg-violet-500/10">
                ⚙️ Settings
              </DropdownItem>

              <DropdownDivider className="border-cyan-500/20" />

              <DropdownItem onClick={logout} className="text-red-300 hover:!bg-red-500/20">
                🚪 Logout
              </DropdownItem>
            </Dropdown>
          </div>
        )}


        {!token && (
          <div className="flex items-center gap-3 auth-links">
            <NavLink
              to="/login"
              className={({ isActive }) =>
                `auth-btn ${isActive ? "auth-btn-filled" : "auth-btn-ghost"}`
              }
            >
              🚀 Login
            </NavLink>
            <NavLink
              to="/register"
              className={({ isActive }) =>
                `auth-btn ${isActive ? "auth-btn-filled" : "auth-btn-ghost"}`
              }
            >
              ✨ Register
            </NavLink>
          </div>
        )}
      </div>
    </Navbar>
  );
}