## Objectives
- Managing side effects with `useEffect`.
- Implementing Client-Side Routing with React Router.
- Managing global state with Context API.
- Accessing the DOM directly using `useRef`.
## Managing Side Effects 
In the previous workshops, our components were relatively simple: they rendered UI based on props and state. However, real applications need to interact with the "outside world." They need to fetch data, change the document title, or set up subscriptions. These are called Side Effects.
### The `useEffect` Hook
The `useEffect` hook lets us perform side effects in function components. We can think of it as a way to say: "Run this code after React updates the DOM."
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
Here we used a Side Effects, to update the browser tab's title every time the `count` value changes. The `useEffect` hook takes two arguments: the **function** we want to execute, and a dependency array. This array tells React exactly when to run the effect.
- **`[count]`**: Runs the effect only when the `count` variable changes.
- **`[]`** (Empty array): Runs the effect only once (when the component mounts). This is perfect for initial API calls.
- **No array**: Runs the effect after **every single render**. (Be careful: this can cause performance issues or infinite loops).

### Data Fetching
Side Effects shine when it come to getting data from external servers. Because retrieving this data takes time (it is asynchronous), we cannot simply assign it to a variable and display it immediately. to solve  that we combine useEffect to trigger the request with useState to save the result.

When working with external data, we generally need to manage three distinct states of the UI:
- Loading: The request has been sent, but the data hasn't arrived yet. We show a spinner or text.
- Success: The data has arrived successfully. We display the content.
- Error: The request failed (e.g., 404 or server down). We show an error message.à

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
We started by definning two pieces of state.
- users: We initialize this as an empty array [] because we expect a list of items.
- loading: We initialize this as true. The data isn't ready the moment the component mounts, so we want the "Loading..." message to appear immediately.

Next, we used  `fetch` call inside `useEffect` with the dependency array set to empty array (`[]`). This tell React to fetch data only after the first render. 

After fetching and retriving data. We converted the raw response into JSON, and update our states:
- `setUsers(data)` stores the list.
- `setLoading(false)` signals to React that we are finished waiting.

Before rendering the list, we check the loading state. This pattern is known as an "Early Return." If the data is still loading, we return a simple paragraph tag and stop execution.

Once `loading` becomes `false`, the component re-renders. It skips the early return and proceeds to the final return statement. Here, we use the `.map()` method to iterate through our `users` state and generate the `<li>` items.
## Client-Side Routing
In traditional web development, every time we click a link, the browser makes a request to the server, the screen flashes white, and a brand new HTML page loads. This is slow and feels "clunky." We loading a full html page for every interection

React, Focuse on building Single Page Applications (SPAs).
1. **Single Page:** We only load the HTML file once, when the user first visits.
2. **JavaScript Navigation:** When the user clicks a link, React intercepts that click, prevents the browser from refreshing, and instantly swaps the components on the screen.

To achieve this, we use the standard library: **React Router**.
### Setting Up The Router
First we need to install `react-router-dom` using `npm install react-router-dom` then we import it to our ``App.js`` file.
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
To create the routing system, We begin by wrapping our entire application with `<BrowserRouter>`. This component acts as the manager; it listens to the browser's address bar and notifies React whenever the URL changes.

Next, we create navigation links using the `<Link>` component. Instead of an `href`, this component uses a `to` prop to specify the destination route (e.g., `to="/about"`).

To determine **what** to display, we use the `<Routes>` component. This acts like a JavaScript `switch` statement: it looks at the current URL, scans through its children, and renders the first route that matches.

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
Real applications need more then just static URLs like `/about` or `/contact`. Usually, we have data-driven pages. For example, if we have a database of 5,000 movies, we cannot write 5,000 separate `<Route>` lines.

Instead, we use Dynamic Segments, where each movie had id and visiting the URL with that id will load it data.
#### The Setup
To apply that we use a colon `:` it tell React Router that a part of the URL is a variable, a placeholder.
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

