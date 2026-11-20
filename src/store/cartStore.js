import { create } from "zustand";

const STORAGE_KEY = "cart-items";

// read saved items, but never trust what is in localStorage
function loadItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(saved)) return [];
    return saved.filter(
      (item) => item && typeof item.id === "number" && typeof item.price === "number" && item.quantity >= 1,
    );
  } catch {
    // broken json
    return [];
  }
}

export const useCartStore = create((set) => ({
  items: loadItems(),

  addItem: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }
      const newItem = { id: product.id, title: product.title, price: product.price, quantity: 1 };
      return { items: [...state.items, newItem] };
    }),

  removeItem: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),

  setQuantity: (id, quantity) =>
    set((state) => {
      if (quantity < 1) {
        return { items: state.items.filter((item) => item.id !== id) };
      }
      return {
        items: state.items.map((item) => (item.id === id ? { ...item, quantity } : item)),
      };
    }),

  clear: () => set({ items: [] }),
}));

// save to localStorage from outside React, only when items really changed
useCartStore.subscribe((state, prevState) => {
  if (state.items === prevState.items) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
  } catch {
    // storage full or blocked, the cart still works for this visit
  }
});

// derived values, computed from items and never stored
export const selectItemCount = (state) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectTotalPrice = (state) =>
  state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
