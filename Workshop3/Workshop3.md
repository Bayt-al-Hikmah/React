## Objectives
- Managing side effects with `useEffect`.
- Implementing Client-Side Routing with React Router.
- Managing global state with Context API.
- Accessing the DOM directly using `useRef`.
## The Lifecycle of a Component
In the previous workshops, our components were relatively simple: they rendered UI based on props and state. However, real applications need to interact with the "outside world." They need to fetch data, change the document title, or set up subscriptions. These are called Side Effects.
### The `useEffect` Hook
The `useEffect` hook lets us perform side effects in function components. We can think of it as a way to say: "Run this code _after_ React updates the DOM."
```jsx
import { useEffect, useState } from 'react';

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Count: ${count}`;
  }, [count]);

  return <button onClick={() => setCount(count + 1)}>Click me</button>;
}
```
In this example, we update the browser tab's title every time the `count` value changes. The `useEffect` hook takes two arguments: the **function** we want to execute, and a dependency array. This array tells React exactly when to run the effect.
- **`[count]`**: Runs the effect only when the `count` variable changes.
- **`[]`** (Empty array): Runs the effect only once (when the component mounts). This is perfect for initial API calls.
- **No array**: Runs the effect after **every single render**. (Be careful: this can cause performance issues or infinite loops).

### Data Fetching
Most modern applications depend on data that lives on a remote server (like a database or an API). Because retrieving this data takes time (it is asynchronous), we cannot simply assign it to a variable and display it immediately.

Since fetching data interacts with the outside world, it is considered a Side Effect. Therefore, we combine useEffect to trigger the request with useState to save the result.

When working with external data, we generally need to manage three distinct states of the UI:

- Loading: The request has been sent, but the data hasn't arrived yet. We show a spinner or text.

- Success: The data has arrived successfully. We display the content.

- Error: The request failed (e.g., 404 or server down). We show an error message.
```jsx
function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      });
  }, []); // Empty array = Run once on mount

  if (loading) return <p>Loading...</p>;

  return <ul>{users.map(u => <li key={u.id}>{u.name}</li>)}</ul>;
}
```
We started by we definning two pieces of state.

- users: We initialize this as an empty array [] because we expect a list of items.
- loading: We initialize this as true. We assume the data is not ready the moment the component mounts, so we want the "Loading..." message to appear immediately.

Next, we placed our `fetch` call inside `useEffect`. We passed an empty dependency array (`[]`) as the second argument. This instructs React to run the function only once, immediately after the first render. Omitting this array would cause an infinite loop fetching data triggers a state update, which triggers a re-render, which triggers the effect again.

Inside the effect, we used the standard browser `fetch` API. We converted the raw response into JSON, and once we obtained the data, we performed a state update:
- `setUsers(data)` stores the list.
- `setLoading(false)` signals to React that we are finished waiting.

Before rendering the list, we check the loading state. This pattern is known as an "Early Return." If the data is still loading, we return a simple paragraph tag and stop execution. React ignores the rest of the function, preventing us from mapping over empty data or displaying a blank screen.

Once `loading` becomes `false`, the component re-renders. It skips the early return and proceeds to the final return statement. Here, we use the `.map()` method to iterate through our `users` state and generate the `<li>` items.
## Client-Side Routing
In traditional web development, every time you click a link, the browser makes a request to the server, the screen flashes white, and a brand new HTML page loads. This is slow and feels "clunky." 

In React, we build Single Page Applications (SPAs).
1. **Single Page:** We only load the HTML file once, when the user first visits.
2. **JavaScript Navigation:** When the user clicks a link, React intercepts that click, prevents the browser from refreshing, and instantly swaps the components on the screen.

To achieve this, we use the standard library: **React Router**.
### Setting Up The Router
To use routing, we need to import specific components from `react-router-dom`. Think of these as the building blocks of our navigation system.
```jsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      
      <nav>
        <Link to="/">Home</Link> | <Link to="/about">About</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>

    </BrowserRouter>
  );
}
```
We begin by wrapping our entire application with `<BrowserRouter>`. This component acts as the manager; it listens to the browser's address bar and notifies React whenever the URL changes.

Next, we create navigation links using the `<Link>` component. Instead of an `href`, this component uses a `to` prop to specify the destination route (e.g., `to="/about"`).

To determine **what** to display, we use the `<Routes>` component. This acts like a JavaScript `switch` statement: it looks at the current URL, scans through its children, and renders the **first** route that matches.

Finally, inside the `<Routes>` container, we define individual `<Route>` components. Each route takes two essential props:
- `path`: The URL pattern to look for (e.g., `/about`).
- `element`: The specific Component to render when that path matches.
### Navigation without Refresh (`<Link>`)
Why we didn't just use a standard HTML `<a href="...">` tag?

If we use `<a href="/about">`, the browser will force a hard refresh. This reloads our entire app, reconnects to the server, and wipes out any state we currently have like a shopping cart or a filled-out form.
```
// Don't do this (Causes a page refresh)
<a href="/about">Go to About</a>

// Do this (Instant transition, keeps state alive)
<Link to="/about">Go to About</Link>
```
The `<Link>` component updates the URL in the address bar effectively "silently," allowing the `<Routes>` component to see the change and update the screen instantly without reloading the page.
### Dynamic Routes & URL Params
Real applications rarely have static URLs like `/about` or `/contact`. Usually, we have data-driven pages. For example, if we have a database of 5,000 movies, we cannot write 5,000 separate `<Route>` lines.

Instead, we use Dynamic Segments.
#### The Setup
We use a colon `:` to tell React Router that a part of the URL is a variable, a placeholder.
```jsx
// In your App.js Routes
// The ":id" tells React: "Expect ANY value here, and call it 'id'"
<Route path="/movie/:id" element={<MovieDetail />} />
```
Here the id is place holder varibales and with this setting our path handles `/movie/1`, `/movie/godzilla`, `/movie/999`, etc.
#### The Extraction 
Now that the user is on `/movie/55`, how does the `MovieDetail` component know which movie to fetch? We use the `useParams` hook.
```jsx
// Inside MovieDetail.js
import { useParams } from 'react-router-dom';

function MovieDetail() {
  const params = useParams(); 
  
  const movieId = params.id; 

  return (
    <div>
      <h1>Movie Details</h1>
      <p>You are currently viewing the ID: {movieId}</p>
      {/* You would usually use this ID to fetch data from an API */}
    </div>
  );
}
```
Here, we use the `useParams()` hook to capture dynamic values from the URL. This hook returns an object containing key-value pairs of the URL parameters. Since we defined our route with `:id`, we access that specific value using `params.id`.

**How the data flows:**
1. The user clicks a link to `/movie/hero-wars`.
2. The Router matches this URL against the path `/movie/:id`.
3. The Router identifies that `"hero-wars"` is the value for the placeholder `:id`.
4. The `useParams()` hook returns the object: `{ id: "hero-wars" }`.
5. Our component reads this ID and uses it to fetch the correct movie data.