### Advanced Routing
React Router offers much more powerful features thes hust building static and dynamic routes. When working with complex layouts, dashboards, authentication, and dynamic navigation, we often need nested routes, layout components, and **redirects** to control how users move through our app.
#### Nested Routing & The `<Outlet />`
Nested Routing is feature that allow us to create layouts inside other layouts. For example, a dashboard might include a sidebar that never changes, while only the main content updates as the user navigates to "Profile," "Settings," or other pages. Instead of treating each page like a completely separate route, React Router lets us group them under a shared layout using Nested Routing.
```jsx
import { Routes, Route, Link, Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav>
        <Link to="profile">Profile</Link> | <Link to="settings">Settings</Link>
      </nav>
      <hr />
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
```
Here both ``profile`` and ``settings`` live inside the dashboard routes and have shared layout so instead creating a completely separate route, we used the nested layout, when the user visits `/dashboard/settings`:
1. React first matches the parent route `/dashboard`, so it renders the `DashboardLayout` component. This component acts like a wrapper or layout for all dashboard-related pages.
2. Inside `DashboardLayout`, React looks for the `<Outlet />` component. which act like placeholder that tells React Router: “Insert the child route here whenever a nested route matches.”
3. React then matches the child route `"settings"`, which is nested inside the `/dashboard` route. It takes the `Settings` component and injects it directly into the `<Outlet />` position inside the layout
#### Redirects
The final powerfull feature that React Router offer is to automatically send and redirect users to a different page. A common example is protecting routes: if someone tries to access the dashboard without being logged in, we redirect them to the homepage or login page. React Router provides the `<Navigate>` component for this purpose.
```jsx
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ user, children }) {
  if (!user) {
    // Redirect to home if user is not defined
    return <Navigate to="/" replace />;
  }
  return children;
}
```
The `ProtectedRoute` component is used to control access to restricted pages. It receives a `user` value and the `children` it should render. If the `user` is not authenticated, it returns `<Navigate to="/" replace />`, which redirects the user to the home page. The `replace` prop ensures that the redirect replaces the current entry in the browser history instead of adding a new one. This prevents the user from clicking “Back” and returning to the protected page. If the user is logged in, the component simply renders the `children`, allowing access to the protected content.
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
## The `useRef` Hook
When data changes in React, we typically update **state**, which triggers the component to re-render and update the UI. However, not all values belong in state. Sometimes, we need to store information that persists between renders but **should not** cause the component to re-paint.

This is exactly where the `useRef` hook shines. It acts as an "escape hatch" from the standard React data flow.
### How It Works
`useRef` returns a mutable object with a single property: `.current`. We can think of it as a plain JavaScript object that React guarantees will stay the same (the object reference itself) for the full lifetime of the component.

We can see `useRef` as a box that we can put things into. We can take items out or put new items in (changing the `.current` value) whenever we want, and React won't notice or care.
### Why `useRef` Exists
React’s rendering cycle is designed strictly around state and prop changes. Whenever we update state, React calculates the DOM differences and updates the screen. However, forcing a re-render for "invisible" data is wasteful.

**Common scenarios where `useRef` is superior to `useState`:**

