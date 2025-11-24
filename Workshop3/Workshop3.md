## Objectives
- Managing side effects with `useEffect`.
- Implementing Client-Side Routing with React Router.
- The Children Components 
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

## Children Components 
In React, components often need to wrap or contain other pieces of UI. Instead of hardcoding what goes inside them, React gives every component a special built-in prop called **children**. The `children` prop represents whatever is placed between a component’s opening and closing tags. This allows us to build flexible and reusable layout components that can hold different types of content without making assumptions about what that content is.
### Why the `children` Prop Exists
As applications grow, we frequently create components meant to act as containers or layouts such as cards, modals, navigation wrappers, or sidebar sections. These components shouldn’t decide what content they display. Instead, they should simply provide structure or styling, and allow the developer to fill in the content.  
The `children` prop solves this by letting us inject arbitrary UI into another component, keeping our components clean, modular, and adaptable.
### Creating a Component That Uses `children`
There is two ways to make React component accept the children we can use props then access children by using `props.children` or we can use ``{ children }`` destructor as parametre for the component that accept childrens.
```jsx
import { Children } from 'react';

function Card({ children }) {
  return <div className="card">{children}</div>;
}
```
Here, the `Card` component doesn’t know or care what content it will display. Its only job is to wrap the children with a styled `<div>`.
### Passing Children to a Component
To pass children, we simply write JSX between the component’s opening and closing tags. React automatically collects that JSX and hands it to the component as the `children` prop.
```jsx
function App() {
  return (
    <Card>
      <h2>Hello</h2>
      <p>This content is passed as children.</p>
    </Card>
  );
}
```
Everything inside `<Card> ... </Card>` becomes the value of `children` when `Card` renders.
### Accessing the `children` Prop

Inside the component, we can place `children` wherever we want it to appear. It can be rendered directly, surrounded by layout, or combined with additional elements.
```jsx
function Card({ children }) {
  return (
    <div className="card">
      <header>Card Header</header>
      <main>{children}</main>
      <footer>Card Footer</footer>
    </div>
  );
}
```
This pattern gives us fine-grained control over how our component wraps its content, without restricting what type of content can be inserted.
## The Context API
As our React applications grow in size, we may encounter a common issue known as Prop Drilling. This happens when a piece of data like a user profile or a theme value needs to be accessed deep inside the component tree, but the components in between don’t actually need it. We end up passing props through layers of components that don’t care about the data, creating unnecessary complexity and making the code harder to maintain.

React provides a built-in solution to this problem: the **Context API**.We can think of Context as a way to “broadcast” data to any component in our app without manually passing it down through every layer. Instead of drilling, we “teleport” values directly where they are needed.
### How Context Works
Context has three main parts, and each plays an important role in how data flows across our application.
#### Creating the Context
To start, we create a context object using `createContext`. This establishes a dedicated “data channel” that the rest of the app can access.
```jsx
import { createContext } from "react";

export const ThemeContext = createContext();
```
This gives us a container where we will store values we want to share globally like themes, user settings, or language preferences.
#### The Provider
Once our context is created, we use its **Provider** component to make the data available to any nested components. The Provider accepts a special prop called `value`. Whatever we put inside `value` becomes accessible to all children wrapped inside this Provider.
```jsx
function App() {
  return (
    <ThemeContext.Provider value="dark">
      <Dashboard />
    </ThemeContext.Provider>
  );
}
```
In this example, we wrap our `Dashboard` and everything inside it within `ThemeContext.Provider`. Every child component now has access to the value `"dark"` without receiving it through props.
#### Reading Context with `useContext`
Finally, whenever we want to use the shared data, we call the `useContext` hook. This hook looks for the nearest matching Provider above the component in the tree and gives us the exact value it holds.
```jsx
import { useContext } from "react";
import { ThemeContext } from "./ThemeContext";

function Button() {
  const theme = useContext(ThemeContext);

  return <button className={theme}>Click me</button>;
}
```
Here, the `Button` component instantly receives the value `"dark"` from the Provider. No props, no chains, no drilling.
### Why Use Context?
Context shines in situations where multiple components need access to the same information, such as:
- Authentication state (logged-in user)
- UI themes (dark/light mode)
- Language preferences (English, French, etc.)
- App-wide settings (currency, layout mode)
- Data from global stores or APIs


Instead of sending these values through multiple layers of components, Context centralizes them and makes them accessible anywhere in your application.

### A More Complete Example
Below is a small, fully functional demonstration of Context in action. Here, we share a theme value and toggle it using nested components.
```jsx
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Page />
    </ThemeContext.Provider>
  );
}

function Page() {
  return (
    <div>
      <h1>Welcome</h1>
      <ThemeToggle />
    </div>
  );
}

function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Current theme: {theme}
    </button>
  );
}
```
We first created our context using `createContext()`. This gave us a dedicated place to store shared values that multiple components might need, such as the current theme or user information. After that, we wrapped the parts of our application that require access to this data inside the Context Provider. The Provider accepts a `value` prop, and whatever we place inside it becomes globally available to all components nested within the Provider. In our example, the `App` component uses the Provider to expose both the current theme and the function used to toggle it.

From there, the data flows naturally through our component tree without needing to manually pass props. The `App` component holds a piece of state (the current theme) and makes it available to its children via the Provider. The `Page` component sits between the Provider and the component that actually needs the theme, but since `Page` does not use the theme itself, we don’t need to pass it down through props. Finally, the `ThemeToggle` component, which lives deeper in the tree, uses the `useContext(ThemeContext)` hook to instantly access both the current theme value and the updater function. Because of this, it can read and modify the theme without receiving anything from its parent.