# Workshop 4: Routing and Application State

Once an application has useful interactions, users need more than one screen. They expect to open a detail page directly, refresh it, bookmark it, and return to a previous screen with the browser's Back button. Those expectations introduce two connected ideas: navigation and state ownership. This workshop expands the task manager into a small multi-page application and then examines which information should live in a component, in the URL, in Context, in a global client store, or on the server.

## Objectives

- Understand the difference between a component and a route.
- Build client-side navigation with the current `react-router` package.
- Work with route parameters, nested layouts, redirects, and query strings.
- Share app-wide client state with Context.
- Decide when Context is enough and when a dedicated state library may help.
- Recognize Redux Toolkit as the modern Redux approach.

## Why Do We Need Routing?

A component describes part of the UI. A route connects a URL to the component or layout that should appear for that URL. Routing enables users to navigate between screens, use browser Back and Forward, bookmark a page, and share a link.

In a client-side application, a router handles navigation without requesting a completely new HTML document for every route. The production web server must still be configured to serve the app entry point for valid application routes; otherwise, refreshing `/shows/123` may return a server `404` even when client-side navigation works.

A useful distinction is that the router manages navigation inside the browser, while the hosting server manages the first request for a URL. When the user clicks an internal link, the router can update the visible page using browser history. When the user types `/shows/123` into the address bar or refreshes that page, the browser sends a request to the server for that path. The server must know to return the SPA entry document for application routes. Both sides must be configured for direct links to work reliably.

## Install React Router

This course uses the current declarative API from the `react-router` package:

```bash
npm install react-router
```

The examples import from `react-router`. Avoid copying code from older tutorials without checking which React Router major version they target; package names and APIs have changed across versions.

## Set Up Routes

A route table makes the application's navigation structure explicit. Each route associates a path pattern with a screen, and the catch-all route defines what should happen when no pattern matches. As the application grows, this route table becomes a map of the user-facing sections. Name routes according to the resources and tasks users understand—such as `/products`, `/products/:productId`, or `/settings`—rather than exposing the folder structure of the source code.

Wrap the application in `BrowserRouter`, then declare route patterns with `Routes` and `Route`:

```tsx
import { BrowserRouter, Route, Routes } from 'react-router';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

The `*` route is a catch-all route. It provides a meaningful not-found screen for URLs that do not match another route.

### Navigate Without a Full Page Reload

Use `Link` for navigation inside the application:

```tsx
import { Link } from 'react-router';

function MainNavigation() {
  return (
    <nav aria-label="Main navigation">
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
    </nav>
  );
}
```

Use an ordinary `<a>` element for external websites. Use a router `Link` for internal application routes. `NavLink` is useful when the active navigation item needs a selected style or accessible state.

The difference is about who owns the destination. Internal navigation should remain inside the application's routing system so the URL, rendered screen, and browser history stay coordinated. An external link leaves the application and should retain normal browser navigation behavior. A navigation item should also communicate its current state: a user moving through a dashboard needs to know which section they are viewing. `NavLink` can help express that active state without requiring manual pathname checks in every navigation component.

## Dynamic Routes and URL Parameters

Many pages display one record selected by an ID. A route can express that with a parameter:

```tsx
<Route path="/shows/:showId" element={<ShowDetailsPage />} />
```

Read the parameter with `useParams`:

```tsx
import { Link, useParams } from 'react-router';

function ShowDetailsPage() {
  const { showId } = useParams();

  if (!showId) {
    return <p role="alert">A show ID is required.</p>;
  }

  return (
    <main>
      <h1>Show {showId}</h1>
      <Link to="/shows">Back to shows</Link>
    </main>
  );
}
```

A URL parameter is external input. Validate it before using it in a request or assuming it is a valid database identifier.

Think about the difference between a syntactically present parameter and a valid record. `showId` may exist but still contain a value that your API cannot recognize. If the application expects a numeric identifier, parse it and handle invalid input before making the request. If identifiers are UUIDs, validate that format instead. A route pattern only extracts text from the URL; it does not prove that the requested resource exists or that the current user has permission to see it.

## Nested Routes and Layouts

Many applications share a header, navigation, sidebar, or footer across pages. Instead of repeating that structure, create a layout route and render its child route through `<Outlet />`.

```tsx
import { Link, Outlet } from 'react-router';