- **DOM Access:** Directly manipulating a DOM node (e.g., focusing an input, scrolling to an element, or measuring an element's size).
- **Timers and Intervals:** Storing IDs from `setInterval()` or `setTimeout()` so you can clear them later.
- **Previous Values:** Tracking the previous value of a state variable to compare it with the new one.
- **Instance Variables:** Storing data that isn't used for visual output (e.g., tracking if a component is mounted).


Placing these in state would cause unnecessary re-renders, which can hurt performance or cause unintended side effects.

`useRef` solves this by providing a stable container that persists between renders without asking React to update the UI.
### Creating a Ref
To create a ref, we call the `useRef` hook. The argument we pass to it becomes the **initial value** of the property.
```jsx
const inputRef = useRef(null);
```
The hook returns a plain JavaScript object that looks exactly like this:
```json
{
  current: null // or whatever initial value you passed
}
```
Any data stored in `.current` will live for the entire lifespan of the component, surviving every re-render.
### Using a Ref to Access the DOM
One of the primary use cases for `useRef` is accessing a DOM element directly. While React prefers to handle the DOM for us ("Declarative"), sometimes we need to get our hands dirty ("Imperative") for tasks like:

- Focusing an input on load or button click.
- Scrolling to a specific section.
- Measuring an element’s width or height.
- Interacting with HTML5 Canvas or Media players.


**Example: Focusing an Input**
```jsx
import { useRef } from 'react';

function Example() {

  const inputRef = useRef(null);

  const focusInput = () => {
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div>
      {/* 2. Attach the ref to the element using the ref={} attribute */}
      <input ref={inputRef} />
      
      {/* 3. Trigger the action via an event handler */}
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```
When the component first loads, `inputRef` is initialized as an object with a `current` property set to `null`. When React renders the `<input>` element, it notices the `ref` attribute and automatically assigns the actual DOM node of the input to `inputRef.current`. This means the ref now points directly to the browser’s underlying input element. As a result, when `focusInput` is called, it can bypass React entirely and interact directly with the DOM by invoking the browser’s native `.focus()` method on `inputRef.current`.
### Refs Persist Between Renders
A key superpower of `useRef` is that it never resets during re-renders, yet updating it does not trigger a new render. This makes it perfect for "hidden state" data that needs to be remembered but doesn't affect what the user sees.

**Example:**   
Storing Previous Value Without Triggering Re-renders
```jsx
import { useEffect, useRef, useState } from 'react';

function PreviousValueExample() {
  const [count, setCount] = useState(0);
  const previousCount = useRef(null);

  useEffect(() => {
    
    previousCount.current = count;
  });

  return (
    <div>
      <h1>Current: {count}</h1>
      <h2>Previous: {previousCount.current}</h2>

      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```
In this example, we create a normal state variable `count` and a ref called `previousCount`. Since refs persist across renders without causing re-renders, they are perfect for storing values like “the previous state.” We use a `useEffect` **without a dependency array**, which means the effect runs after **every** render. Inside this effect, we simply update `previousCount.current` to match the latest value of `count`. Because updating a ref does _not_ trigger a re-render, this avoids unnecessary updates.    

The component displays both the current count (from state) and the previous count (from the ref). When the user clicks the "Increment" button, `setCount` updates the state, which triggers a re-render. After that render completes, the effect runs again and stores the new previous value.   

If we tried to store the previous value using `useState`, updating the state inside the effect would cause another render, which would update the state again, and so on creating an infinite loop. Using `useRef` avoids this problem because refs update silently without triggering React’s render cycle.

## Building a Movie Database App
### Introduction
Let's combine the concepts of API fetching, Routing, and Context to build a "Mini Movie DB." Users will be able to search for TV shows using the **TVMaze API**, view a list of results, and click on a show to see a dedicated details page.

We will also implement a global "Dark Mode" feature using React Context to manage state across the entire application without passing props manually through every level.
### App Logic
Before we write code, let's break down the requirements:
1. **Home Page:** This needs a search bar and a grid to display results. We will use `useRef` to capture input and `useEffect` to fetch data from the API.
2. **Details Page:** When a user clicks a movie, we need a dedicated page. We will use URL Parameters (`:id`) to fetch details for that specific show.
3. **Global State:** We need a toggle for Light/Dark mode that persists regardless of which page we are on.
### Project Structure & Organization
Up until now, we might have written multiple components inside a single `App.js` file for simplicity. However, as applications grow, this becomes unmanageable.

For this project, we will move each component into its own file. This practice, known as Separation of Concerns, makes code easier to read, debug, and reuse.

Our folder structure inside `src/` should look like this:
```
src/
 ├── components/
 │     ├── Home.jsx
 │     ├── ShowDetail.jsx
 ├── context/
 │     └── ThemeContext.jsx
 ├── App.js
 ├── App.css
 └── index.js
```
### Creating the Components
Now, let's build our components file by file.
#### Theme Context (`ThemeContext.js`)
First, we create a context to manage our styling globally. This allows us to avoid "prop-drilling" , passing the theme prop down through layers of components that don't need it.

**Create a file named `ThemeContext.js`:**
```jsx
import { createContext, useState, useContext } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      <div className={darkMode ? "app dark" : "app light"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
```
In this code, we start by creating a context using `createContext()`. A context is like a shared storage space that React can use to pass data deeply through the component tree without needing to pass props manually at every level. In this case, `ThemeContext` will hold information about the theme, such as whether the app is in dark mode or light mode.

The `ThemeProvider` is a component we created to “provide” this shared data to anything inside it. Inside the provider, we use `useState(false)` to store a boolean called `darkMode`. This value tells us which theme is currently active. We also define a function called `toggleTheme` that flips this value between true and false. The provider then wraps its children in `ThemeContext.Provider` and sends the values `{ darkMode, toggleTheme }` to all nested components. Additionally, it applies a different CSS class depending on whether dark mode is active, allowing the UI to visually update.

The `useContext` hook is used to read the data stored in a context. Instead of using `useContext(ThemeContext)` everywhere, we create a small helper called `useTheme`. This custom hook simply calls `useContext(ThemeContext)` for us. This makes it easier and cleaner for any component to access the theme. When a component calls `useTheme()`, it receives the current `darkMode` value and the `toggleTheme` function.

In short, `createContext` creates the shared space, `ThemeProvider` fills that space with values and makes them available to the app, and `useContext` (wrapped inside our `useTheme` hook) allows any component to read and use that shared data.
#### The Home Page (`Home.js`)
This component handles the search logic.

**Create a file named `Home.js`:**
```jsx
import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [shows, setShows] = useState([]);
  const searchInput = useRef(null); 

  const searchShows = async () => {
    const query = searchInput.current.value;
    if(!query) return;

    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    const data = await response.json();
    setShows(data);
  };

  return (
    <div className="container">
      <h1>TV Show Search</h1>
      <div className="search-bar">
        <input ref={searchInput} type="text" placeholder="e.g. Breaking Bad" />
        <button onClick={searchShows}>Search</button>
      </div>

      <div className="grid">
        {shows.map((item) => (
          <div key={item.show.id} className="card">
            <img src={item.show.image?.medium} alt={item.show.name} />
            <h3>{item.show.name}</h3>
            <Link to={`/show/${item.show.id}`}>View Details</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Home;
```
In this component, we use two hooks. `useState([])` stores the list of TV shows returned from the API, and `useRef(null)` gives us a direct reference to the input field so we can read its value without storing it in state.

The `searchShows` function runs when the user clicks the Search button. It reads the text from the input using `searchInput.current.value`. If the user typed something, we call the TVMaze API using `fetch`, convert the response to JSON, and save the results in the `shows` state. Updating the state automatically displays the new list of shows.

The UI includes a search bar and a grid of show cards. Each card shows an image, the show’s name, and a link. The `<Link>` component sends the user to a dynamic route like `/show/ID`, where they can view more details about the selected show.

We export the `Home` component so it can be used as one of the pages in our React Router app.
#### The Details Page (`ShowDetail.js`)
When a user clicks a link, this component loads. It grabs the ID from the URL and fetches the specific data.

**Create a file named `ShowDetail.js`:**
```jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function ShowDetail() {
  const { id } = useParams(); // Get the ID from URL (e.g., /show/123)
  const [show, setShow] = useState(null);

  useEffect(() => {
    fetch(`https://api.tvmaze.com/shows/${id}`)
      .then(res => res.json())
      .then(data => setShow(data));
  }, [id]);

  if (!show) return <h2>Loading...</h2>;

  return (
    <div className="container detail-page">
      <Link to="/" className="back-btn">← Back</Link>
      <div className="detail-content">
        <img src={show.image?.original} alt={show.name} />
        <div>
          <h1>{show.name}</h1>
          <p dangerouslySetInnerHTML={{ __html: show.summary }}></p>
          <p><strong>Rating:</strong> {show.rating?.average}</p>
        </div>
      </div>
    </div>
  );
}
export default ShowDetail;
```
The ``ShowDetail`` component display detail about show, we use React Router’s `useParams()` to get the show’s ID from the URL. This lets us know which show the user wants to view. We store the show’s data in state using `useState(null)`.

The `useEffect` hook runs whenever the `id` changes. Inside it, we fetch detailed information about the show from the TVMaze API using the ID from the URL. Once the data arrives, we update the `show` state, and the page re-renders with the show’s details.

Before the data loads, we return a simple “Loading…” message. After that, the page displays the show’s image, title, summary, and rating. The summary is rendered using `dangerouslySetInnerHTML` because the API returns HTML tags inside the text.

We also include a `<Link>` at the top that takes the user back to the home page. Finally, we export the `ShowDetail` component so it can be used in our router setup as the page for viewing individual show details.
#### The App (`App.js`)
Finally, we bring everything together. `App.js` acts as the traffic controller for our application.

**Update your `App.js`:**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import ShowDetail from './components/ShowDetail';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import './App.css';
// A small Header component to hold the Theme Toggle
function Header() {
  const { darkMode, toggleTheme } = useTheme();
  return (
    <header>
      <span>🎬 MovieDB</span>
      <button onClick={toggleTheme}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>
    </header>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/show/:id" element={<ShowDetail />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
```
Finally, in our `App.js`, we import all the components we need. First, we create a **Header** component, which displays the app title and includes a button to switch between light and dark mode using our theme context.

