# Workshop 1: React Foundations and Modern Tooling

In this first workshop, we will explore React from the ground up. Before writing any code, we need to understand what React is, why developers use it, and how it helps us build user interfaces. Once we understand these ideas, we will prepare our development environment, create our first React project, and explore the files that make it work.

After becoming familiar with the project structure, we will start building our own components. We will learn how to pass information between them and, eventually, how to make them respond to user interactions using state.

Throughout the workshop, we will use examples from a small stock management application, along with a simple counter that will help us put the concepts into practice. By the end, you should understand the basic structure of a React application and how its main parts work together. This knowledge will give us a solid foundation for the more advanced topics we will explore in the following workshops.

## Objectives

By the end of this workshop, you should be able to:

- Explain what React is and why we use it to build user interfaces.
- Understand the difference between a traditional multi-page application and a single-page application.
- Create a React project using Vite and TypeScript.
- Understand the purpose of Node.js, npm, and Vite.
- Navigate the generated project structure and identify its main application files.
- Understand the role of `package.json`, `vite.config.ts`, and TypeScript configuration.
- Write JSX inside `.tsx` files.
- Create React function components and pass data to them using props.
- Use state to make components interactive.

## What Is React?

Let's start with a simple question: what is React, and why do we need it?

React is a JavaScript library used to build user interfaces. A user interface is everything we see and interact with when using an application. For example, a stock management application might contain a navigation menu, a list of products, a search bar, and buttons for adding or removing products. It might also display information such as available quantities and whether a product is currently in stock.

We can build all these elements using ordinary HTML, CSS, and JavaScript. However, as the application becomes larger, managing everything together becomes increasingly difficult. We need to keep track of the data, make sure the displayed information is correct, and update the right parts of the page whenever something changes.

This is where React becomes useful. Instead of building the entire interface as one large piece of code, React allows us to divide it into smaller, independent parts called **components**. Each component is responsible for displaying a particular part of the interface, and we can combine these components to build the complete application.

For example, rather than implementing an entire stock dashboard in one place, we could organize it into components like this:

```text
StockDashboard
│
├── Navigation
├── DashboardHeader
├── SearchBar
├── ProductList
│   ├── ProductCard
│   ├── ProductCard
│   └── ProductCard
└── AddProductButton
```

Here, `StockDashboard` is the main component, but it does not need to handle every detail itself. It brings together smaller components, each with its own responsibility. The `ProductList`, for instance, handles the product list, while each `ProductCard` displays information about an individual product.

This organization makes the application easier to understand because we can work on smaller parts instead of dealing with the entire interface at once. It also allows us to reuse components whenever we need them, which reduces unnecessary repetition.

### A Simple Example: Displaying Product Stock

Let's see why this component-based approach is useful when the information displayed by an application changes.

Imagine that we have a product called "Keyboard" with 15 available units. Our stock dashboard should display something like this:

```text
Product: Keyboard
Available Quantity: 15
Status: In Stock
```

Now suppose someone purchases the remaining keyboards, bringing the quantity down to zero. Naturally, we want the interface to reflect this change:

```text
Product: Keyboard
Available Quantity: 0
Status: Out of Stock
```

With ordinary JavaScript, we could find the corresponding HTML elements and manually update their content whenever the quantity changes. This works, but as the application grows and many different values can change, keeping track of all these updates becomes difficult.

React gives us another way to approach the problem. Instead of writing instructions for every possible visual change, we describe what the interface should look like based on the current data. In our example, the application should display "In Stock" whenever the quantity is greater than zero and "Out of Stock" when the quantity reaches zero.

React then takes care of updating the displayed information when the data changes. We do not have to manually search for the elements that need updating.

This leads to one of the most important ideas in React:

**We describe what the interface should look like based on the current data, and React takes care of updating the screen when that data changes.**

Keep this idea in mind because it will help you understand almost everything we do throughout this workshop.

### Multi-Page Applications and Single-Page Applications

Now that we understand why React is useful for building interfaces, let's look at how websites handle navigation between different pages.

Traditionally, many websites work as **multi-page applications (MPAs)**. When a user opens a page or clicks a link to visit another one, the browser sends a request to the server. The server responds with a new HTML document, and the browser loads that document. This process happens again whenever the user navigates to another page.

A **single-page application (SPA)** approaches navigation differently. When the user first opens the application, the browser loads an HTML document along with the JavaScript and CSS files needed to run it. After that, JavaScript can update the content displayed on the screen as the user moves between different sections, without requesting a completely new HTML document for every navigation.

To understand the difference, imagine using our stock management application. We open the dashboard, navigate to the stock page, search for a product, open its details, and then return to the product list.

In a client-side SPA, the application can display these different views by updating its interface directly inside the browser. A routing library manages the navigation and determines which view should appear based on the current URL. As a result, the user can move between different sections without the browser having to load a completely new HTML document each time.

This approach works particularly well for applications with many interactions, where users frequently move between different views. However, SPAs are not always the best solution. A traditional server-rendered website can be simpler and more suitable for content-focused websites, such as blogs or documentation pages.

The choice depends on what we are building and how we want the application to work.

**Important:** React is not limited to single-page applications. It can also be used inside an existing website or as part of a larger framework that supports server rendering. In this workshop, we will use Vite to learn how React works in a client-side application.

