# Workshop 3: Effects, APIs, and Browser Features

So far, the application has been able to describe and update information that already exists in browser memory. Most useful products also communicate with systems outside React: an API provides records, the browser stores preferences, and timers or subscriptions report changes over time. This workshop is about crossing that boundary responsibly. We will keep the same central question throughout: when something outside the component changes or needs to be contacted, how do we synchronize it without creating duplicate work, stale results, or memory leaks?

## Objectives

- Understand the purpose of `useEffect` and its dependency array.
- Fetch data from an API and represent loading, success, empty, and error states.
- Clean up asynchronous work when a component changes or unmounts.
- Understand when an Effect is unnecessary.
- Use `useRef` for DOM access and values that should not trigger a render.
- Create reusable custom Hooks.

## What Is an Effect?

A React component should be predictable: given its props and state, it describes the UI. Some tasks must synchronize the component with something outside React. Examples include:

- Subscribing to an event source or WebSocket.
- Starting and clearing a timer.
- Connecting to a third-party non-React widget.
- Fetching data in response to a component being displayed or a relevant input changing.
- Synchronizing with browser APIs such as `document.title`.

`useEffect` is the Hook for synchronizing a component with an external system. It is not a general-purpose place to put every piece of logic that happens after rendering.

The word “synchronize” is important. The component describes what should be on screen, but it may also need to start a timer, subscribe to an external event, set the browser tab title, or request data. Those operations are not part of calculating JSX. An Effect connects the committed React interface to that external system. If there is no external system to synchronize with, an Effect may not be needed at all.

## The `useEffect` Hook

```tsx
import { useEffect, useState } from 'react';

function PageTitle({ title }: { title: string }) {
  useEffect(() => {
    document.title = title;
  }, [title]);

  return <h1>{title}</h1>;
}
```

The Effect runs after React commits the UI. Its dependency array tells React which reactive values the Effect reads:

- No dependency array: runs after every commit.
- `[]`: runs after the component mounts; development Strict Mode can run an additional setup/cleanup cycle to detect problems.
- `[value]`: runs after the initial mount and again when `value` changes.

The dependency list is not a scheduling preference. It must include the reactive values used by the Effect. If changing the dependency list seems to create a loop, inspect the data flow instead of suppressing the dependency warning.

A helpful mental model is to read an Effect as a small synchronization process: when the component commits with a particular set of reactive values, establish the external relationship that corresponds to those values. If one of the values changes, clean up the old relationship and establish the new one. The dependency array describes which values define that relationship. It is not a switch for choosing how often you would like the code to run.

In development, Strict Mode may run an extra setup-and-cleanup cycle to expose Effects that are not safe to repeat. A correct Effect should tolerate that cycle. For example, a timer should be cleared before another is created; a subscription should be removed before another is registered. Do not remove Strict Mode merely to hide duplicate logs. Use the behavior as a signal to examine whether setup and cleanup are correctly paired.

### Cleanup

An Effect may return a cleanup function. React runs cleanup before setting up the Effect again with changed dependencies and when the component is removed.

```tsx
import { useEffect, useState } from 'react';

function Clock() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return <time>{time.toLocaleTimeString()}</time>;
}
```

Without cleanup, the interval could continue running after the component is removed or more than one timer could remain active.

Cleanup is not only for unmounting. When a dependency changes, React first runs the cleanup from the previous setup and then runs the Effect with the new values. That matters for subscriptions and requests that depend on a selected user, search query, or route parameter. Without cleanup, the component could keep listening to the old source or allow an old request to update the screen after the user has moved on.

## When You Do Not Need an Effect

Do not use an Effect to calculate a value that can be calculated during render:

```tsx
// Prefer deriving the value during render
const completedCount = tasks.filter((task) => task.completed).length;
const remainingCount = tasks.length - completedCount;
```

Do not store duplicated derived values in state if they can be calculated from existing props or state. Duplicated state can become inconsistent.

Do not use an Effect to handle a user event that already has an event handler. For example, call `addToCart()` from the click handler, not from an Effect that watches whether the cart changed.

Use an Effect when you need to synchronize with an external system—not merely because a value changed.

For example, if a user selects a category and you need to show the number of products in that category, calculate the count directly from the product array during render. Storing the count in a second state variable and updating it in an Effect creates two values that must stay synchronized. If one update is missed, the displayed count becomes stale. Derived data should normally be derived. By contrast, changing `document.title` or subscribing to a WebSocket really does interact with something outside React, so an Effect is an appropriate boundary.

## Fetching Data from an API