After that, we define the **App** component. We wrap the entire app in two wrappers: **`ThemeProvider`**, which gives every component access to the dark mode state, and **`BrowserRouter`**, which enables routing between pages. Inside `<Routes>`, we define our paths: `/` for the `Home` component and `/show/:id` for the dynamic `ShowDetail` page, where `:id` corresponds to the selected show’s ID.
### Adding Styles
To visualize the Dark/Light mode and organize the grid, replace the content of `App.css` with the following:
```css
/* Global App Themes */
.app { min-height: 100vh; transition: 0.3s; font-family: sans-serif; }
.app.light { background: #f4f4f4; color: #333; }
.app.dark { background: #222; color: #fff; }
.app.dark a { color: #4da6ff; }

/* Header */
header {
  display: flex; justify-content: space-between; padding: 20px;
  background: rgba(0,0,0,0.1); align-items: center;
}

.container { max-width: 800px; margin: 0 auto; padding: 20px; }

/* Search */
.search-bar { display: flex; gap: 10px; margin-bottom: 30px; }
input { flex: 1; padding: 10px; border-radius: 5px; border: 1px solid #ccc; }
button { padding: 10px 20px; cursor: pointer; }

/* Grid */
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; }
.card { background: rgba(255,255,255,0.1); padding: 10px; border-radius: 8px; text-align: center; }
.card img { width: 100%; border-radius: 5px; }
.card h3 { font-size: 1rem; margin: 10px 0; }

/* Detail Page */
.detail-content { display: flex; gap: 20px; margin-top: 20px; }
.detail-content img { max-width: 300px; }
```

The CSS relies on the `.app` div in `ThemeContext.js` switching classes between `.light` and `.dark`. When the state changes, these CSS variables apply immediately, creating a seamless theme switch.
