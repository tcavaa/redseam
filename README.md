# RedSeam Clothing – React E‑commerce (JS)

A small but complete e‑commerce front‑end built with React + Vite. It showcases modern React fundamentals: function components, custom hooks, router‑based navigation, lazy loading, contextual auth and cart state, and clean separation between UI, data fetching, and utilities.

This project is intended for learning and admission review purposes. It integrates with a backend API via Axios (base URL is configurable via environment variables).

## Features

- Product listing with pagination, price filters, and sorting
- Product details page with gallery, colors, sizes, and add‑to‑cart
- Cart drawer with quantity update and removal
- Checkout form with validation (React Hook Form + Zod)
- Authentication (register, login, logout) with avatar upload
- Lazy‑loaded routes, error boundary, loading indicators

## Tech Stack

- React 19, React Router 7, Vite 7
- Axios for HTTP
- React Hook Form + Zod for forms/validation
- ESLint for linting, Prettier config for formatting

## Project Structure

```
src/
  api/            # Axios client and API modules (auth, cart, products)
  components/     # UI building blocks and feature components
    auth/
    cart/
    layout/
    products/
    ui/
  hooks/          # Custom hooks (auth, cart, products page, query params)
  pages/          # Route views (Products, ProductInner, Checkout, Auth, 404)
  utils/          # Small, focused utilities (filters, pagination, mapping)
  constants/      # App constants (routes, UI)
  App.jsx         # Router + providers
  main.jsx        # App entry
```

## Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm 9+ (or a compatible package manager)

### Installation

```bash
npm ci
```

### Environment Variables

Create a `.env` file at the project root with your API base URL:

```bash
# .env
VITE_API_BASE_URL=https://your-api.example.com
```

Notes:
- The app reads `import.meta.env.VITE_API_BASE_URL` to configure Axios (`src/api/client.js`).
- If this value is missing, API calls will fail. Use your own backend or a provided mock API.

### Development

```bash
npm run dev
```

Vite will print a local URL. Open it in your browser.

### Build

```bash
npm run build
npm run preview
```

## Available Scripts

- `npm run dev` – Start the development server (Vite)
- `npm run build` – Production build
- `npm run preview` – Preview the production build locally
- `npm run lint` – Run ESLint

## Routing & State Overview

- Entry: `src/main.jsx` mounts `<App />`
- Routes and providers: `src/App.jsx` (Auth and Cart context providers + `react-router-dom` routes)
- Auth: `src/hooks/useAuth.jsx` (login/register/logout, `localStorage` persistence)
- Cart: `src/hooks/useCart.jsx` (cart items, totals, open/close state)
- Products data and UI state: `src/hooks/useProductsPage.js`
- API modules: `src/api/{auth,cart,products}.js`

## Testing

Automated tests are not included. For manual verification:

1. Set `VITE_API_BASE_URL` to a working backend.
2. Visit Products → verify listing, pagination, filters, and sorting.
3. Open a product → select color/size, change quantity, add to cart.
4. Open cart drawer → increment/decrement/remove items; proceed to checkout.
5. Fill checkout form → validate required fields and formats; place order.
6. Register and log in/out → verify avatar upload and session persistence.

## Accessibility & UX Notes

- Buttons and icons include `alt` or `aria-*` attributes where appropriate.
- The cart and success dialogs use proper dialog semantics and ESC to close.
- Forms present inline error messages and accessible labels.

## Security Notes

- The auth token is stored in `localStorage` for simplicity. In production, prefer HTTP‑only cookies if supported by the API.
- Never commit real API keys or secrets. Configure via `.env`.

## Contributing / Future Improvements

- Add unit tests for utilities (`utils/pagination`, `utils/filters`) and hooks
- Introduce request cancellation via `AbortController` in data loaders
- Consider TanStack Query (React Query) for caching, dedupe, and retries
- Improve README with backend setup instructions or a mock server

## License

MIT (for educational/demo purposes)