## How Does a React Application Work?
We now know what React does and why we use it. The next question is: what actually happens when we open a React application in the browser?

Unlike a simple HTML page, where the browser can directly display the elements written in the document, a React application needs to go through a few additional steps. The browser loads an HTML document, that document loads our JavaScript entry file, and React uses that file to start building the interface.

During development, the process looks like this:

```text
1. The browser requests the HTML page.
                 |
                 v
2. Vite serves the HTML document.
                 |
                 v
3. The HTML document loads main.tsx.
                 |
                 v
4. main.tsx starts the React application.
                 |
                 v
5. React renders the App component.
                 |
                 v
6. React updates the browser's DOM.
                 |
                 v
7. The user sees the interface.
```

Let's walk through this process so that each step becomes clearer.

When we open the application, the browser first requests the HTML document. This document provides the basic structure of the page and contains a reference to the JavaScript file responsible for starting React.

During development, Vite acts as our local development server. It provides the HTML document and the other files needed by the application, including our JavaScript and CSS files.

The HTML document then loads a file called `main.tsx`. This is the entry point of our React application. Its job is to connect React to the browser page and tell React which component should be displayed first.

React starts by rendering that component, usually called `App`. It executes the component and uses the JSX it returns to determine what the interface should look like. From there, React takes care of displaying the necessary elements in the browser.

To do this, React works with something called the **DOM**, or Document Object Model. The DOM is the browser's representation of the HTML page. React uses it to display the interface and apply the necessary updates when the application changes.

Finally, the browser displays the result, and the user can start interacting with the application.

This is the general process behind a React application. Now that we have an idea of what happens, we can prepare our environment and explore the files involved in each step.

## Prepare the Development Environment

Before creating our first React project, we need to prepare the tools we will use to develop it.

You might wonder why we need to install additional software when React applications run inside a browser. The reason is that the browser is only where users interact with the application. During development, we also need tools to create the project, install libraries, process our code, and prepare the application for deployment.

There are three tools we need to understand before getting started: Node.js, npm, and Vite.

**Node.js** provides an environment that allows JavaScript to run outside the browser. This is important because many development tools, including Vite, use JavaScript and need an environment in which they can run.

**npm** is a package manager that comes with the standard Node.js installation. It allows us to install libraries and tools required by our project. It also helps us run common project commands without having to remember the full commands behind them.

**Vite** is a development and build tool. It provides a local development server while we are working on the application and prepares the files needed when we want to build it for production.

These tools have different responsibilities, but they work together throughout the development process.

### Install Node.js and npm

Start by installing a current supported release of Node.js. The standard installation includes npm, so you do not need to install it separately.

Vite currently requires Node.js 20.19+ or 22.12+, although some templates may require a newer version. Check the official Vite documentation when installing or updating your development environment.

Once the installation is complete, open your terminal and run:

```bash
node --version
npm --version
```

These commands ask Node.js and npm to display their installed versions. You should see a version number for each one. If the terminal reports that a command cannot be found, check that Node.js was installed correctly and is available in your system's PATH.

You should also have a code editor with TypeScript support so that you can write and organize your code. Visual Studio Code is a common choice.

## Create a React Project with Vite

Now that our environment is ready, we can create our first React project.

We could create every file manually and configure all the tools ourselves, but that would involve quite a bit of setup before we even get to write our first component. Instead, we will use Vite to prepare the starting project for us.

This process is called **scaffolding**. It simply means generating a project with an initial folder structure and the basic configuration already in place.

Since we want to use React with TypeScript, we will choose the React + TypeScript template. Open your terminal and run:

```bash
npm create vite@latest my-react-app -- --template react-ts
```

Let's understand what this command does. The `npm create vite@latest` part runs the tool responsible for creating a new Vite project. The name `my-react-app` specifies the folder and project name, while `--template react-ts` tells Vite that we want the React + TypeScript template.

After Vite finishes creating the project, move into its directory:

```bash
cd my-react-app
```

The project structure is now ready, but we still need to install the packages it depends on. Run:

```bash
npm install
```

npm reads the project's `package.json` file and downloads the required packages. Once the installation is complete, we can start the development server:

```bash
npm run dev
```

The terminal will display a local address, usually similar to:

```text
http://localhost:5173/
```

Open this address in your browser, and you should see the default React application generated by Vite.

Congratulations! Your first React project is now running.

When you want to stop the development server, return to the terminal and press `Ctrl + C`.

### Why Do We Use Vite?

Now that we have created and started our project, let's understand why we used Vite in the first place.

A React project needs more than the React library itself. We also need a development server to make the application available in the browser, tools to process our source files, and a way to prepare the final application for production. Vite brings these features together, allowing us to focus more on building the application and less on configuring the development environment.

One particularly useful feature is **Hot Module Replacement (HMR)**. While developing, we frequently make changes to our code and need to see the results in the browser. Normally, this could require reloading the entire page. HMR allows Vite to update parts of the application when we change our code without always performing a full page reload.

For example, imagine that you are editing a component and decide to change its heading or add a button. You save the file, and Vite updates the application so you can see the result almost immediately. This makes the development process faster and more comfortable.