function AppLayout() {
  return (
    <div className="app-shell">
      <header>
        <Link to="/">My Application</Link>
      </header>
      <div className="app-shell__body">
        <aside aria-label="Sidebar navigation">
          <nav>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/settings">Settings</Link>
          </nav>
        </aside>
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
```

Declare child routes inside a parent route:

```tsx
<Routes>
  <Route element={<AppLayout />}>
    <Route path="/dashboard" element={<DashboardPage />} />
    <Route path="/settings" element={<SettingsPage />} />
  </Route>
</Routes>
```

The shared layout remains while the matched child route changes.

This structure mirrors how users think about an application. The navigation and page frame are persistent, while the central content changes as the user moves from dashboard to settings or product details. A layout route avoids repeating the same header and sidebar in every page component. It also gives the product one place to keep global navigation behavior consistent. The `<Outlet />` is the insertion point where the router renders the currently matched child route.

## Redirects and Query Parameters

Use `Navigate` when the rendered route should send the user to another location:

```tsx
import { Navigate } from 'react-router';

function LegacyPage() {
  return <Navigate to="/dashboard" replace />;
}
```

Query parameters represent optional state in the URL, such as a search term or selected page:

```tsx
import { useSearchParams } from 'react-router';

function ProductSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  return (
    <label>
      Search products
      <input
        value={query}
        onChange={(event) => {
          const nextParams = new URLSearchParams(searchParams);
          if (event.target.value) nextParams.set('q', event.target.value);
          else nextParams.delete('q');
          setSearchParams(nextParams);
        }}
      />
    </label>
  );
}
```

Putting shareable page state in the URL can improve bookmarking and navigation. Do not put passwords, access tokens, or private information in a URL.

A useful decision rule is to ask whether another person should be able to copy the URL and arrive at the same meaningful view. Search terms, filters, sort order, and page numbers often belong in query parameters because they describe the current view. A temporary input that has not been submitted yet may remain local component state. Authentication credentials and confidential data do not belong in the URL because URLs can be stored in browser history, logs, and referrer information.

## The Context API

Props are still the default communication mechanism when the component relationship is clear. Context becomes useful when a value is needed by many descendants and passing it through every intermediate component would add noise. A theme is a good example: buttons, cards, menus, and page layouts may all need to know whether the application is in light or dark mode, even though the components between the provider and those controls do not use the theme themselves.

Props work well when data flows through a small component tree. When many deeply nested components need the same value—such as a theme, locale, or signed-in user—passing the same prop through every intermediate component can become inconvenient. Context provides a way to make a value available to a subtree.

```tsx
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  function toggleTheme() {
    setTheme((current) => current === 'light' ? 'dark' : 'light');
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider');
  }
  return context;
}
```

Wrap the part of the application that needs the value:

```tsx
function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}
```

A component inside the provider can call `useTheme()`. The custom Hook provides a clear error if the component is accidentally rendered outside the provider.

The provider is the boundary of the shared value. Place it high enough that all intended consumers can access it, but no higher than necessary. The `undefined` initial context value is deliberate: it allows the custom Hook to detect a missing provider rather than silently returning a fake default. This makes configuration mistakes visible during development. When you introduce several unrelated contexts—theme, authentication summary, locale—separate providers can make dependencies and update frequency easier to understand.

### Context Is Not a Default Global Store

Context answers the question “how can this subtree read a value?” It does not automatically answer “how should a complex data domain be updated, cached, inspected, or persisted?” If a provider value changes frequently, every consumer that reads that context may need to render again. Keep provider values focused, split unrelated concerns, and avoid turning Context into one huge object that contains every record and every action in the application.

Context is useful for values shared by a subtree, especially values that change infrequently. It does not automatically provide all the features of a state management library. Large, frequently changing context values can cause broad re-renders if the provider and consumer structure is not designed carefully.

Before adding Context, ask whether the value can remain local, be passed through a small number of props, or be derived from the URL.

## Client State vs. Server State

This distinction is one of the most useful architecture decisions in a real product. A selected tab is controlled by the user interface and can usually be recreated locally. A product record is owned by the server and may change when another employee edits it. Treating both values as if they had the same lifecycle leads to unnecessary synchronization code and stale data.

It is useful to separate two categories:

**Client state** belongs to the interface: a selected tab, open dialog, theme, draft input, or local wizard step.

**Server state** comes from an external system: products, user profiles, orders, permissions, or search results. It has loading and error states, can become stale, and may need caching or revalidation.

React state, reducers, and Context can manage client state. For server state, consider a route loader or a data-fetching library when caching, retries, deduplication, or background refresh are important. Do not put every piece of server data into one global Context simply because many components need it.

For example, a product list may be fetched from an API, cached for a short period, refreshed when the user revisits the page, and invalidated after a successful update. That is a server-state problem. A filter panel's open/closed state is a client-state problem. The two can work together, but they should not be forced into one storage mechanism. A data-fetching library or a router's data APIs can handle server data lifecycle concerns, while React state and Context can manage interface preferences and shared client behavior.

## Redux Toolkit: A Professional Introduction

Redux Toolkit becomes useful when multiple distant parts of the application must coordinate around a complex client-state model and a predictable update history is valuable. It is not the next mandatory step after Context. Before adding it, check whether state can be kept inside a feature, lifted to a common parent, represented in the URL, or managed by a server-state tool. A global store adds concepts and conventions; use it when those conventions solve a real coordination problem.

For a larger application with complex shared client state, Redux Toolkit offers a structured approach. New Redux code should use Redux Toolkit rather than the older hand-written `createStore` pattern.

Install the packages:

```bash
npm install @reduxjs/toolkit react-redux
```

Create a slice:

```tsx
// features/counter/counterSlice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type CounterState = {
  value: number;
};

