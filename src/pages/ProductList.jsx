import { useFetch } from "../hooks/useFetch.js";
import { fetchProducts } from "../api/productsApi.js";
import ProductCard from "../components/ProductCard.jsx";

function ProductList() {
  const { loading, error, data: products } = useFetch((signal) => fetchProducts(signal), []);

  if (loading) {
    return <p>Loading products...</p>;
  }

  if (error) {
    return <p className="error">Could not load products: {error.message}</p>;
  }

  return (
    <section>
      <h1>Products</h1>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductList;
