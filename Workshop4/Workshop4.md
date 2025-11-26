## Objectives
- Working with React Advanced Concepts
- Performance Optimization and State Management
## Advanced React Concepts
We have covered the basics of components, state, and effects. Now, it is time to look at tools that make our applications scalable, maintainable, and robust. As applications grow, relying solely on `useState` or basic props can lead to messy code. We need advanced patterns to handle complexity.
### Default Props and Prop Validation
JavaScript is a loosely typed language. This means if we pass a number to a component that expects a string, or if we forget to pass a prop entirely, React won't stop us until the app crashes in the browser.

To prevent this, we use PropTypes to define expectations for our components, and Default Parameters to ensure values exist even if they aren't passed.
#### Validating with `prop-types`
To use validation, we need the `prop-types` package we can install it using `npm install prop-types`. This package allow us to create something like as a contract: "I expect `title` to be a string, and it is required."
```jsx
import PropTypes from 'prop-types';

function Button({ label, onClick, color = "blue" }) {
  // We used "blue" as a default parameter above
  const styles = { backgroundColor: color, color: "white" };

  return (
    <button style={styles} onClick={onClick}>
      {label}
    </button>
  );
}

// Defining the contract
Button.propTypes = {
  label: PropTypes.string.isRequired, // Must be a string, cannot be empty
  onClick: PropTypes.func,            // Must be a function
  color: PropTypes.string             // Must be a string (optional)
};
```
Here, In the function signature, we applied a **default parameter** to the `color` prop: `color = "blue"`. This ensures that if the parent component doesn't pass a `color` prop (e.g., `<Button label="Click" />`), the value won't be `undefined`; it will default to "blue". This prevents runtime errors and guarantees a baseline visual style.
    
We also used the external `prop-types` library to define a clear contract for how this component should be used. We did that by attaching the static `propTypes` property to the `Button` function.
- For the `label` prop, we set `PropTypes.string.isRequired`. This tells React that **`label` must be a string**, and it is **mandatory** for the component to render correctly.
- For `onClick`, we established that it must be a function (`PropTypes.func`).
- For `color`, we specified it should be a string (`PropTypes.string`), but since we didn't add `.isRequired`, it remains **optional**.
### Working with `useReducer`
We are used to `useState` for managing data. However, when state becomes complex for example, when one action changes multiple parts of the state, or when the next state depends heavily on the previous one `useState` can get messy.

`useReducer` is an alternative hook. It is based on the idea that instead of telling React what to change directly, we send an Action, and a central function (the Reducer) decides how to update the state.
#### The Three Parts of a Reducer
1. **State:** The current data.
2. **Dispatch:** A function used to send commands (Actions).
3. **Reducer:** A function that takes the current state and an action, and returns the new state.

```jsx
import { useReducer } from 'react';

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state; // Do nothing if action is unknown
  }
}

function Counter() {
  // 2. Initializing the hook
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      Count: {state.count}
      {/* 3. Dispatching Actions */}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  );
}
```
We start by creating a reducer function called `counterReducer`. This function receives two parameters: the current state and an action object. Based on the action’s `type`, the reducer returns a new state. In our case, it handles three possible actions: increasing the count, decreasing it, or resetting it back to zero. The reducer’s job is to decide how the state should change in response to each action.

After defining the reducer, we build the `Counter` component, which uses the `useReducer` hook to manage its internal state. Inside the component, we call `useReducer(counterReducer, { count: 0 })`. The first argument is the reducer function we created, and the second argument is the initial state here, an object with `count: 0`.

React returns an array containing two items: the current `state` and the `dispatch` function. The `state` represents the latest value managed by the reducer, and `dispatch` is what we use to send actions to that reducer. For example, when we call `dispatch({ type: 'increment' })`, React passes both the current state and that action to `counterReducer`. The reducer computes the new state and React updates the component accordingly.

Finally, inside the component’s JSX, we display the current count and add three buttons. Each button dispatches a different action decrement, reset, or increment. This structure keeps our state updates predictable, organized, and easy to maintain as the component grows more complex.
### Creating Custom Hooks
React’s built-in hooks don’t solve every problem. Sometimes you need a specific behavior or custom functionality. To handle these cases, React allows us to create Custom Hooks.

If you notice that you're repeating the same `useEffect` logic or state logic across multiple components such as fetching data, tracking window size, or checking if a user is online you are breaking the **DRY (Don’t Repeat Yourself)** principle. Instead of repeating that code, we can extract the shared logic into a separate function.