A remote request introduces time and uncertainty into the interface. The user may have a fast connection, a slow connection, no connection, an expired session, or a server that returns an error. We therefore need to model the request as a process rather than pretend that data is available immediately. A useful screen has a clear initial state, a loading state while waiting, a success state when data arrives, an empty state when the result contains no records, and an error state when the request cannot be completed.

A typical data request has several possible outcomes. Represent them explicitly so the interface can respond clearly:

```tsx
type RequestStatus = 'idle' | 'loading' | 'success' | 'error';
```

The example below fetches posts from a public demo API. It uses `AbortController` so an old request is cancelled when the component unmounts or the request is no longer relevant.

```tsx
import { useEffect, useState } from 'react';

type Post = {
  id: number;
  title: string;
  body: string;
};

type RequestStatus = 'loading' | 'success' | 'error';

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [status, setStatus] = useState<RequestStatus>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    async function loadPosts() {
      try {
        setStatus('loading');
        setErrorMessage('');

        const response = await fetch(
          'https://jsonplaceholder.typicode.com/posts?_limit=5',
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        // This assertion helps TypeScript in the example, but does not
        // validate the JSON at runtime. Validate untrusted API data in production.
        const data = (await response.json()) as Post[];
        setPosts(data);
        setStatus('success');
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return;
        }

        setErrorMessage(
          error instanceof Error ? error.message : 'An unexpected error occurred.',
        );
        setStatus('error');
      }
    }

    void loadPosts();

    return () => controller.abort();
  }, []);

  if (status === 'loading') {
    return <p role="status">Loading posts...</p>;
  }

  if (status === 'error') {
    return <p role="alert">Could not load posts: {errorMessage}</p>;
  }

  if (posts.length === 0) {
    return <p>No posts were found.</p>;
  }

  return (
    <main>
      <h1>Latest posts</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
```

### Why Check `response.ok`?

The `AbortController` in the example handles a different problem: relevance. A request may still be running even though the user has left the page or changed the query. Aborting it prevents unnecessary work and helps avoid stale results. Imagine typing “ca”, then “cam”, then “camera” into a search field. If the first request is slower than the third, it must not overwrite the newer result when it finally completes. Cancellation or a request identity check is part of making asynchronous interfaces correct, not just an optimization.

`fetch()` rejects for some network failures, but an HTTP response with status `404` or `500` is still a resolved response. Check `response.ok` and handle unsuccessful status codes explicitly.

### TypeScript Does Not Validate JSON

A type assertion such as `response.json() as Post[]` tells TypeScript to trust the developer. It does not inspect the response and prove that every property exists. For production data, validate unknown data at the boundary with a runtime schema library such as Zod or with explicit checks.

Treat the API boundary like the entrance to your application's trusted data model. The server may change its response, return `null` where a string was expected, or send an error structure instead of the requested records. A TypeScript interface is a promise made by the developer; it does not inspect the bytes received from the network. A robust data flow therefore looks like this: receive the response, check the HTTP status, parse the JSON as `unknown`, validate its shape, and only then pass the validated value into components that expect a `Post[]`. This keeps defensive checks near the boundary instead of scattering them through every visual component.

For an application that performs many API requests, consider a data-fetching solution such as TanStack Query or the data APIs provided by your routing/framework choice. They can help with caching, retries, synchronization, and request lifecycle management. The purpose here is to understand the browser and React fundamentals first.

## The `useRef` Hook

State and refs both preserve values between renders, but they serve different purposes. State is for information that should cause the interface to update when it changes. A ref is for a mutable value that a component needs to remember without making that value part of the rendered output. Keeping this distinction clear prevents a common mistake: using a ref for a value that the user expects to see change, or using state for a timer identifier that should not cause a render.

`useRef` stores a value that persists between renders without causing a re-render when it changes. A common use is obtaining a reference to a DOM element.

```tsx
import { useRef } from 'react';

function SearchBox() {
  const inputRef = useRef<HTMLInputElement>(null);

  function focusSearch() {
    inputRef.current?.focus();
  }

  return (
    <div>
      <label htmlFor="search-box">Search</label>
      <input id="search-box" ref={inputRef} />
      <button type="button" onClick={focusSearch}>Focus search</button>
    </div>
  );
}
```

The initial value is `null` because the DOM element does not exist before React mounts it. The optional chaining operator (`?.`) avoids calling `focus()` when the reference is still null.

Other uses include storing a timeout ID or keeping a mutable value that is needed by event handlers but should not be displayed. Do not use refs as a substitute for state when a change should update the screen.

