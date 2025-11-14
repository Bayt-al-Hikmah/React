## Objectives
- Understand what is a Single Page Application (SPA).
- Learning about Core concepts of React and the problems it solve.
- Creating & Understanding a React App
## What is a Single Page Application (SPA)?
A **Single Page Application (SPA)** is a modern approach to building web applications where the browser loads a single HTML page once, and everything afterward is handled dynamically using JavaScript. To understand why this matters, it’s helpful to compare it with how websites used to work traditionally and why that older method created challenges for developers.
### Traditional Websites: The Old Multi-Page Approach
In older websites such as classic blogs or simple business pages every time a user clicked a link like Home, About, or Contact, the browser performed a complete page reload. It threw away the current HTML, sent a new request to the server, and waited for a brand-new page to arrive. Only then would it rebuild the entire interface from scratch. This constant cycle made the experience feel slow and disconnected, similar to flipping through a physical book where every page must be reprinted before you can read it.
### The SPA Model: One Page, Dynamic Content
A SPA changes this entire pattern. Instead of loading a new HTML document for every navigation action, the application loads one initial page and then handles all changes internally. When the user clicks a link, the SPA intercepts the click so the browser does not refresh. Instead of requesting a whole new page, it asks the server only for the necessary data usually as a lightweight JSON object. JavaScript then updates the visible parts of the interface while keeping the rest of the page intact.

This produces an experience that is far smoother and faster. Pages transition instantly because the browser isn't discarding the entire interface or reloading resources. The application behaves more like a desktop or mobile app: fluid, responsive, and uninterrupted.
### Why SPAs Solve the Old Problems
By keeping the page alive and letting JavaScript handle updates, SPAs eliminate much of the manual complexity developers faced before. Instead of juggling IDs and micromanaging DOM elements, the application manages its own internal state and updates the UI automatically when that state changes. Developers no longer chase down which script modifies which element or worry that changing one component might break another. The entire structure becomes more organized, predictable, and easier to maintain.
When we browse a traditional website like an old blog or a simple business site every time we click a link (e.g., "About" or "Contact"), our browser does a full "page refresh." It discards the current HTML page and requests a completely new one from the server. This can feel slow and clunky, like flipping through a physical book, page by page.
## Overview of React
### What is a Front-End Framework/Library?
Building a modern, complex SPA from scratch with just plain JavaScript is like building a skyscraper by forging every nut and bolt ourself. It's possible, but incredibly time-consuming, difficult to maintain, and prone to errors.

To solve this, developers use frameworks or libraries. Think of them as a toolkit and a set of blueprints. They provide pre-written, optimized code and a clear structure for handling common, repetitive tasks like:
- Updating the UI when data changes.
- Managing the application's "state" (e.g., who is logged in).
- Routing the user to different "pages."

This lets developers focus on building the unique features of their application instead of reinventing the wheel.
### What is React?
React is a free, open-source JavaScript library for building user interfaces. Created and maintained by Facebook (now Meta), its primary goal is to make it easy to create fast, scalable, and interactive UIs.

Its main job is simple: take our data and turn it into the HTML we see on the screen. When our data changes, React efficiently updates only the parts of the page that need to change, and nothing else.
### React's Core Concepts
React’s popularity comes from a few powerful but simple ideas. Each one solves a real problem in web development.
#### 1. The Virtual DOM
Updating the real browser DOM is slow because each change can force the browser to recalculate layouts, repaint elements, and update the screen.  
React solves this using the **Virtual DOM**.

- **Analogy**
	- The real DOM is like a **physical building**.
	- The Virtual DOM is a **lightweight digital blueprint** stored in memory.

- **How it works**
	1. **React updates the blueprint first**
	    - This is fast because it happens in memory, not on the page.
	2. **React compares the new blueprint with the old one**
	    - This helps it figure out the _smallest possible change_ needed.
	3. **React updates only that specific part of the real DOM**
	    - Like changing **one brick** instead of rebuilding the entire wall.

- **Why this matters**
	- Fewer DOM updates = faster performance.
	- React avoids unnecessary re-rendering.
	- Your UI feels smooth even when data changes quickly.
    
- **How this helps developers**
	- You don't need to manually optimize DOM operations.
	- React does the hard performance work for you.

#### 2. Component-Based Architecture
React breaks the UI into small, reusable pieces called **components**.
- **Analogy**
	Your UI is a big, detailed **LEGO model**.
	A component might be:
	- One small LEGO brick → a button
	- A small LEGO structure → a search bar (label + input + button)

You combine components to create bigger structures (like a navbar), then combine those to build your entire app.

- **Why this matters**
	- You stop rewriting the same code again and again.
	- Each piece of your UI is separated, so one part can change without breaking others.

- **How this helps developers**
	- **Reusability:** You can use the same component in many places.
	- **Maintainability:** It’s easier to fix bugs because each component is independent.
	- **Organization:** Your project becomes cleaner and easier to navigate.
#### 3. Declarative UI
React uses a **declarative** approach instead of an imperative one.

