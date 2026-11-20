import { Link } from "react-router";
import { useCartStore, selectTotalPrice } from "../store/cartStore.js";

function Cart() {
  // items is an existing reference from the store, total is a number
  const items = useCartStore((state) => state.items);
  const total = useCartStore(selectTotalPrice);
  const setQuantity = useCartStore((state) => state.setQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clear = useCartStore((state) => state.clear);

  if (items.length === 0) {
    return (
      <section>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products">Browse products</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>

      <table className="cart-table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>
                <Link to={`/products/${item.id}`}>{item.title}</Link>
              </td>
              <td>${item.price.toFixed(2)}</td>
              <td className="quantity">
                <button onClick={() => setQuantity(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button onClick={() => setQuantity(item.id, item.quantity + 1)}>+</button>
              </td>
              <td>${(item.price * item.quantity).toFixed(2)}</td>
              <td>
                <button onClick={() => removeItem(item.id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <p className="total">Total: ${total.toFixed(2)}</p>
      <button onClick={clear}>Clear cart</button>
    </section>
  );
}

export default Cart;