A custom hook is simply a JavaScript function that **starts with the word `use`** and uses other hooks inside it. This lets us reuse logic cleanly and makes our components simpler and easier to maintain.
#### Writing a Reusable `useFetch` Hook
Let's build a hook that handles the "Loading, Success, Error" pattern we learned earlier.
```jsx
import { useState, useEffect } from 'react';

function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Network response was not ok");
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]); 

  
  return { data, loading, error };
}

export default useFetch;
```
Here we create a function called `useFetch`, which serves as our custom hook for handling data fetching. Inside this function, we define three pieces of state: `data`, `loading`, and `error`. The hook uses `useEffect` to automatically run a fetch request whenever the `url` changes. Inside the effect, we define an asynchronous function that tries to fetch data from the provided URL. If the request succeeds, we store the result in `data`; if it fails, we capture the error message; and in all cases, we set `loading` to `false` when the request finishes. At the end, the hook returns an object containing `data`, `loading`, and `error`, allowing any component to use this hook and get all the necessary information for fetching data in a clean, reusable way.
#### Using the Custom Hook
Now, any component in our app can fetch data with a single line of code.
```jsx
import useFetch from './useFetch';

function UserList() {
  const { data, loading, error } = useFetch("https://jsonplaceholder.typicode.com/users");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {data.map(user => <li key={user.id}>{user.name}</li>)}
    </ul>
  );
}
```
By using the custom `useFetch` hook, the component becomes much cleaner and easier to read. Instead of handling the fetch logic, loading states, and error handling inside the component, we simply call `useFetch` and immediately receive `data`, `loading`, and `error`. This keeps the component focused on rendering the UI, while the hook manages all the fetching logic behind the scenes. It also makes the code reusable any component in the app can now fetch data with the same one-line hook call, following the DRY principle and improving overall maintainability.

### Advanced Routing
In the previous lecture, we created basic routes and links, but React Router offers much more powerful features for building real applications. When working with complex layouts, dashboards, authentication, and dynamic navigation, we often need nested routes, layout components, and **redirects** to control how users move through our app.
#### Nested Routing & The `<Outlet />`
Real applications frequently have layouts inside other layouts. For example, a dashboard might include a sidebar that never changes, while only the main content updates as the user navigates to "Profile," "Settings," or other pages. Instead of treating each page like a completely separate route, React Router lets us group them under a shared layout using Nested Routing.
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
Here’s what happens when the user visits `/dashboard/settings`:
1. React first matches the parent route `/dashboard`, so it renders the `DashboardLayout` component. This component acts like a wrapper or layout for all dashboard-related pages.
2. Inside `DashboardLayout`, React looks for the `<Outlet />` component.  
    `<Outlet />` is a placeholder that tells React Router:  
    “Insert the child route here whenever a nested route matches.”
3. React then matches the child route `"settings"`, which is nested inside the `/dashboard` route. It takes the `Settings` component and injects it directly into the `<Outlet />` position inside the layout

This allows us to create reusable layouts where only the inner content changes perfect for dashboards, admin panels, and multi-section pages.
#### Redirects
Sometimes we need to automatically send users to a different page. A common example is protecting routes: if someone tries to access the dashboard without being logged in, we redirect them to the homepage or login page. React Router provides the `<Navigate>` component for this purpose.
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
This `ProtectedRoute` component is used to control access to restricted pages. It receives a `user` value and the `children` it should render. If the `user` is not authenticated, it returns `<Navigate to="/" replace />`, which redirects the user to the home page. The `replace` prop ensures that the redirect replaces the current entry in the browser history instead of adding a new one. This prevents the user from clicking “Back” and returning to the protected page. If the user is logged in, the component simply renders the `children`, allowing access to the protected content.

### Form Validation
Handling forms manually with `useState` for every keystroke can cause performance issues and makes validation like checking email format, password length difficult.

While we can do it manually, the industry standard is to use a library like React Hook Form. It uses uncontrolled components (refs) to manage form data efficiently without re-rendering the component on every letter typed.
#### Practice: Signup Form with Validation
To use this, we must install the library: `npm install react-hook-form`.
```jsx
import { useForm } from "react-hook-form";

function SignupForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Username</label>
        
        <input 
          {...register("username", { required: "Username is required" })} 
        />
        {errors.username && <p className="error">{errors.username.message}</p>}
      </div>
      
      <div>
        <label>Email</label>
        <input 
          {...register("email", { 
            required: "Email is required", 
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email format"
            }
          })} 
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
}
```
We started by using the `useForm()` hook. It returns three main things we need:
- **`register`**  connects each input to the form and lets us add validation rules
- **`handleSubmit`** runs validation before calling our submit function
- **`errors`** stores error messages when a field fails validation
    