Vite also handles the production build. When the application is ready, it processes the project files and creates an optimized version that can be deployed to a server.

It is worth remembering that React and Vite have different responsibilities. React is responsible for building the user interface, while Vite provides the tools that help us develop and build the application. The other tools we installed also have their own roles:

| Tool | Responsibility |
|---|---|
| React | Builds the user interface using components. |
| TypeScript | Checks our code for type-related errors. |
| Vite | Runs the development server and prepares the production build. |
| Node.js | Provides the environment for running development tools. |
| npm | Installs packages and runs project commands. |

Together, these tools give us the environment we need to build and maintain React applications.


## Understand the Project Structure

Our application is now running, so let's take a look inside the project folder.

When Vite generated the project, it also created several folders and configuration files. At first, the number of files might seem overwhelming, especially if this is your first time working with a modern JavaScript project. However, each file has a specific purpose, and we only need to understand the important ones for now.

A typical React + TypeScript project generated by Vite looks like this:

```text
my-react-app/
│
├── public/
│
├── src/
│   ├── assets/
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

The exact structure may vary depending on the Vite template version, but the main files and their responsibilities are similar.

Rather than trying to memorize everything at once, let's follow the process we discussed earlier. We know that the browser starts by loading an HTML document, which then loads the file responsible for starting React. Understanding these two files will help us make sense of the rest of the project.

### The `index.html` File

Remember that every React application starts when the browser loads an HTML document. In a Vite project, this document is usually the `index.html` file located directly inside the project folder.

Open it, and you will find a basic HTML structure containing an element where React will display the application.

A simplified version looks like this:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My React App</title>
  </head>

  <body>
    <div id="root"></div>

    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

There are two important parts to notice here. First, look at the following element:

```html
<div id="root"></div>
```

It is an empty HTML element. At this point, it does not contain our React interface. Instead, it acts as a container that React will use to display the application.

The second important part is the script reference:

```html
<script type="module" src="/src/main.tsx"></script>
```

This tells the browser to load our `main.tsx` file as a JavaScript module. That file is responsible for starting React and connecting it to the empty container we just saw.

So, `index.html` gives us the basic page structure, while `main.tsx` takes care of starting the React application inside it.

### The `main.tsx` File

Now let's open `src/main.tsx`.

This file is the entry point of our React application. Its purpose is to connect React to the HTML page and tell React which component should be displayed first.

A typical example looks like this:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element #root was not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Let's understand how these pieces work together.

We start by importing `createRoot` from React:

```tsx
import { createRoot } from 'react-dom/client';
```

This is the function we use to connect React to an HTML element in the browser. Before we can use it, however, we need to find the container where the application will appear.

That is why we have:

```tsx
const rootElement = document.getElementById('root');
```

This line searches the HTML document for the element with the ID `root`. It is the same element we saw in `index.html`.

We then check whether that element actually exists:

```tsx
if (!rootElement) {
  throw new Error('Root element #root was not found');
}
```

This check is useful because we cannot start React inside an element that does not exist. If something is wrong with our HTML document, the application will stop with a clear error message.

Once we have the element, we can create the React root and tell it what to display:

```tsx
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

The most important part here is `<App />`. This is our main application component. React starts with this component and then renders the other components it uses to build the interface.

You may also have noticed something called `StrictMode`. This is a development feature that enables additional checks to help us identify potential problems in our code. It does not add any visible elements to the interface, but some development checks may cause components to run more than once. This is intentional and helps reveal certain mistakes while we are developing.

We will keep using `StrictMode` throughout the course.

### The `App.tsx` File

We have now reached the component that React displays first.

Open `src/App.tsx`. This file usually contains the root component of our application. It is called the root component because other components can be placed inside it, allowing us to combine smaller pieces into the complete interface.

For example, we could replace its contents with:

```tsx
function App() {
  return (
    <main>
      <h1>My Stock Dashboard</h1>
      <p>Welcome to the application.</p>
    </main>
  );
}

export default App;
```

Here, `App` is a React component that returns the content we want to display on the screen. The `main.tsx` file imports this component and tells React to render it inside our HTML container.

We will explore how to create our own components in more detail shortly. For now, the important thing is to understand the relationship between `index.html`, `main.tsx`, and `App.tsx`: the HTML document provides the container, the entry file starts React, and the `App` component describes the main interface.

### Other Important Folders and Files

Now that we understand how the application starts, let's look at the remaining parts of the project.

The `src/` folder contains the main source code of our application. This is where we will spend most of our time because it holds our React components, styles, and application logic.

Inside it, you will find the `assets/` folder, which is commonly used for files that we import into our code, such as images and other resources. There is also the `index.css` file, which contains global CSS rules that apply to the application.

You may also have noticed the `public/` folder. Unlike files inside `src/assets/`, files inside `public/` are served directly and keep their original names. This makes it useful for static files that need to be referenced using a fixed URL, such as a favicon.

The remaining files are mainly related to project configuration. We will explore the most important ones next so that we understand how our project is managed and how its tools are configured.
## Understand the Project Configuration

While exploring the project, you probably noticed several configuration files. They might look complicated at first, but they are easier to understand when we consider what each tool needs to know.

For example, npm needs information about the project and its packages, Vite needs to know how the development server and build process should behave, and TypeScript needs rules for checking our code.

