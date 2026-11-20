import { useSearchParams } from "react-router";
import { useFetch } from "../hooks/useFetch.js";
import { fetchProducts } from "../api/productsApi.js";
import ProductCard from "../components/ProductCard.jsx";

function ProductList() {
  const { loading, error, data: products } = useFetch((signal) => fetchProducts(signal), []);

  // the filters live in the url: /products?q=mascara&category=beauty
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  // change one param and keep the others
  function updateParam(name, value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) {
          next.set(name, value);
        } else {
          next.delete(name);
        }
        return next;
      },
      // typing should not add a history entry for every letter
      { replace: name === "q" },
    );
  }

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="error">Could not load products: {error.message}</p>;
  }

  // derived during render, not stored in state
  const categories = [...new Set(products.map((p) => p.category))].sort();

  const filtered = products.filter((p) => {
    const matchesTitle = p.title.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "" || p.category === category;
    return matchesTitle && matchesCategory;
  });

  return (
    <section>
      <h1>Products</h1>

      <div className="filters">
        <input
          type="search"
          placeholder="Search by title..."
          value={query}
          onChange={(e) => updateParam("q", e.target.value)}
        />
        <select value={category} onChange={(e) => updateParam("category", e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <p className="result-count">
        {filtered.length} of {products.length} products
      </p>

      {filtered.length === 0 ? (
        <p>No products match your filters.</p>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}

export default ProductList;