const initialState: CounterState = { value: 0 };

const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {
    increment(state) {
      state.value += 1;
    },
    decrement(state) {
      state.value -= 1;
    },
    setValue(state, action: PayloadAction<number>) {
      state.value = action.payload;
    },
  },
});

export const { increment, decrement, setValue } = counterSlice.actions;
export default counterSlice.reducer;
```

Create the store:

```tsx
// app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from '../features/counter/counterSlice';

export const store = configureStore({
  reducer: {
    counter: counterReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

Create typed Hooks:

```tsx
// app/hooks.ts
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

Provide the store near the application root:

```tsx
import { Provider } from 'react-redux';
import { store } from './app/store';

function App() {
  return (
    <Provider store={store}>
      <AppRoutes />
    </Provider>
  );
}
```

A component can now use the store:

```tsx
import { decrement, increment } from './counterSlice';
import { useAppDispatch, useAppSelector } from '../../app/hooks';

function CounterPanel() {
  const value = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <section>
      <p>Count: {value}</p>
      <button onClick={() => dispatch(decrement())}>-</button>
      <button onClick={() => dispatch(increment())}>+</button>
    </section>
  );
}
```

Redux Toolkit uses Immer internally so reducer code can use this apparent mutation syntax safely. Do not copy this syntax into a plain React state updater or a normal reducer; there, return new objects and arrays instead of mutating the current state.

This is an intentional convenience provided by Redux Toolkit's Immer integration. It records the apparent changes and produces an immutable next state behind the scenes. The syntax looks like mutation, but the stored Redux state is still updated immutably. This behavior belongs to that library's reducer implementation; it is not a general permission to mutate React state arrays or objects. Understanding that distinction prevents one of the most common copy-and-paste mistakes between Redux examples and ordinary `useState` code.

Redux is not mandatory for every React application. Learn local state and Context first, then add a store only when the coordination problem justifies it.

## Workshop Challenge: Multi-Page Application

Extend the task manager into a small application:

1. Add `/tasks`, `/tasks/:taskId`, and `/settings` routes.
2. Create a shared application layout with a navigation bar.
3. Use `NavLink` to show the active route.
4. Display a task detail page using a URL parameter.
5. Store the theme preference in Context.
6. Add a not-found route.
7. Refresh the browser directly on a nested route and confirm your hosting setup supports it.
8. Explain which state should remain local, which belongs in Context, and which should come from the server.

## Professional Recap

- A route maps a URL to a UI; a component is a reusable piece of that UI.
- Use the current `react-router` package and verify the version before copying tutorial snippets.
- `Link` is for internal navigation; ordinary anchors are for external websites.
- URL parameters and query strings are input and must be validated.
- `<Outlet />` renders a nested route inside a shared layout.
- Context makes values available to a subtree; it is not automatically the best store for all application data.
- Separate client state from server state.
- Use Redux Toolkit for Redux projects; avoid the old `createStore` teaching pattern in new code.

### Self-Check

Can you build nested routes and read a route parameter? Can you explain the difference between URL state, local component state, Context, and server state? Can you explain why a Redux Toolkit slice is not the same as mutating ordinary React state? If not, revisit those sections.

## How This Leads to Workshop 5

The application now has multiple screens and a clearer model for navigation and state. The next challenge is making those screens feel like one coherent product. Workshop 5 moves from behavior to design decisions: we will establish the principles that guide the interface, define a shared visual and interaction language, store repeated values as tokens, and use components and templates to apply that language consistently.