Let's start with the file that brings together much of this information: `package.json`.

### `package.json`

The `package.json` file is one of the most important files in a Node.js project. You can think of it as the project's information sheet because it describes the project, lists the packages it depends on, and defines the commands we can run through npm.

A simplified example looks like this:

```json
{
  "name": "my-react-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",

  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

Let's begin with the project information. The `name` field contains the project name, while `version` indicates its current version. The `private` property is set to `true` to prevent accidental publication of the package to the public npm registry.

You may also notice `"type": "module"`. This tells Node.js to use the ES module system for relevant JavaScript files. It is the module system that allows us to import and export functionality using `import` and `export`.

#### Dependencies and Development Dependencies

As applications grow, we often use external packages instead of writing every feature ourselves. For example, our React project needs the React libraries to build the interface, but it also needs tools such as Vite and TypeScript to help us develop and build the application.

These packages are organized into two main groups.

**Dependencies** are packages that the application needs at runtime. In our project, `react` and `react-dom` are examples.

**Development dependencies** are packages used during development, checking, or building. Tools such as `vite`, `typescript`, and `eslint` are common examples.

This distinction helps us separate the libraries needed by the application from the tools we use to develop it.

#### npm Scripts

Another important part of `package.json` is the `scripts` section.

When working on a project, we frequently need to run commands such as starting the development server, building the application, or checking our code. Instead of typing the complete command each time, we can define named scripts in `package.json` and execute them through npm.

For example:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview"
}
```

Each script has a different purpose:

| Command | Purpose |
|---|---|
| `npm run dev` | Starts the development server. |
| `npm run build` | Checks the TypeScript project and creates the production build. |
| `npm run lint` | Checks the code for common problems and style issues. |
| `npm run preview` | Starts a local server to preview the production build. |

For example, when we execute:

```bash
npm run dev
```

npm looks inside `package.json`, finds the script named `dev`, and executes the command associated with it, which is `vite`.

This is why we can use short, easy-to-remember commands instead of typing the complete tool command every time.

#### What Is `package-lock.json`?

While exploring the project, you will also find another file called `package-lock.json`.

To understand why it exists, imagine that two developers are working on the same application. Both need to install the project's dependencies, but they might do so at different times or on different computers.

Without a lockfile, npm could resolve some package versions differently, potentially causing differences between their development environments.

The `package-lock.json` file helps prevent this problem by recording the exact versions of the packages installed in the project, along with information about their dependencies. This makes it easier to reproduce the same dependency setup across different machines.

For this reason, we normally commit `package-lock.json` to Git along with the rest of the project.

When installing dependencies in a clean environment, we can also use:

```bash
npm ci
```

This command installs the dependencies using the versions recorded in the lockfile, making it particularly useful for automated builds and clean installations.

### Configure Vite with `vite.config.ts`

Now that we understand how npm manages our project and its packages, let's look at how we can customize the development tool itself.

As we discussed earlier, Vite handles our development server and production build. However, different projects may have different requirements. We might want to change the development server port, forward requests to a backend API, or choose a different folder for the production files.

These options are configured inside `vite.config.ts`.

A basic React configuration looks like this:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
```

The important part is `plugins: [react()]`. This enables the React plugin, which provides React-specific development features such as Fast Refresh.

We can extend this configuration whenever our project needs additional settings. For example:

```ts
export default defineConfig({
  plugins: [react()],

  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },

  build: {
    outDir: 'dist',
  },
});
```

Here, we have added a few configuration options.

The `server.port` property specifies which port Vite should use for its development server. The `server.proxy` property allows us to forward matching requests to another server. This is particularly useful when our React application communicates with a backend running on a different port.

For example, if our backend API is available at `http://localhost:8000`, requests starting with `/api` can be forwarded to it during development.

Finally, `build.outDir` controls the folder where Vite places the production build. By default, this folder is called `dist`.

Remember that the proxy configuration only applies to Vite's development server. It does not automatically configure the backend or the production server.

You do not need to add all these options to every project. The configuration generated by Vite is usually enough when starting out. We can introduce additional settings later, when we have a specific requirement.

### Understand TypeScript Configuration

We have already seen that TypeScript helps us catch certain mistakes while writing code. However, TypeScript also needs to know how our project is organized and which rules it should apply.

This is the purpose of the TypeScript configuration files.

A typical Vite project may contain:

```text
tsconfig.json
tsconfig.app.json
tsconfig.node.json
```

You might wonder why we need several configuration files instead of one. The reason is that different parts of our project run in different environments.

Our React application runs inside the browser, while the Vite configuration itself runs through Node.js. Since these environments have different features and requirements, they may need different TypeScript settings.

A simplified application configuration might look like this:

```json
{
  "compilerOptions": {
    "strict": true,
    "jsx": "react-jsx",
    "noEmit": true
  },
  "include": ["src"]
}
```

Let's understand what these options do.

The `strict` option enables additional type-checking rules. This helps TypeScript catch more potential mistakes while we are writing code.

The `jsx` option tells TypeScript how to handle JSX syntax, which we will use when writing React components.

Finally, `noEmit` tells TypeScript to check our code without generating JavaScript files. Vite handles the transformation needed for the application build.

