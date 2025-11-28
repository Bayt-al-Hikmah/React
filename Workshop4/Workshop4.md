## Objectives
- Default Props and Prop Validation
- Creating Costum Hooks
- Working with Redux
- Higher-Order Components And Portals
- Performance Optimization

## Default Props and Prop Validation
JavaScript is a loosely typed language. This means if we pass a number to a component that expects a string, or if we forget to pass a prop entirely, React won't stop us until the app crashes in the browser.To prevent this, we use PropTypes to define expectations for our components, and Default Parameters to ensure values exist even if they aren't passed.
### Default Props
To set a default, we simply assign a value to the props in the function declaration.
```jsx
function Button({ label, onClick, color = "blue" }) {
  // We used "blue" as a default parameter above
  const styles = { backgroundColor: color, color: "white" };

  return (
    <button style={styles} onClick={onClick}>
      {label}
    </button>
  );
}
```
Here, In the function signature, we applied a **default parameter** to the `color` prop: `color = "blue"`. This ensures that if the parent component doesn't pass a `color` prop (e.g., `<Button label="Click" />`), the value won't be `undefined`; it will default to "blue".
### Prop Validation
To use validation, we need the `prop-types` package, we can install it using `npm install prop-types`. This package allow us to create something like as a contract: "I expect `title` to be a string, and it is required."
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
Here we added validation to our props, we used the external `prop-types` library to define a clear contract for how this component should be used. We did that by attaching the static `propTypes` property to the `Button` function.
- For the `label` prop, we set `PropTypes.string.isRequired`. This tells React that **`label` must be a string**, and it is **mandatory** for the component to render correctly.
- For `onClick`, we established that it must be a function (`PropTypes.func`).
- For `color`, we specified it should be a string (`PropTypes.string`), but since we didn't add `.isRequired`, it remains **optional**.
## Creating Custom Hooks
React’s built-in hooks don’t solve every problem. Sometimes we need a specific behavior or custom functionality. To handle these cases, React allows us to create Custom Hooks.

A custom hook is simply a JavaScript function that starts with the word `use` and uses other hooks inside it. This lets us reuse logic cleanly and makes our components simpler and easier to maintain.
### Writing a Reusable `useFetch` Hook
In our app, we sometimes need to use useEffect in multiple components. Copying and pasting the same useEffect can violate the DRY principle. To fix this, we can create a custom hook that handles data fetching and the ‘Loading, Success, Error’ pattern.
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
### Using the Custom Hook
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

## Working with Redux 
Previously, we used ``useReducer`` to manage complex local state. However, some applications require an even more structured way to represent, control, and share state especially when passing data deeply through multiple child components. For this, React applications often rely on ``Redux``, a powerful tool for managing complex global state.

Redux enforces strict, predictable rules for how state changes occur, which makes the application easier to understand, maintain, and debug. It is built around three main concepts:
1. **Store:** The single source of truth an object that holds the entire application state.
2. **Actions:** Plain JavaScript objects that describe **what happened**. They must have a `type` property (e.g., `{ type: 'INCREMENT' }`).
3. **Reducers:** Pure functions that take the `currentState` and an `action`, and return the `newState`. Reducers **must not mutate the state**; they always return a new state object.

### Creating the Store
To use Redux in React, we first need to install `react-redux`, then we create the store using ``CreateStore`` hook.
```jsx
import { createStore } from "redux";

const initialState = { count: 0 };

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

export const store = createStore(counterReducer);

```
We first created an initialState object that holds the starting value of our counter (counter = 0).
Next, we defined the counterReducer, which is the function responsible for managing the state of our store. It takes two arguments: the current state and an action. We set the default value of state to initialState.

Inside the reducer, we use a switch statement to check the action type and update the state accordingly, always returning a new state rather than modifying the existing one.

Finally, we created the store using createStore, passing our reducer function as the argument so Redux knows how to manage and update the state.
### Connecting Store with Component
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
Now to manage and manilulate our store we created Counter, component inside it we used two key function.
- **`useSelector`:** Extracts data from the Redux store state.
- **`useDispatch`:** Returns the `dispatch` function, which sends an Action to the Store.

Using useSelector with the helper function state => state.count, we accessed the count value from the Redux store and displayed it inside the ``<h1>`` element.

On the other hand, useDispatch gives us the dispatch function, which we use to send actions that update the data in our store.

Finally, in the App component, we wrapped our Counter component with the Provider and passed the store to it through the store prop. This makes the store and therefore the counter state available to the entire component tree, including the Counter component.

## Higher-Order Components And Portals
### Higher-Order Components
A Higher-Order Component (HOC) is a function that takes a component as input and returns a new component with extra features or enhanced behavior.

To create an HOC, we define a function that accepts a component, wraps it with additional logic, and returns a new component. We can think of it like a factory function that builds a modified version of a component by adding new capabilities while keeping the original component intact.
```jsx
function withLogger(WrappedComponent) {
  return function EnhancedComponent(props) {
    console.log(`Rendering component: ${WrappedComponent.name}`);
    return <WrappedComponent {...props} />;
  };
}

function Hello() {
  return <h2>Hello World</h2>;
}

const HelloWithLogger = withLogger(Hello);

export default function App() {
  return <HelloWithLogger />;
}
```
Here we have three main parts:
1. **`withLogger`**, which represents our Higher-Order Component. It takes another component as input (`WrappedComponent`) and returns a new component that logs a message every time it renders. Inside it, we return `EnhancedComponent`, which prints to the console and then renders the original component with all its props.
2. Next, we created a simple component called **`Hello`**, which just displays “Hello World”.
3. Finally, we used our HOC by calling `withLogger(Hello)` to create **`HelloWithLogger`**. This enhanced version of `Hello` now logs a message whenever it renders. In the `App` component, we render `HelloWithLogger` instead of the plain `Hello`.
### Portals
All the Apps that built so far render inside one root DOM element (usually `<div id="root">`). However, there are situations where we need a component to visually appear somewhere else in the DOM, while still being logically part of the React component tree. We can do that using Portals, with Portals we can render a React component into a completely different DOM node, without breaking React's rendering cycle or event handling.
#### Working with Portals
To work with Portals, we first need to create a separate DOM element in our HTML file where the portal will be rendered.

```jsx
<div id="modal-root"></div>
```
Then, in React, we use `ReactDOM.createPortal()` to send a component’s content into that DOM node. Even though the component appears outside the main root element, React still controls it normally, making Portals perfect for modals, popups, and tooltips.
```jsx
import ReactDOM from "react-dom";

function Modal({ children }) {
  return ReactDOM.createPortal(
    <div className="modal">{children}</div>,
    document.getElementById("modal-root")
  );
}

export default function App() {
  return (
    <div>
      <h2>Main App Content</h2>
      <Modal>
        <p>This is inside a portal modal!</p>
      </Modal>
    </div>
  );
}
```
Here we created a Modal component that accepts `children` as a prop. Inside this component, we use **`ReactDOM.createPortal()`** to render the children into a different part of the DOM. The `createPortal` function takes **two arguments**: the React element we want to render and the DOM node where we want to mount it (`document.getElementById("modal-root")`).

Finally, we used the `Modal` component just like any other React component inside the `App` component. Even though the modal content appears outside the main root element, it is still fully controlled by React, allowing state, props, and events to work normally. 
## Performance Optimization
React simplified for us building UI for our Apps but For building powerfull web Apps we need more then beautifull UI, Response time and Performance matter. In this section, we explore strategies to optimize performance.
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
