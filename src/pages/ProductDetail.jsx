import { Link, useNavigate, useParams } from "react-router";
import { useFetch } from "../hooks/useFetch.js";
import { fetchProduct } from "../api/productsApi.js";
import { useCartStore } from "../store/cartStore.js";

function ProductDetail() {
  // id from the url is always a string, for example "5"
  const { id } = useParams();
  const navigate = useNavigate();

  // id is in deps, so going from /products/1 to /products/2 loads the new product
  const { loading, error, data: product } = useFetch((signal) => fetchProduct(id, signal), [id]);

  // only the action, so this page does not re-render when the cart changes
  const addItem = useCartStore((state) => state.addItem);

  const nextId = Number(id) + 1;

  function goBack() {
    navigate("/products");
  }

  if (loading) {
    return <p>Loading product...</p>;
  }

  if (error) {
    return (
      <section>
        {error.status === 404 ? (
          <>
            <h1>Product not found</h1>
            <p>There is no product with the id "{id}".</p>
          </>
        ) : (
          <p className="error">Could not load the product: {error.message}</p>
        )}
        <button onClick={goBack}>Back to products</button>
      </section>
    );
  }

  return (
    <section className="product-detail">
      <button onClick={goBack}>Back to products</button>

      <div className="detail-body">
        <img src={product.thumbnail} alt={product.title} />
        <div>
          <h1>{product.title}</h1>
          <p className="category">{product.category}</p>
          <p>{product.description}</p>
          <p className="price">${product.price.toFixed(2)}</p>
          <button onClick={() => addItem(product)}>Add to cart</button>
        </div>
      </div>

      <Link to={`/products/${nextId}`}>Next product</Link>
    </section>
  );
}

export default ProductDetail;
