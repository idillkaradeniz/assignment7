# Assignment 7 - Online Shop (React)

A small online shop made with React and Vite. It has several pages with client-side routing,
filters that are saved in the URL, a fake login with Context + `useReducer`, a cart in a Zustand
store that is saved in `localStorage`, and a light/dark theme.

Products come from the public [DummyJSON](https://dummyjson.com) API.

## How to run

```
npm install
npm run dev
```

Then open the address Vite prints (usually http://localhost:5173).

**Demo account**

- Username: `230408030@st.biruni.edu.tr`
- Password: `demo123456`

## File organization

```
assignment7/
├─ src/
│   ├─ api/
│   │   ├─ productsApi.js     fetchProducts / fetchProduct, throw on a failed HTTP status
│   │   └─ authApi.js         fake login, resolves after 500 ms or rejects
│   ├─ hooks/
│   │   ├─ useFetch.js        loading / error / data with useReducer, aborts old requests
│   │   └─ useLocalStorage.js like useState but saved in localStorage (used for the theme)
│   ├─ context/
│   │   └─ AuthContext.jsx    AuthProvider + useAuth, reducer with LOGGED_IN / LOGGED_OUT
│   ├─ store/
│   │   └─ cartStore.js       Zustand cart store, selectors, saving with subscribe()
│   ├─ components/
│   │   ├─ Layout.jsx         navbar + <Outlet /> + footer, holds the theme
│   │   ├─ NavBar.jsx         NavLinks, cart count, login / logout, theme button
│   │   ├─ ProductCard.jsx    one product in the list
│   │   └─ ProtectedRoute.jsx redirects to /login when nobody is signed in
│   ├─ pages/
│   │   ├─ Home.jsx
│   │   ├─ ProductList.jsx    list + filters in the query string
│   │   ├─ ProductDetail.jsx  one product, read from the :id route param
│   │   ├─ Cart.jsx           items, quantity controls, total, clear
│   │   ├─ Login.jsx          controlled form, sends the user back where they wanted to go
│   │   └─ NotFound.jsx
│   ├─ App.jsx                all the routes
│   ├─ main.jsx               BrowserRouter + AuthProvider
│   └─ index.css              styles and theme colors
├─ index.html
└─ package.json
```

## Routes

| Path | Page | Access |
|---|---|---|
| `/` | Home | public |
| `/products` | ProductList | public |
| `/products/:id` | ProductDetail | public |
| `/cart` | Cart | signed-in users only |
| `/login` | Login | public |
| anything else | NotFound | public |

All pages are rendered inside `Layout`. `/products` and `/products/:id` are nested routes under a
`products` parent route.

## About the login

The login is only for the user experience. `ProtectedRoute` just decides which page React shows,
everything still runs in the browser and can be changed there. **Client-side protection is a
user-experience feature, not security.** There is also no real server: `authApi.js` only compares
the username and password with a fixed pair.

## Self-study

- **Updating one query parameter without losing the others:** `setSearchParams` from
  `useSearchParams` can take a function that gets the current params (react-router docs). I make a
  copy with `new URLSearchParams(prev)`, then `set` or `delete` only the one I changed and return
  the copy. So changing the category keeps the search text. I also pass `{ replace: true }` for the
  search input, so typing doesn't add a history entry for every letter.
- **Loading the store from localStorage safely:** `JSON.parse` throws on broken text and
  `getItem` returns `null` when nothing is saved, so `loadItems()` is in a `try/catch`, checks that
  the result is an array, and filters out items that don't have a number `id`, a number `price`
  and a quantity of at least 1. Otherwise it starts with an empty cart. For saving I used
  `useCartStore.subscribe((state, prevState) => ...)` from the Zustand docs, which runs outside
  React. I compare `state.items` with `prevState.items` so it only writes when the items changed.
- **Light/dark theme:** I defined the colors as CSS custom properties (`--bg`, `--text`,
  `--surface`, ...) under two classes, `.theme-light` and `.theme-dark` (MDN). The `Layout` puts
  `theme-${theme}` on the wrapper div and all the other styles use `var(--...)`, so changing one
  class changes the whole page.
- **Only re-rendering the navbar when the count changes:** In the Zustand docs a component
  re-renders when the value returned by its selector changes. `selectItemCount` returns a number,
  so the navbar doesn't re-render when the cart changes in a way that keeps the same count. If a
  selector returned a new array or object every time, the component would re-render on every
  store update.

## Challenges

- My first idea was to call `useLocalStorage("theme")` in both `NavBar` and `Layout`, but then
  each one has its own state and clicking the button in the navbar doesn't change the layout. I
  moved the hook to `Layout` and passed the theme and the toggle function to `NavBar` as props.
- In `useFetch` I had to ignore `AbortError`. In development `StrictMode` runs effects twice, so
  the first request is always aborted, and without the check the page showed an error for a
  moment.
- I first wrote the "Next product" link as `` `/products/${id + 1}` `` and it went to
  `/products/31` from product 3, because `id` from the URL is a string.
- The Home link was always marked as active, until I added `end` to its `NavLink`.