TypeScript has many other configuration options, but we do not need to memorize them at this stage. For this workshop, keep the configuration generated by Vite. Our focus will be on learning how to use TypeScript inside our components.

## TypeScript Essentials for React

Now that we understand how the project is organized and configured, we can start looking at the code we will write inside it.

Since we chose the React + TypeScript template, our components will use TypeScript rather than plain JavaScript. Before building them, however, we need to understand a few basic concepts.

TypeScript is JavaScript with a type system. A type describes what kind of value a variable, function, or object is expected to contain. This helps us catch certain mistakes while writing our code instead of discovering all of them only when the application runs.

For example:

```ts
const name: string = 'Sarah';
const age: number = 25;
const isStudent: boolean = true;
```

In these examples, we tell TypeScript that `name` should contain text, `age` should contain a number, and `isStudent` should contain either `true` or `false`.

Because we have specified these types, TypeScript can warn us when we try to use a value incorrectly. For example:

```ts
const age: number = 'twenty';
```

This produces a type error because we are assigning text to a variable that should contain a number.

This becomes especially useful when our applications start dealing with more complex data.

### Working with Object Types

In real applications, we rarely work with only simple values. We often deal with objects containing several related properties.

Imagine that our application has a user with an ID, a name, and an email address. We can describe the structure of this object using a TypeScript type:

```ts
type User = {
  id: number;
  name: string;
  email?: string;
};
```

This tells TypeScript what information a `User` object should contain. The `id` must be a number, the `name` must be a string, and the `email` property is optional because it has a question mark after its name.

We can now create an object using this type:

```ts
const currentUser: User = {
  id: 1,
  name: 'Maya',
};
```

This object is valid because it contains all the required properties. We do not need to provide an email address because that property is optional.

The same idea applies to functions. We can use types to describe the information a function expects and the value it returns:

```ts
function formatGreeting(user: User): string {
  return `Hello, ${user.name}`;
}
```

Here, the function expects an object that follows the `User` type and returns a string.

As our React application grows, we will use TypeScript types to describe the information our components receive and the data they work with.

One important detail to remember is that TypeScript checks our code during development, but it does not automatically validate data received from an external API. We will explore ways to handle external data safely in a later workshop.

## Understanding JSX and TSX

Now that we know how to describe our data using TypeScript, let's look at how we describe what should appear on the screen.

React uses a syntax called **JSX**, which allows us to write HTML-like elements directly inside JavaScript or TypeScript code.

For example:

```tsx
const heading = <h1>Welcome to React</h1>;
```

At first glance, this looks like ordinary HTML, but it is actually JSX. Our development tools transform this syntax into JavaScript so that React can work with it.

Since we are combining TypeScript with JSX, our React component files use the `.tsx` extension. This is why files such as `App.tsx`, `Header.tsx`, and `ProductList.tsx` use that extension.

JSX is designed to feel familiar to anyone who already knows HTML, but there are a few differences worth understanding before we start writing components.

### Basic JSX Rules

The first thing to understand is that JSX expressions returned by a component need to be wrapped inside one root element.

For example, the following component is not valid:

```tsx
function App() {
  return (
    <h1>Hello</h1>
    <p>Welcome to React</p>
  );
}
```

The problem is that we are returning two separate elements without a common parent. We can fix this by wrapping them inside a `main` element:

```tsx
function App() {
  return (
    <main>
      <h1>Hello</h1>
      <p>Welcome to React</p>
    </main>
  );
}
```

Sometimes, we do not actually need an additional HTML element. In those situations, we can use a React Fragment, which groups multiple elements without adding another element to the DOM:

```tsx
function App() {
  return (
    <>
      <h1>Hello</h1>
      <p>Welcome to React</p>
    </>
  );
}
```

Another difference you will notice is how we assign CSS classes. In HTML, we normally use the `class` attribute, but in JSX we use `className`:

```tsx
<h1 className="title">Welcome</h1>
```

This is one example of how JSX uses JavaScript-compatible property names.

We can also insert JavaScript values and expressions directly into JSX using curly braces `{}`. This is particularly useful because it allows our interface to display information stored in variables rather than relying only on fixed text.

For example:

```tsx
const name = 'Sarah';

function App() {
  return <h1>Hello, {name}</h1>;
}
```

When React renders this component, it inserts the value of `name` into the heading, so the result displayed in the browser is:

```text
Hello, Sarah
```

The same idea works with expressions:

```tsx
const quantity = 5;

function App() {
  return <p>Available products: {quantity + 10}</p>;
}
```

Here, React evaluates the expression and displays the result, which is `15`.

JSX also uses camelCase for many HTML attributes. For example, when handling a button click, we write `onClick` rather than `onclick`:

```tsx
<button onClick={handleClick}>Click Me</button>
```

We will use this syntax later when making our components interactive.

Another small difference is that JSX requires elements such as `img` and `input` to be closed explicitly:

```tsx
<img src="/logo.png" alt="Logo" />
<input type="text" />
```

Finally, when we display lists of elements using JavaScript, React needs a stable key for each item. These keys help React keep track of the elements when the list changes. We will explore this in more detail in Workshop 2.

With these basic rules in mind, we are ready to create our first component.

## Build Your First React Component

We now understand how JSX works and why React divides interfaces into components. Instead of writing everything inside one large file, we can create smaller components and combine them to build our application.

