import { NavLink } from "react-router";

function NavBar() {
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
        <NavLink to="/login">Login</NavLink>
      </div>
    </nav>
  );
}

export default NavBar;
