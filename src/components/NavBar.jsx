import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";

function NavBar() {
  const { user, logOut } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logOut();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <span className="logo">Online Shop</span>
      <div className="nav-links">
        {/* end: so "/" is not active on every page */}
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/cart">Cart</NavLink>

        {user ? (
          <>
            <span className="username">{user.username}</span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <NavLink to="/login">Login</NavLink>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