Let's begin with something simple: a welcome message.

We can create a function called `Welcome` that returns the message we want to display:

```tsx
function Welcome() {
  return <h1>Hello, welcome to React!</h1>;
}
```

This is a React function component. There are two important things to notice: its name starts with a capital letter, and it returns JSX describing what should appear on the screen.

But defining a component is not enough. We also need to use it somewhere in our application. Since `App` is our root component, we can place `Welcome` inside it.

Open `App.tsx` and write:

```tsx
function Welcome() {
  return <h1>Hello, welcome to React!</h1>;
}

export default function App() {
  return (
    <main>
      <Welcome />
      <p>My first React application.</p>
    </main>
  );
}
```

Notice how we use `<Welcome />` just like an HTML element. The difference is that it represents our own React component. When React renders `App`, it also renders `Welcome` and displays the JSX returned by that component.

We can even use the same component more than once:

```tsx
export default function App() {
  return (
    <main>
      <Welcome />
      <Welcome />
      <Welcome />
    </main>
  );
}
```

Now the same welcome message appears three times, even though we only wrote the component once.

This is one of the main benefits of components. We create a piece of the interface once and reuse it wherever we need it, without repeating its implementation.

However, our current `Welcome` component has a limitation: it always displays exactly the same message. What if we want to display a different name each time we use it?

We could create a separate component for every name, but that would bring us back to repeating code. Fortunately, React provides a much better solution.

## Pass Data to Components with Props

Imagine that we want to display a welcome message for several users. We have already created a `Welcome` component, so it would be convenient to reuse it with different names.

React allows us to do this by passing information from one component to another. This information is called **props**.

You can think of props as the inputs of a component. Just as a function can receive arguments, a React component can receive information from its parent and use it to determine what should appear on the screen.

Let's modify our previous example.

Since we are using TypeScript, we first need to describe the information our component expects to receive:

```tsx
type GreetingProps = {
  name: string;
};
```

This tells TypeScript that our component will receive a property called `name`, and that its value must be a string.

We can now use this type when defining our component:

```tsx
function Greeting({ name }: GreetingProps) {
  return <p>Hello, {name}!</p>;
}
```

The component receives the props object and extracts the `name` property. We can then use that value directly inside JSX.

Now let's use the same component with different names:

```tsx
export default function App() {
  return (
    <main>
      <Greeting name="Sarah" />
      <Greeting name="Alex" />
      <Greeting name="Maya" />
    </main>
  );
}
```

The result will be:

```text
Hello, Sarah!
Hello, Alex!
Hello, Maya!
```

Notice that we did not create three different components. We created one component and supplied it with different information each time we used it.

This is what makes props so useful: they allow us to reuse the same component in different situations without changing its implementation.

### Required and Optional Props

Not every component needs the same information in every situation. Sometimes a property is essential, while another property is only useful occasionally.

TypeScript allows us to describe this difference. For example, suppose we want our greeting component to display both a name and a city, but we do not always want to provide the city.

We can represent that using an optional property:

```tsx
type GreetingProps = {
  name: string;
  city?: string;
};
```

The `name` property is required, while `city` is optional. The question mark tells TypeScript that we can use the component without providing a value for `city`.

We can also provide a default value for that property:

```tsx
function Greeting({ name, city = 'your city' }: GreetingProps) {
  return (
    <p>
      Hello {name} from {city}.
    </p>
  );
}
```

Now we can use the component in two different ways:

```tsx
export default function App() {
  return (
    <>
      <Greeting name="Sarah" city="Oran" />
      <Greeting name="Alex" />
    </>
  );
}
```

In the first example, we provide the city ourselves, so the component displays Oran. In the second example, we leave the city out, and the component uses the default value instead.

### An Important Rule About Props

There is one important rule we need to remember when working with props: **props are read-only**.

A child component can use the information it receives, but it should not directly modify that information. This helps us keep the application organized and makes it easier to understand where data changes happen.

Imagine that a parent component sends a product quantity to a child component. The child can display that quantity, but if the value needs to change, the component responsible for managing the data should handle the update.

This gives us a predictable relationship between components: the parent provides the information, the child receives and uses it, and the parent remains responsible for deciding when that information changes.

So far, we have learned how to pass information into a component, but we have not yet dealt with information that changes while the user interacts with the application. For that, we need another important concept: state.

## Make Components Interactive with State

Until now, our components have mainly displayed information. We have passed them different values using props, but they have not managed any changing information themselves.

Let's imagine that we are building a simple product interface with a button that increases the available quantity. Every time the user clicks the button, the quantity should increase by one, and the new value should appear on the screen.

We could store the quantity in a normal JavaScript variable, but that would not be enough. We need a way for React to remember the value and update the interface whenever it changes.

This is exactly what **state** is used for.

State is data that React remembers between renders. When we update that data, React knows that the component needs to render again so the interface can display the new value.

The easiest way to understand this is through a simple counter.

### Create a Counter Component

We want to build a counter with three buttons. One button will increase the count, another will decrease it, and the last one will reset it to zero.

To manage the counter's value, we first need to import `useState` from React:

```tsx
import { useState } from 'react';
```

`useState` is a React Hook that allows function components to manage state.