The DOM reference example also demonstrates a controlled exception to React's declarative model. The browser already provides a focus API, and React refs give the component a safe way to access the mounted input when the user clicks the “Focus search” button. The component is not taking over normal rendering; it is asking the browser to perform an operation that belongs to the DOM. Use this approach for focus, measurement, media playback, or integration with a third-party widget when a declarative prop is not enough.

## Create a Custom Hook

As more features use timers, event listeners, or similar synchronization logic, the same behavior may appear in several components. Copying the code creates several places to maintain and several opportunities for cleanup to be missed. A custom Hook extracts the reusable stateful behavior into one function while allowing each caller to keep its own independent state.

A custom Hook is a function whose name begins with `use` and that can call other Hooks. It lets us reuse stateful logic without duplicating it across components.

Example: debounce a value so a search request does not run for every single keystroke.

```tsx
import { useEffect, useState } from 'react';

export function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedValue(value);
    }, delayMs);

    return () => window.clearTimeout(timeoutId);
  }, [value, delayMs]);

  return debouncedValue;
}
```

Use it in a component:

```tsx
function SearchPage() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 350);

  useEffect(() => {
    if (!debouncedQuery.trim()) return;
    // Synchronize with a search API here.
  }, [debouncedQuery]);

  return (
    <label>
      Search shows
      <input value={query} onChange={(event) => setQuery(event.target.value)} />
    </label>
  );
}
```

Custom Hooks should hide reusable behavior, not simply rename a component or create an abstraction with no clear benefit.

A custom Hook shares logic, not a single shared state instance. If two components call `useDebouncedValue` with different inputs, each call manages its own timer and debounced value. This is different from putting state in a global store. Also remember the Rules of Hooks: call Hooks at the top level of React components or other Hooks, not inside loops, conditions, or ordinary event handlers. That stable call order lets React associate Hook state with the correct component.

## Browser Storage

Browser storage is another external system. It can preserve a small preference after the page is refreshed, but it should not be confused with server persistence. A theme preference can safely be stored on the user's device; a stock quantity that multiple employees must see consistently belongs in the server-side data model. Choose storage based on who needs the information, how long it must survive, and whether it must be shared across devices or users.

`localStorage` stores string values in the browser and survives a page reload. It is useful for non-sensitive preferences or small client-side drafts. It is not a secure database and should not store sensitive secrets.

A small synchronization example:

```tsx
import { useEffect, useState } from 'react';

function ThemePreference() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  return (
    <button onClick={() => setTheme((current) => current === 'light' ? 'dark' : 'light')}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

This example is appropriate for a client-rendered browser app. Code that accesses `window` or `localStorage` needs special handling if the application later uses server-side rendering, because those browser globals do not exist on the server.

The lazy initializer passed to `useState` reads the preference only when the component initializes, rather than re-reading storage on every render. The Effect then writes the selected theme back when it changes. This is a small example of keeping browser interaction at the edge of the component. In more complex applications, consider how to handle invalid stored values, storage access failures, multiple tabs, and the possibility that the user has disabled storage.

## Workshop Challenge: API-Powered Search

Create a search page that:

1. Accepts a search term from a controlled input.
2. Debounces the value before making a request.
3. Displays loading, error, empty, and success states.
4. Cancels obsolete requests when a new search starts or the component unmounts.
5. Renders results with stable keys.
6. Uses a custom Hook for behavior that is genuinely reusable.
7. Does not inject untrusted API strings into the DOM as HTML.

## Professional Recap

- `useEffect` synchronizes React with external systems; it is not a generic lifecycle replacement.
- Every reactive value read by an Effect belongs in its dependency list.
- Clean up subscriptions, timers, and in-flight work when needed.
- Avoid Effects for values that can be derived during render or logic that belongs in an event handler.
- `fetch` requires explicit handling for HTTP error statuses.
- Type assertions do not validate external JSON at runtime.
- `useRef` persists mutable values without triggering a render; use state for values displayed in the UI.
- Custom Hooks share stateful logic; they do not share one state instance between all callers.

### Self-Check

Can you explain why an Effect needs cleanup? Can you distinguish a network error from an HTTP error? Can you show a loading and error state? Can you explain when `useRef` is more appropriate than `useState`? If not, revisit those sections.

## How This Leads to Workshop 4

You can now connect a component to data and browser features while keeping loading, error, and cleanup behavior explicit. As the application grows, users need stable ways to revisit that information and move between related views. Workshop 4 introduces URLs and routes, then uses the state lessons from this workshop to decide which information belongs in a page, in shared client state, or on the server.