-  **Imperative (old way)**
	You describe the exact steps:  
	“Find the button → add a listener → read the input → update the list.”  
	You’re telling the browser **how** to do everything.
- **Declarative (React way)**
	You describe the final result:  
	“Here is a list of tasks. Render it.”  
	If the list changes, React updates the UI automatically.
- **Why this matters**
	- You stop writing step-by-step instructions.
	- You focus on the **state** of your app instead of the logic of updating the page.
- **How this helps developers**
	- Fewer bugs because you write less code.
	- The UI always stays in sync with the data.
	- It becomes easier to reason about how your app behaves.
### Who Uses React?
React is trusted by some of the biggest companies in the world to power their applications, including:
- **Meta** (Facebook, Instagram, WhatsApp)
- **Netflix**
- **Airbnb**
- **Uber**
- **The New York Times**
- ...and thousands more.

## Creating & Understanding a React App
### Environment Setup
To create a React app, we first need **Node.js** installed on our computer. Node.js is a JavaScript runtime that includes npm (Node Package Manager), which we will use to install packages and run commands., We can install it from the official website: https://nodejs.org/en
### Creating the Project
After Installing nodejs and npm we can now create  our first app using:
```
npx create-react-app my-app
```
This command create a new folder called `my-app` that containe the app base structure files, set the ``packages.json``. and install all the required packages to run the React App. Now,we navigate to our new app folder using:
```
cd my-app
```
### Understanding the Project Structure
Inside our `my-app` folder, we will see a few files and folders. The following ones are the most important:
#### Public folder
It contain the following files:
- `public/index.html`: This is the only HTML file in our entire SPA. Our whole React app will be injected into the `<div id="root"></div>` element inside this file.

- `public/robots.txt`: A text file that gives instructions to search engine crawlers (like Googlebot), telling them which pages they should or shouldn't index

- `public/favicon.ico` (or `.svg`/`.png`): The small icon that appears in your browser tab.

- **Logos:** Files like `logo192.png` or `logo512.png`. These are often referenced by the `manifest.json` file.

- `public/manifest.json`: This is the Web App Manifest. It's a file that tells the browser information about our app (like its name, colors, and icons) when a user "adds it to their home screen" on a mobile device.
#### Src Folder
Here where we will write and make our logic
- `index.js` (or `main.jsx` ) This is the entry point for your entire application. Its one and only job is to find the `<div id="root"></div>` in our main `index.html` file and tell React to render our main `<App />` component inside it.

- `App.js` (App.jsx) This is our main root component. Think of it as the top-level container for our entire app. All other components we build (like buttons, navigation bars, or pages) will live inside this `App` component. This is the file we edited to build our counter.

- **CSS Files** (e.g., `App.css`, `index.css`) These files are for our styling. In modern React, we import CSS files directly into our components. This allows the build tool to bundle the styles only when they're needed. `index.css` is often used for global styles (like fonts and body margins), while `App.css` might be for styling the main `App` component.

Finally in our top route we got
- `package.json`: Our project's "recipe book." It lists our project's details, dependencies, and scripts.


### The JSX Syntext
When we open `App.js`, we will see the default generated file it something that looks like HTML, but it's inside a JavaScript file. This is **JSX (JavaScript XML)**.
#### What is JSX?
JSX is a syntax extension for JavaScript. It lets us write HTML-like code directly in our JavaScript files. It is not HTML.

This:
```jsx
const element = <h1>Hello, world!</h1>;
```
.is just "syntax sugar" for this plain JavaScript:
```javascript
const element = React.createElement('h1', null, 'Hello, world!');
```
JSX is powerful because it lets us build our UI and its logic in the same place, making components easy to read and write.
#### The Rules of JSX
JSX is not HTML, so it has a few strict rules:
**Must Return a Single Root Element:** A component can only return one top-level element.
- **❌ This is wrong:**
	```
	return (
	  <h1>Title</h1>
	  <p>Paragraph</p>
	);
	```
- **✅ This is correct:** Wrap it in a `<div>` or, if you don't want an extra `div`, use a Fragment (`<>`):
	```
	return (
	  <>
		<h1>Title</h1>
		<p>Paragraph</p>
	  </>
	);
	```
 **Use `className` instead of `class`:** Because `class` is a reserved word in JavaScript (for creating classes), JSX uses `className` for HTML class attributes.
```jsx
<div class="my-class">` ➔ `<div className="my-class">
```
**Use Curly Braces `{}` for JavaScript:** To use a JavaScript variable or expression inside JSX, we put it in curly braces.
```jsx
const name = "Alex";
<h1>Hello, {name}</h1>
```
**Use `camelCase` for Attributes:** HTML attributes with two words (like `onclick`) become `camelCase` in JSX.
- `onclick` ➔ `onClick`     
- `onchange` ➔ `onChange`

### Components, Hooks, and State
When we look at `App.jsx`, we can also notice that there is a JavaScript function that returns JSX. In React, this is a Component.
#### What are Components?
A Component is a reusable, self-contained piece of your UI. The entire philosophy of React is to build our app by dividing the interface into small, independent components.

