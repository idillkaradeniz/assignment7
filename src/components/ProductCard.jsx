import { Link } from "react-router";

function ProductCard({ product }) {
  return (
    <article className="product-card">
      <img src={product.thumbnail} alt={product.title} />
      <h3>{product.title}</h3>
      <p className="category">{product.category}</p>
      <p className="price">${product.price.toFixed(2)}</p>
      <Link to={`/products/${product.id}`}>View details</Link>
    </article>
  );
}

export default ProductCard;