Next, we created the `onSubmit` function. This will run only when the form is submitted and all inputs pass validation. React Hook Form automatically gives it the form data.

Finally, we built the form itself. Each input is connected to the form using the `register()` function, which takes **two arguments**: the field name and an object defining the validation rules.
- For the username, we set it as **required**.
- For the email, we added both a **required rule** and a **pattern rule** to ensure the value matches a valid email format.

If an input does not meet its validation rule, React Hook Form adds an entry to `errors`. We check for that using `errors.fieldName`, and if it exists, we display the error message under the input.

This way, the form handles validation automatically, shows useful error messages, and only submits when the input values are valid.
## Performance Optimization and State Management
As our React applications grow, performance and state management become critical. Poorly managed state or unnecessary re-renders can slow down even small apps. In this section, we explore strategies to optimize performance and efficiently manage state.
### Memoization
In React, components re-render whenever their state or props change. But sometimes, re-renders are unnecessary and can impact performance. Memoization helps us cache values or functions to avoid redundant calculations or renders.

#### **`React.memo`**
By default, when a parent component re-renders, React re-renders all its children, even if the children's props haven't changed. This is often an unnecessary performance hit.

**`React.memo`** is a Higher-Order Component (HOC) that wraps a functional component. It tells React: "Only re-render this component if its props have changed."
```jsx
import React from "react";

const ListItem = React.memo(({ item }) => {
  console.log("Rendering:", item);
  return <li>{item}</li>;

});

function List({ items }) {
  return (
    <ul>
      {items.map(item => (
        <ListItem key={item} item={item} />
      ))}
    </ul>
  );
}
```
Here we **created a memoized `ListItem` component** using `React.memo`, which ensures that each item only re-renders when its `item` prop changes. By rendering the list through this memoized component, we prevent unnecessary re-renders when the parent `List` component updates, improving performance for large lists or heavy components. The `console.log` lets us observe exactly when each `ListItem` renders, demonstrating how memoization optimizes rendering.
#### **`useMemo` & `useCallback`**
While `React.memo` handles component-level optimization, `useMemo` and `useCallback` optimize values and functions inside a component.

**`useMemo` (Memoizes a Value):** This hook prevents the re-computation of an expensive function result on every render. It only re-calculates the value if one of its dependencies changes.
```jsx
import { useMemo } from "react";
const total = useMemo(() => numbers.reduce((a, b) => a + b, 0), [numbers]);
```
Here we **used the `useMemo` hook** to memoize a computed value. The `total` is calculated by summing all numbers in the `numbers` array, but thanks to `useMemo`, this computation only runs when the `numbers` array changes. This prevents unnecessary recalculations on every render, improving performance for expensive operations or large datasets.

**`useCallback` (Memoizes a Function):** This hook is specialized for **functions**. When a component re-renders, any function defined inside it is re-created (a new memory reference). This is a problem when passing functions as props to a memoized child component (`React.memo`), as the child will see a _new_ function reference on every render and re-render unnecessarily.

`useCallback` returns a memoized version of the function that only changes if one of its dependencies changes.

```jsx
const handleClick = useCallback(() => {
  console.log("Button clicked");

}, []);

```
The `useCallback` hook memoize the `handleClick` function. This means the function is only created once and won’t be redefined on every render. It’s useful when passing functions to child components, especially memoized ones, to prevent unnecessary re-renders and improve performance.
### Code Splitting & Lazy Loading
Code Splitting is the process of splitting our application's large JavaScript bundle into smaller chunks that can be loaded on demand. This improves the initial load time, as the user only downloads the code necessary for the current view.
#### `React.lazy` & `Suspense`
React provides built-in support for code splitting using dynamic imports combined with the **`React.lazy`** and **`Suspense`** components.

**`React.lazy`** allows us to render a dynamic import as a regular component. It automatically handles fetching the component's bundle.

**`<Suspense>`** is a wrapper component that handles the loading state while the lazy component is being downloaded. It takes a `fallback` prop, which is what React displays while the component is loading.