Think of them like LEGO bricks. You don't build a whole car at once. We build a `Wheel` component, a `SteeringWheel` component, and a `Seat` component. Then, we assemble them inside a `Car` component.

A component is just a JavaScript function that returns what you want to see on the screen (JSX).
```jsx
// This is a simple component
function Welcome() {
  return <h1>Hello, welcome to the app!</h1>;
}

// We can now use it in other components like an HTML tag
function App() {
  return (
    <>
      <Welcome />
      <p>This is my app.</p>
    </>
  );
}
```
We use a component just like an HTML tag by writing its name inside `< />`. If the component accepts arguments which are called props in React, we define them as parameters in the component’s function. Then, when using the component, we pass values to it by specifying the prop names as attributes.
```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}!</h1>;
}

function App() {
  return (
    <>
      <Welcome name="Sarah" />
      <Welcome name="Alex" />
      <p>This is my app.</p>
    </>
  );
}

/*
This would render:
<h1>Hello, Sarah!</h1>
<h1>Hello, Alex!</h1>
<p>This is my app.</p>
*/
```
#### Hooks
By default, React components are just plain functions. They run once, return their JSX, and then stop they have no memory. Any variable we define inside a component is reset every time it re-renders, so we can’t use it to store information between renders.

So, how do we make components interactive? How can we give them memory?

This is where **Hooks** come in. Hooks are special functions that let us “hook into” React’s features, like state and lifecycle events, directly from functional components. By convention, all hooks start with the word `use`, such as `useState` and `useEffect`.

The most commonly used hook is useState. It allows us to add state* a way for our component to remember information across renders. With state, our component can respond to user interactions, keep track of data, and update the UI dynamically without losing memory every time it re-renders.
#### State
State is any data that a component manages internally and that can change over time. When the state changes, React automatically re-renders the component to reflect the new values in the UI.

This is the heart of React’s interactivity. Instead of manually updating the HTML, we update the state, and React takes care of updating the UI for us. This approach keeps our code clean, predictable, and easier to maintain.

### Building Our App Logic
Now that we understand the basics, let's put everything into practice by building a simple **counter app**. This app will have two buttons Increment and Decrementand will display the current number on the screen.

To make the count change, we need state, so we'll use React’s `useState` hook.   
We edit the ``App.js`` files and import useState
```jsx
import { useState } from 'react'; // Add this line
import './App.css';
```
Inside the `App` component, before the `return`, call `useState` to create a state variable for the count:
```jsx
function App() {
  const [count, setCount] = useState(0);
// ...
```
**What does this line mean?**
- `useState(0)`: We are "hooking" into React's state. We're asking it to create a new "state variable" and **initialize it with the value `0`**.
- `const [count, setCount] = ...`: `useState` returns an array with two items:
	1. `count`: The **current value** of the state (it will be `0` on the first render).
	2. `setCount`: A **function** that we use to _update_ the state.


Now that we have a `count` variable, let's show it on the screen. We'll edit the `return` statement to add a title, a subtitle that displays the count, and our two buttons.   
To display our JavaScript variable `count` inside JSX, we wrap it in curly braces `{}`.
```jsx
  return (
    <>
      <h1>My Click Counter</h1>
      <h2>Current Count: {count}</h2>

      <div className="button-container">
        <button>Increment (+)</button>
        <button>Decrement (-)</button>
      </div>
    </>
  );
```
If you check your browser, you'll see "Current Count: 0". This is great! The buttons are there, but they don't do anything... yet.   
We need to make the buttons do something when clicked. We'll use the `onClick` event.   
First, let's create two functions inside our `App` component (right above the `return`) that will handle the click events.
```jsx
function App() {
  const [count, setCount] = useState(0);

  // This function will be called when the increment button is clicked
  const handleIncrement = () => {
	// We use the 'setCount' function to update the state
	setCount(count + 1);
  };

  // This function will be called when the decrement button is clicked
  const handleDecrement = () => {
	setCount(count - 1);
  };

  return (
  // ...
```
Finally, we attach these functions to our buttons using the `onClick` prop.
```jsx
  return (
	<>
	  <h1>My Click Counter</h1>
	  <h2>Current Count: {count}</h2>

	  <div className="button-container">
		<button onClick={handleIncrement}>Increment (+)</button>
		<button onClick={handleDecrement}>Decrement (-)</button>
	  </div>
	</>
  );
}
```
If we go back to our browser. Our app is now fully interactive!
1. We click "Increment."
2. The `handleIncrement` function is called.
3. It calls `setCount(count + 1)`.
4. React sees the state has changed.
5. React re-renders the `App` component with the new `count` value.
6. The `<h2>` updates automatically to show the new count.

### Adding Styles
We can make our app look more modern by adding custom styles in the src/App.css file. For this project, we include the following CSS:

```css
/*
    pre-existing style
*/
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

h2 {
  font-size: 2.5rem;
  color: #888; 
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 1rem; 
  margin-top: 2rem;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1.2em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}

button:hover {
  border-color: #646cff;
}
```