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

## Reasoning questions

### 1. State choices
- **Signed-in user:** in `AuthContext` (Context + `useReducer`). Many components need it (navbar,
  protected route, login) and it changes rarely, only on login and logout.
- **Cart:** in the Zustand store. It changes often and is read in many places (navbar count, cart
  page, add buttons), and with selectors each component only re-renders for the part it uses. It
  also has to be saved in `localStorage`, which is easy with `subscribe` outside React.
- **Filter values:** in the URL query string (`useSearchParams`). That way the filtered view can
  be shared as a link and survives a refresh, which normal state can't do.
- **Product list:** in the `useFetch` state of `ProductList`, because it is server data that only
  this page needs. The filtered list and the categories are not stored at all, they are computed
  from it during render.
- **Theme:** in `Layout` with `useLocalStorage`, because it has to survive reloads and the wrapper
  div that gets the class is in `Layout`. `NavBar` gets it as props.

### 2. Context versus store
When a Context value changes, every component that uses that context re-renders, even if it only
needs a small part of the value. That is fine for the user, who changes maybe twice per visit. The
cart changes every time someone clicks "Add to cart" or "+", so with Context the whole tree that
reads the cart would re-render each time, and I couldn't make the navbar re-render only when the
count changes. Putting the user in Zustand would work, but it would mean an extra global store for
something React already handles well, and the cart in Context would also need a `useEffect` in a
component to save it, which the assignment doesn't allow.

### 3. Custom hooks
`useFetch` shares the **logic**: the reducer with loading / error / data, starting the request
when the inputs change, aborting the old request in the cleanup and ignoring `AbortError`. It does
**not** share the **state**. `ProductList` and `ProductDetail` each call the hook and each get
their own reducer, so loading a product doesn't change the list and the other way around. It also
doesn't know what it fetches, each page passes its own function (`fetchProducts` or
`fetchProduct(id)`).

### 4. Route parameters
`useParams()` always gives strings, so on `/products/3` the `id` is `"3"`, not `3`. It mattered
for the "Next product" link: `id + 1` would give `"31"`, so I use `Number(id) + 1`. In the cart
the ids are numbers that come from the API object, not from the URL, so comparing them with `===`
works there. For `fetchProduct(id)` the string is fine because it only goes into the URL.

### 5. Protected routes
`ProtectedRoute` only decides what React renders in the browser. Anyone can open the dev tools,
change the state or call the API directly, and the "server" (`authApi.js`) is also code inside the
browser bundle, so the password is visible in the JavaScript. Real security needs a backend that
checks the password, gives back something like a session cookie or token, and checks it again on
every request for protected data. The client-side check would then only be there for a nicer UX.

### 6. Deep links
On a plain static file server, reloading `/products/3` makes the browser ask the server for a file
at `/products/3`. That file doesn't exist (there is only `index.html` and the assets), so the server
answers 404 and React never loads. The Vite development server has a fallback for single page apps:
when a path is not a real file, it sends `index.html`, then react-router reads the URL and shows the
right page. On a static host you have to configure the same thing, a rewrite of all paths to
`index.html`.

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