```jsx
import React, { Suspense } from "react";
const Profile = React.lazy(() => import("./Profile"));
function App() {
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <Profile />
      </Suspense>
    </div>
  );
}
```
In this example `React.lazy` and `Suspense` implement lazy loading. The `Profile` component is dynamically imported, meaning it is only loaded when needed, rather than at the initial app load. `Suspense` provides a fallback UI (`Loading...`) while the component is being fetched. This reduces the initial bundle size and improves performance, especially for large applications.
### State Management
#### Lifting State Up
The concept of Lifting State Up is fundamental in React when two or more sibling components need to share or react to the same piece of mutable data. The solution is to move (or "lift") the shared state up to the closest common parent component.

When the state is in the parent, the parent can pass the state down to one child component (e.g., to display it) and a function (a setter) to the other child component (e.g., to modify it).
#### Sharing State Between Components
Imagine you have a `TemperatureInput` component for Celsius and another for Fahrenheit, and changing one must update the other.

1. **Define the Shared State:** The parent component (`Calculator`) defines the state (`temperature`) and the setter function (`setTemperature`).
2. **Pass State and Handlers Down:** The parent passes the `temperature` as a prop to both children, and it passes the `setTemperature` function as a prop to the child that needs to change the state.
```jsx
// Parent Component (Lifts the state)
function SharedForm() {
  const [name, setName] = useState('');
  const handleNameChange = (newName) => {
    setName(newName);
  };
  return (
    <div>
      <NameInput onNameChange={handleNameChange} />
      <hr />
      <p>Current Name: **{name}**</p>
    </div>
  );
}

function NameInput({ onNameChange }) {
  return (
    <input
      type="text"
      placeholder="Enter your name"
      onChange={(e) => onNameChange(e.target.value)}
    />
  );
}
```
In this small example of **Lifting State Up**, we **created a parent component (`SharedForm`)** that holds the `name` state. We then passed a handler (`handleNameChange`) down to the child component (`NameInput`) as a prop. The child updates the parent’s state whenever the input changes, allowing both components to share and reflect the same state, keeping the data synchronized.
#### Redux Basics
While React has native tools like the Context API and `useReducer`, we can use Redux for managing complex global state. Redux enforces strict rules, making state changes predictable and easier to debug.  

Redux follows a unidirectional data flow with three main concepts:

1. **Store:** The single source of truth an object that holds the entire application state.
2. **Actions:** Plain JavaScript objects that describe **what happened**. They must have a `type` property (e.g., `{ type: 'INCREMENT' }`).
3. **Reducers:** Pure functions that take the `currentState` and an `action`, and return the `newState`. Reducers **must not mutate the state**; they always return a new state object.

To use Redux in React, we install **`react-redux`**, which connects the Redux store to our components using hooks:

- **`useSelector`:** Extracts data from the Redux store state.
- **`useDispatch`:** Returns the `dispatch` function, which sends an Action to the Store.

```jsx
import { createStore } from "redux";
// Initial state

const initialState = { count: 0 };

// Reducer
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    case "RESET":
      return { count: 0 };
    default:
      return state;
  }
}

// Create store

export const store = createStore(counterReducer);

```

We created a Redux store to manage a simple counter. We define an `initialState` with `count: 0` and a reducer* `counterReducer` that updates the state based on the action type (`INCREMENT`, `DECREMENT`, `RESET`). The reducer returns a new state object without mutating the original state. Finally, we create the store using `createStore(counterReducer)`, which holds the state and allows dispatching actions to update it.

```jsx

import React from "react";

import { Provider, useSelector, useDispatch } from "react-redux";

import { store } from "./store";

function Counter() {

  const count = useSelector(state => state.count);
  const dispatch = useDispatch();

  return (

    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch({ type: "DECREMENT" })}>-</button>
      <button onClick={() => dispatch({ type: "RESET" })}>Reset</button>
      <button onClick={() => dispatch({ type: "INCREMENT" })}>+</button>
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <Counter />
    </Provider>
  );
}

```
Now we wrapped  the `App` component with `<Provider store={store}>` to make the Redux store available to all child components. Inside `Counter`, we use **`useSelector`** to read the current `count` from the store and **`useDispatch`** to send actions (`INCREMENT`, `DECREMENT`, `RESET`) to the store. Clicking the buttons dispatches actions, which the reducer handles to update the state, and the UI automatically reflects the latest count.