Now let's build our counter:

```tsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <h1>Counter</h1>

      <p>Current count: {count}</p>

      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>

      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>

      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </section>
  );
}
```

Let's understand how this component works, starting with the line responsible for creating our state:

```tsx
const [count, setCount] = useState(0);
```

The `useState` function gives us two things. The first is `count`, which contains the current state value. The second is `setCount`, a function that allows us to request an update to that value. The `0` passed to `useState` is the initial value, which means our counter starts at zero.

Now that we have a state variable, we can display it inside our JSX:

```tsx
<p>Current count: {count}</p>
```

Because `count` is a JavaScript variable, we can insert its value into JSX using curly braces. React will display whatever the current state value happens to be.

The remaining part is connecting the buttons to our state. Take the Increment button as an example:

```tsx
<button onClick={() => setCount(count + 1)}>
  Increment
</button>
```

We use the `onClick` event to tell React which function should run when the user clicks the button. In this case, the function calls `setCount` and requests that the counter be updated with a value one greater than its current value.

The other buttons follow the same idea. The Decrement button uses `setCount(count - 1)` to decrease the value, while the Reset button uses `setCount(0)` to return it to zero.

With these few lines, we have created a component that responds to user interaction.

### What Happens When State Changes?

Now that the counter works, let's look at what happens behind the scenes.

Imagine that the counter currently displays zero. When the user clicks Increment, the `onClick` function runs and calls `setCount` with the new value.

React receives this state update and renders the component again. This time, `count` contains the new value, so the JSX describes an interface that displays one instead of zero. React then updates the displayed value in the browser.

The process can be represented like this:

```text
1. The user clicks the button.
                 |
                 v
2. The onClick function runs.
                 |
                 v
3. setCount requests a state update.
                 |
                 v
4. React renders the component again.
                 |
                 v
5. The component now uses the new count.
                 |
                 v
6. React updates the displayed value.
```

The important thing to notice is that we never manually search for the paragraph and change its text. We simply update the state, and React takes care of updating the interface to match it.

This is the same idea we discussed at the beginning of the workshop: we describe what the interface should look like based on the current data, and React handles the updates when that data changes.

### A Normal Variable Is Not the Same as State

At this point, you might wonder why we need `useState` instead of using a normal JavaScript variable.

For example, why couldn't we simply write:

```tsx
let count = 0;
```

The problem is that a normal variable does not behave the way we need inside a React component.

Whenever React renders a component again, the component function runs again. A normal variable declared inside that function is created again, so it does not remember the value from the previous render.

There is another problem: changing a normal variable does not automatically tell React that the interface needs to be updated.

State works differently because React keeps track of its values between renders. When we update state using its setter function, React knows that the component needs to render again and display the new value.

That is why we use state for information that needs to be remembered and displayed over time.

### A Small Detail About Updating State

You may sometimes see the counter updated using this syntax:

```tsx
setCount((currentCount) => currentCount + 1);
```

Instead of:

```tsx
setCount(count + 1);
```

Both forms can be used to increase the counter. However, the first form calculates the next value using the previous state value supplied by React.

This is particularly useful when the next state depends on the previous one, especially when several state updates may happen close together.

As our applications become more complex, we will use this form more often.

## How Components, Props, and State Work Together

We have now learned three important concepts: components, props, and state. Components allow us to divide the interface into smaller reusable pieces, props allow us to pass information between those pieces, and state allows a component to manage information that changes over time.

It is important to understand that these concepts are not separate features. They work together whenever we build a real application.

Let's improve our counter example to see how.

Imagine that we do not want the counter component to handle everything itself. Instead, we want to divide it into two components: one responsible for managing the counter and another responsible for displaying its current value.

We can call them `Counter` and `CounterSummary`.

The `Counter` component will own the state, while `CounterSummary` will receive the current value through props. This way, each component has a clear responsibility.

Here is what the implementation looks like:

```tsx
import { useState } from 'react';

type CounterSummaryProps = {
  count: number;
};

function CounterSummary({ count }: CounterSummaryProps) {
  return <p>Current count: {count}</p>;
}

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <section>
      <h1>Counter</h1>

      <CounterSummary count={count} />

      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </section>
  );
}
```

When the application starts, `Counter` creates its state with an initial value of zero and passes that value to `CounterSummary`. The summary component receives the value through its `count` prop and displays it.

When the user clicks Increment, the state inside `Counter` changes. React then renders the updated interface, and `CounterSummary` receives the new value through props.

Notice that `CounterSummary` does not need to manage the counter itself. It simply displays the information it receives. The `Counter` component remains responsible for managing the data.

This is an example of **one-way data flow**. Information normally moves from parent components to child components through props.

But what happens when a child component needs to request a change to information owned by its parent? In that situation, the parent can pass a function to the child, allowing it to request an update. We will explore this type of communication in Workshop 2.

For now, remember the general relationship: **props carry information into a component, while state allows a component to manage information that changes over time.**

## Understanding Rendering

Throughout this workshop, we have used the word *render* several times. We have seen that React renders components when the application starts and when their state changes, but let's take a closer look at what rendering actually means.

In React, rendering means that React calls a component to find out what the interface should look like based on its current props and state.

