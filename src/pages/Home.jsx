import { Link } from "react-router";

function Home() {
  return (
    <section>
      <h1>Welcome to the Online Shop</h1>
      <p>Browse our products, filter them by category and add the ones you like to your cart.</p>
      <Link to="/products">See all products</Link>
    </section>
  );
}

export default Home;
