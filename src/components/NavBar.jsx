import { NavLink, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext.jsx";
import { useCartStore, selectItemCount } from "../store/cartStore.js";

function NavBar() {
  const { user, logOut } = useAuth();
  // the selector returns a number, so the navbar only re-renders when the count changes
  const itemCount = useCartStore(selectItemCount);
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
        <NavLink to="/cart">Cart ({itemCount})</NavLink>

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