When something triggers a render, React executes the component function again. The component returns JSX describing the interface with its current data. React then compares the new result with the previous one and applies the necessary changes to the browser's DOM.

Let's connect this to our counter example.

Suppose the counter currently displays zero. When the user clicks Increment, the state update triggers another render. React calls the component again, and this time its JSX contains the value one instead of zero.

React then updates the displayed value in the browser.

This is why we say that our interface is based on the current state and props of our components. The component describes what should appear on the screen, and React takes care of keeping the DOM consistent with that description.

Understanding this also explains why we should avoid manually changing the DOM when working with React.

For example, we should not search for the counter paragraph ourselves and replace its text. Instead, we update the state and let React handle the necessary changes.

This keeps the application predictable because the interface remains connected to the data that describes it.

## Workshop Challenge: Build a Counter Interface

Now that we understand how React applications work, how to create components, and how props and state fit together, it is time to put everything into practice.

Throughout the workshop, we used small examples to understand each concept individually. For this challenge, we will combine them into a small counter interface.

Starting from the Vite project located at:

```text
Workshop1/Example/my-app
```

Build an interface with the following requirements:

1. Create a reusable `Counter` component.
2. Add three buttons: Increment, Decrement, and Reset.
3. Prevent the counter from going below zero.
4. Add a second counter that can start with a different initial value.
5. Create a `CounterSummary` component that receives the counter value through props.
6. Style the interface using CSS.
7. Use semantic HTML elements and make sure the buttons have visible keyboard focus styles.

### Challenge Goal

The purpose of this challenge is to bring together the ideas we have learned. You will create reusable components, pass information through props, manage changing values with `useState`, and handle user interactions using button events.

As you work, pay attention to how the different components communicate and how React updates the interface when the state changes.

Try to solve the challenge yourself before looking for a complete solution. The goal is not simply to make the counter work, but to understand why it works and how the different React concepts fit together.

## Workshop Recap

We have covered quite a bit in this first workshop. We started by understanding why React is useful and how it approaches building user interfaces. Then we prepared our development environment, created a project with Vite, explored its structure, and gradually moved into writing our own components.

Before moving forward, let's revisit the main ideas and make sure we understand how they connect.

We first learned that **React is a library for building user interfaces**. Instead of putting an entire interface into one large piece of code, we divide it into reusable components and combine them to build the application. We also saw that React allows us to describe the interface based on the current data rather than manually changing individual HTML elements whenever something changes.

To create and develop our application, we prepared an environment using Node.js, npm, and Vite. Node.js provides the environment for running development tools, npm manages the packages and project commands, and Vite handles the development server and production build process. We also introduced TypeScript, which helps us catch certain errors while writing code.

After creating the project, we explored the files responsible for starting and managing the application. We saw that `index.html` provides the HTML document loaded by the browser, while `main.tsx` connects React to the page. The `App.tsx` file usually contains the root component from which the rest of the interface is built.

We also looked at the configuration files. `package.json` describes the project, its dependencies, and the scripts we can run. `package-lock.json` records the resolved package versions, while `vite.config.ts` controls how Vite behaves. The `tsconfig` files contain the TypeScript configuration used to check different parts of the project.

Finally, we explored the React fundamentals that we will use throughout the course. JSX allows us to describe the interface using HTML-like syntax inside TypeScript files. Components divide the interface into reusable pieces, while props allow us to pass information from parent components to children. State, managed through `useState`, allows components to remember and update information as the user interacts with the application. Whenever state changes, React renders the component again and updates the DOM when necessary.

### Self-Check

Before moving to the next workshop, take some time to answer these questions:

1. What is React, and what problem does it help us solve?
2. What is the difference between a component and a normal HTML element?
3. What are Node.js, npm, and Vite used for?
4. What happens when the browser opens a React application?
5. What is the purpose of `main.tsx`?
6. What is the difference between `package.json` and `package-lock.json`?
7. What is the purpose of `vite.config.ts`?
8. What is the difference between props and state?
9. What happens when we call a state setter such as `setCount`?
10. Why should we let React update the DOM instead of changing it manually?

You do not need to memorize every line of code we have written. What matters is that you understand the ideas behind it and can explain how the different parts work together.

Try answering these questions without looking back at the explanations, then complete the counter challenge. If you can explain the concepts and build the counter yourself, you have understood the main ideas of this workshop.

## How This Leads to Workshop 2

In this workshop, we learned how a React application starts, how to create components, how to pass information between them, and how to make them interactive using state.

However, our examples were still relatively small. We mostly worked with a component managing its own data or passing a value to another component.

Real applications are more complex because they contain many components that need to communicate and work together.

Imagine that we want to build a task manager. The interface might contain a task list, individual task items, an input field, and buttons for adding, editing, or deleting tasks.

These components cannot work completely independently. For example, when a user adds a new task, the application needs to receive the information, update the task list, and display the new item on the screen. When a task is deleted, the list needs to reflect that change as well.

To build something like this, we need to understand how to organize data between components, how to display collections of information, and how to handle interactions that involve several parts of the interface.

That is exactly what we will explore in **Workshop 2**. We will build a small task manager and use it to understand how components communicate, how to display lists of data, and how to handle more complex user interactions.

By then, you will start seeing how the concepts from this first workshop come together to build a more complete React application.
