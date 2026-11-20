import { Outlet } from "react-router";
import NavBar from "./NavBar.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

function Layout() {
  // the theme lives here and is passed down, because two components calling
  // useLocalStorage would each get their own separate state
  const [theme, setTheme] = useLocalStorage("theme", "light");

  function toggleTheme() {
    setTheme((current) => (current === "light" ? "dark" : "light"));
  }

  return (
    <div className={`app theme-${theme}`}>
      <NavBar theme={theme} onToggleTheme={toggleTheme} />
      <main className="content">
        {/* the matched child page is rendered here */}
        <Outlet />
      </main>
      <footer className="footer">
        <p>Online Shop - Web Programming Assignment 7</p>
      </footer>
    </div>
  );
}

export default Layout;
