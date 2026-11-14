# Workshop 4: Routing and Application State

In the previous workshops, we learned how to build React components, manage data using state, handle user interactions, and communicate with external systems through APIs. Our task manager can now display tasks, allow users to modify them, and retrieve information from a server.

However, as applications grow, users need more than one screen. Imagine expanding our task manager into a complete productivity application. We might want a dashboard showing task statistics, a page displaying all tasks, a separate page for each task, and a settings page where users can change their preferences.

We could create a component for each screen, but we still need a way to determine which component should appear when the user visits a particular URL. We also need to think about how information is shared between these screens. For example, the selected theme should be available throughout the application, while a search term might belong to a particular page.

These challenges introduce the two main topics of this workshop: **routing and application state**.

We will start by learning how to create multiple pages and navigate between them using React Router. Then, we will explore how to organize application state, understand where different types of information should be stored, and allow components to share information. Finally, we will introduce Redux Toolkit and see how it helps manage more complex shared state.

## Objectives

By the end of this workshop, you should be able to:

- Understand the difference between a component and a route.
- Create multiple pages using React Router.
- Navigate between pages without reloading the entire application.
- Work with dynamic route parameters.
- Create shared layouts using nested routes.
- Work with redirects and URL query parameters.
- Understand how Context allows components to share information.
- Distinguish between local state, URL state, shared client state, and server state.
- Understand when Redux Toolkit is useful for managing application state.

## Why Do We Need Routing?

In the previous workshops, most of our examples displayed one main component inside the `App` component.

For example:

```tsx
function App() {
  return <TaskPage />;
}
```

This works perfectly well when our application has only one screen. However, as soon as we start adding more functionality, we need a way to display different interfaces depending on what the user wants to access.

Imagine that we want to expand our task manager into a productivity application. We might need several pages:

```text
Productivity App
│
├── Dashboard
│
├── Tasks
│
├── Task Details
│
└── Settings
```

Each page represents a different part of the application. Although we can create a React component for each one, we still need a mechanism to decide which component should be displayed.

We could try to manage navigation manually using a state variable that stores the currently selected page. However, this approach would quickly become difficult to maintain, especially when the application contains many pages.

There is also another problem: normal browser navigation should continue to work. Users should be able to open a particular page directly using its URL, refresh the browser without losing their current location, bookmark pages, and use the Back and Forward buttons. They should also be able to share a link that opens a particular task.

To support these behaviors, we need a way to connect URLs to React components.

This is what **routing** does.

### What Is Routing?

Routing is the process of determining which page or component should appear based on the current URL.

For example, imagine that our application uses the following URLs:

| URL | Displayed page |
|---|---|
| `/` | Dashboard |
| `/tasks` | Task list |
| `/tasks/123` | Details of task 123 |
| `/settings` | Application settings |

The router examines the current URL and determines which route matches it. Based on that match, it displays the corresponding component.

For example, when the user visits:

```text
http://localhost:5173/tasks
```

the router displays the task list.

When the user visits:

```text
http://localhost:5173/tasks/123
```

the router displays the details page for the task with ID `123`.

There is an important distinction to understand here: **a component and a route are not the same thing**.

A component represents a reusable piece of the interface, while a route connects a URL to the component that should appear for that URL. One route may display a single component or an entire layout containing several components.

### How Does Navigation Work in a Single-Page Application?

Remember when we discussed single-page applications in Workshop 1?

A single-page application initially loads an HTML document. After that, JavaScript handles much of the navigation between different views without requiring the browser to download an entirely new HTML document every time the user changes pages.

For example, when a user clicks the Tasks link, React Router can update the URL and display the task page without reloading the entire application.

The URL still changes, but the browser does not need to load another document. This is called **client-side navigation**.

However, there is an important detail to consider.

Imagine that the user directly opens:

```text
http://localhost:5173/tasks/123
```

or refreshes the browser while viewing that page.

The browser sends a request to the server asking for `/tasks/123`. Since the browser is performing a new request, the server must know that this URL belongs to the React application and return its main HTML document. React Router can then inspect the URL and display the appropriate page.

If the server does not support this behavior, the user may receive a 404 error even though the route works correctly when navigating from inside the application.

This is why production deployments often need a fallback configuration that serves the React application's entry document for frontend routes.

In other words, React Router manages navigation inside the application, while the hosting server handles the initial request. Both need to work together.

## Install React Router

React itself does not include a complete routing system. Instead, we use a routing library that provides the functionality needed to manage navigation and connect URLs to components.

One of the most widely used options is **React Router**.

Let's install it.

Open your terminal inside the React project and run:

```bash
npm install react-router
```

This workshop uses the declarative routing API from React Router v7. With this version, we import components and Hooks such as `BrowserRouter`, `Routes`, `Route`, and `Link` directly from the `react-router` package.

After installation, we can start defining the routes of our application.

## Create Your First Routes

Now that React Router is installed, let's create our first multi-page application.

We will start with three pages: a home page, an about page, and a not-found page.

First, create the corresponding components inside a `pages` folder:

```text
src/
│
├── pages/
│   ├── HomePage.tsx
│   ├── AboutPage.tsx
│   └── NotFoundPage.tsx
│
├── App.tsx
└── main.tsx
```

Each file contains a React component responsible for displaying one page.

For example, our home page could look like this:

```tsx
// HomePage.tsx

export default function HomePage() {
  return <h1>Home Page</h1>;
}
```

The about page can follow the same structure:

```tsx
// AboutPage.tsx

export default function AboutPage() {
  return <h1>About Page</h1>;
}
```

Finally, we create a component to handle URLs that do not match any of our defined pages:

```tsx
// NotFoundPage.tsx

export default function NotFoundPage() {
  return <h1>404 - Page Not Found</h1>;
}
```

We now have three components, but React Router still needs to know which URL should display each one.

Open `App.tsx` and define the routes:

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

Let's understand the important parts of this structure.

### BrowserRouter

```tsx
<BrowserRouter>
  {/* Application routes */}
</BrowserRouter>
```

`BrowserRouter` connects React Router to the browser's URL and navigation history. It allows the router to know which URL the user is currently visiting and respond when that URL changes.

We normally place it near the root of the application so that all our routes and navigation components can access the routing system.

### Routes

```tsx
<Routes>
  {/* Route definitions */}
</Routes>
```

`Routes` contains the route definitions. When the URL changes, React Router examines the available routes and determines which one matches the current location.

### Route

```tsx
<Route path="/" element={<HomePage />} />
```

A `Route` connects a URL pattern to a React component.

In this example, `path="/"` specifies the URL, while `element={<HomePage />}` tells React Router which component should be displayed when that URL matches.

We can define as many routes as our application requires.

### Understanding the Catch-All Route

Notice this route:

```tsx
<Route path="*" element={<NotFoundPage />} />
```

The `*` is a special pattern that matches URLs that do not match another available route.

For example, imagine that a user enters:

```text
/tasks/unknown/page
```

If no other route matches that URL, React Router displays the `NotFoundPage` component.

This gives us a way to handle unknown URLs instead of leaving the user with a blank screen.

## Navigate Between Pages

We now have several routes, but how can users move between them?

We could use ordinary HTML links:

```html
<a href="/about">About</a>
```

However, there is an important difference between an ordinary anchor and a React Router link.

An ordinary link normally asks the browser to navigate to another document. In a single-page React application, we usually want React Router to handle internal navigation without reloading the entire application.

For this purpose, React Router provides a component called `Link`.

### Using Link

Let's create a navigation component:

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

Notice that we use:

```tsx
<Link to="/about">About</Link>
```

Instead of the normal HTML `href` attribute, we use the `to` prop to specify the destination.

When the user clicks the link, React Router handles the navigation. The browser URL changes, and the router displays the component associated with the new route without performing a full page reload.

### Link vs. Ordinary Anchor

It is important to understand when to use each one.

We use `Link` for internal navigation, such as moving between the dashboard, task list, and settings pages.

For external websites, we use ordinary HTML anchors:

```tsx
<a href="https://react.dev">
  React Documentation
</a>
```

This is because external websites are outside our application's routing system.

### Using NavLink

Sometimes, navigation should also indicate which page the user is currently viewing.

Imagine that our application contains a sidebar:

```text
Dashboard
Tasks        ← Current page
Settings
```

We want the active link to look different from the others so users can easily understand where they are.

React Router provides another component called `NavLink` for this purpose.

`NavLink` works similarly to `Link`, but it also knows whether its destination matches the current page.

```tsx
import { NavLink } from 'react-router';

function MainNavigation() {
  return (
    <nav aria-label="Main navigation">
      <NavLink to="/">Dashboard</NavLink>

      <NavLink to="/tasks">Tasks</NavLink>

      <NavLink to="/settings">Settings</NavLink>
    </nav>
  );
}
```

We can also customize the appearance of an active link:

```tsx
<NavLink
  to="/tasks"
  className={({ isActive }) => isActive ? 'active' : ''}
>
  Tasks
</NavLink>
```

Here, `isActive` tells us whether the link matches the current route. We can use this value to apply a CSS class and change the link's appearance.

For example:

```css
.active {
  font-weight: bold;
  color: blue;
}
```

`NavLink` also provides an active accessibility state through the `aria-current` attribute.

This makes it particularly useful when building navigation menus because users should be able to identify the section they are currently viewing.

## Dynamic Routes and URL Parameters

So far, we have created routes with fixed paths:

```text
/
/tasks
/settings
```

But imagine that our application contains hundreds of tasks. Should we create a separate route for every task?

For example:

```text
/tasks/1
/tasks/2
/tasks/3
/tasks/4
```

Of course not. This would create unnecessary work because every route would display the same type of page, with only the task ID changing.

Instead, we can create a single route that accepts a variable part of the URL.

This is called a **dynamic route**.

### Creating a Dynamic Route

React Router allows us to define URL parameters using a colon (`:`).

For example:

```tsx
<Route
  path="/tasks/:taskId"
  element={<TaskDetailsPage />}
/>
```

The `:taskId` part is a dynamic parameter.

This means that all the following URLs match the same route:

```text
/tasks/1
/tasks/25
/tasks/abc123
```

The URL changes, but the route remains the same.

React Router provides a Hook called `useParams` that allows us to access these parameters inside a component.

### Reading a URL Parameter

Let's create our task details page:

```tsx
import { Link, useParams } from 'react-router';

function TaskDetailsPage() {
  const { taskId } = useParams();

  if (!taskId) {
    return <p role="alert">Task ID is missing.</p>;
  }

  return (
    <main>
      <h1>Task Details</h1>

      <p>Task ID: {taskId}</p>

      <Link to="/tasks">Back to Tasks</Link>
    </main>
  );
}
```

Let's understand what happens.

First:

```tsx
const { taskId } = useParams();
```

We use `useParams` to retrieve the values from the current URL.

If the user visits:

```text
/tasks/123
```

the value of `taskId` will be:

```text
123
```

We can then use this value to retrieve the corresponding task from an API or from our application's task collection.

For example, if our backend provides an endpoint such as:

```http
GET /api/tasks/123
```

we can use the ID to request the task details.

### An Important Detail About URL Parameters

A URL parameter is simply a value extracted from the URL. It does not guarantee that the requested record exists.

For example, if a user visits:

```text
/tasks/999999
```

React Router can extract the parameter successfully, even if there is no task with that ID in our database.

The application must still check its data source and handle situations where the requested task cannot be found.

Similarly, if our application expects numeric IDs, we should verify that the extracted value represents a valid number before using it.

Remember:

**React Router identifies the URL parameter. Our application is responsible for checking whether the corresponding data is valid and available.**

## Nested Routes and Shared Layouts

As our application grows, we will notice that several pages share the same structure.

For example, the dashboard, task list, and settings pages may all contain a header, navigation bar, sidebar, and main content area.

We could repeat this structure inside every page component, but that would introduce unnecessary duplication. Any time we wanted to change the header or sidebar, we would need to update several components.

Instead, React Router allows us to use **nested routes**.

The idea is to create a parent route that provides the shared layout, then define the individual pages as child routes.

Let's understand this through our productivity application:

```text
AppLayout
│
├── Header
│
├── Sidebar
│
└── Page Content
    │
    ├── DashboardPage
    ├── TaskListPage
    ├── TaskDetailsPage
    └── SettingsPage
```

The header and sidebar should remain visible as the user moves between pages. Only the main content area needs to change.

### Creating a Shared Layout

First, create a component called `AppLayout`:

```tsx
import { Link, Outlet } from 'react-router';

function AppLayout() {
  return (
    <div className="app-layout">
      <header>
        <Link to="/">My Productivity App</Link>
      </header>

      <div className="app-layout__body">
        <aside>
          <nav aria-label="Sidebar navigation">
            <Link to="/">Dashboard</Link>
            <Link to="/tasks">Tasks</Link>
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

Most of this component should look familiar. We are simply combining ordinary React components and HTML elements to create a shared application layout.

The new part is:

```tsx
<Outlet />
```

`Outlet` is the location where React Router displays the currently matched child route.

For example, when the user visits `/tasks`, React Router displays `TaskListPage` inside the `Outlet`.

When the user visits `/settings`, it displays `SettingsPage` in the same location.

The header and sidebar remain part of the layout instead of being recreated for every page.

### Defining Nested Routes

Now we need to connect our pages to the shared layout:

```tsx
import {
  BrowserRouter,
  Route,
  Routes,
} from 'react-router';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />

          <Route path="tasks" element={<TaskListPage />} />

          <Route
            path="tasks/:taskId"
            element={<TaskDetailsPage />}
          />

          <Route path="settings" element={<SettingsPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

Notice that the child routes are written inside the parent route.

We also use:

```tsx
<Route index element={<DashboardPage />} />
```

An index route is the default page displayed when the user visits the parent route without specifying a child path.

In our example, visiting `/` displays the dashboard.

The child paths are also written without repeating the parent path.

For example:

```tsx
<Route path="tasks" element={<TaskListPage />} />
```

Creates the URL:

```text
/tasks
```

And:

```tsx
<Route path="tasks/:taskId" element={<TaskDetailsPage />} />
```

Creates URLs such as:

```text
/tasks/123
/tasks/456
```

Because these routes are nested inside `AppLayout`, they all share the same header, sidebar, and layout structure.

The important idea is that nested routes allow us to reuse the same layout while displaying different page content.

## Redirects and Query Parameters

We now know how to create routes, navigate between pages, and display dynamic content.

There are two additional URL features that are especially useful in real applications: redirects and query parameters.

Let's understand how each one works.

### Redirecting Users to Another Page

Sometimes, a user visits a page that should no longer be displayed.

For example, imagine that we previously had a route called:

```text
/todos
```

But we later decided to rename it to:

```text
/tasks
```

We may want users who visit the old URL to be redirected to the new one.

React Router provides a component called `Navigate` for this purpose:

```tsx
import { Navigate } from 'react-router';

function LegacyTasksPage() {
  return <Navigate to="/tasks" replace />;
}
```

When this component is rendered, React Router navigates the user to the specified destination.

Notice the `replace` prop. It tells React Router to replace the current browser history entry instead of adding another one.

This is useful for redirects because pressing the Back button should not immediately send the user back to the old route.

We can also define the redirect directly inside our route configuration:

```tsx
<Route
  path="/todos"
  element={<Navigate to="/tasks" replace />}
/>
```

Now anyone visiting `/todos` will be redirected to `/tasks`.

### Understanding Query Parameters

So far, our routes have used paths such as:

```text
/tasks
/tasks/123
```

But URLs can also contain additional information after a question mark (`?`).

These values are called **query parameters**.

For example:

```text
/tasks?status=completed
```

Here, `/tasks` is the route, while `status=completed` is a query parameter.

Query parameters allow us to describe the current view without creating a completely different route for every possible variation.

For example:

```text
/tasks?status=active
/tasks?status=completed
/products?q=keyboard
/products?page=2
```

These URLs represent different filters, search terms, or pages within the same section of the application.

### Reading and Updating Query Parameters

React Router provides a Hook called `useSearchParams` that allows us to read and update query parameters.

Let's use it to create a search field for our task manager:

```tsx
import { useSearchParams } from 'react-router';

function TaskSearch() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') ?? '';

  function handleSearchChange(value: string) {
    const nextParams = new URLSearchParams(searchParams);

    if (value) {
      nextParams.set('q', value);
    } else {
      nextParams.delete('q');
    }

    setSearchParams(nextParams, { replace: true });
  }

  return (
    <label>
      Search tasks

      <input
        value={query}
        onChange={(event) =>
          handleSearchChange(event.currentTarget.value)
        }
      />
    </label>
  );
}
```

Let's understand what happens.

First:

```tsx
const [searchParams, setSearchParams] = useSearchParams();
```

This Hook provides two values. `searchParams` allows us to read the current query parameters, while `setSearchParams` allows us to update them.

Next:

```tsx
const query = searchParams.get('q') ?? '';
```

We retrieve the value of the `q` parameter.

For example, if the current URL is:

```text
/tasks?q=meeting
```

the value of `query` will be:

```text
meeting
```

When the user changes the input, we create a new copy of the current parameters and update the search term.

If the user enters `project`, the URL becomes:

```text
/tasks?q=project
```

If the input becomes empty, we remove the `q` parameter.

We use:

```tsx
setSearchParams(nextParams, { replace: true });
```

The `replace` option prevents each character typed by the user from creating a separate browser history entry.

Without it, pressing the Back button could take the user through every previous search value. Replacing the current entry keeps the navigation history more useful.

### When Should We Use Query Parameters?

Query parameters are particularly useful when the current view should be shareable.

Imagine that a user filters tasks to display only completed ones.

We could keep this filter in component state, but refreshing the page would reset it.

Instead, we can represent the selected filter in the URL:

```text
/tasks?status=completed
```

Now the selected view is part of the URL. The user can bookmark the page or share the link with someone else.

A useful rule is:

**If a piece of information describes the current page and should survive refreshing or sharing the URL, consider storing it in the URL.**

However, URLs are not private storage. They can appear in browser history, server logs, and other places. Never put passwords, authentication tokens, or other sensitive information in query parameters.

## Understanding How Application State Is Organized

We have now learned how to build multiple pages and navigate between them.

However, this introduces another challenge.

Imagine that the user selects dark mode inside the settings page. We want the entire application to use that theme, including the dashboard, navigation bar, task list, and task details page.

How can all these components access the same information?

We could pass the theme through props, but this would become inconvenient if many components need it. We could also create separate theme state inside each page, but then we would have several independent values that could become inconsistent.

To understand how to solve this problem, we first need to examine the different types of state used in an application.

### Different Types of Application State

Not all information in an application has the same purpose. Some information belongs to a single component, while other information needs to be shared. Some information describes the current URL, and some is controlled by a backend server.

It is useful to distinguish four main categories.

#### 1. Local Component State

Local state is information needed by one component or a small part of the interface.

For example, a dropdown may need to remember whether it is open, or a form may need to store the text currently being entered.

Other examples include temporary selections and the visibility of dialogs.

We can manage this information using `useState` or `useReducer`.

#### 2. URL State

URL state is information that describes the current page or view.

For example, the current search term, selected filter, page number, or task ID may be represented in the URL.

We can manage this information using React Router's route parameters and query parameters.

#### 3. Shared Client State

Shared client state is information managed by the frontend but needed by several components.

For example, the selected application theme, current language, or a shared client-side shopping cart may need to be accessible throughout different sections of the application.

We can manage this information using Context or a state management library.

#### 4. Server State

Server state is information that belongs to the backend and is retrieved through API requests.

Examples include product records, user profiles, orders, and task records stored in a database.

This information is controlled by the server and may change independently of the current browser session.

Let's summarize these categories:

| Type of state | Example | Common solution |
|---|---|---|
| Local state | Open dialog, form input | `useState` / `useReducer` |
| URL state | Search, filters, page number | React Router |
| Shared client state | Theme, shared UI preferences | Context / Redux Toolkit |
| Server state | Products, users, orders | API / data-fetching tools |

This distinction is important because we should not use the same solution for every type of information.

For example, storing product quantities in a global React Context does not make that information available to other employees or save it in a database. The backend should remain responsible for that data.

Understanding which system owns a piece of information helps us choose the correct place to store and manage it.

## Sharing State with the Context API

We already learned how components communicate through props.

A parent can pass data to its children, and children can call functions provided by their parents. This works well when components are close to each other in the component tree.

However, imagine that several deeply nested components need the same theme value.

We would have to pass the theme through every intermediate component, even when those components do not actually need it.

This can make the code unnecessarily complicated.

React provides a feature called **Context** to help with this situation.

### What Is Context?

Context allows a component to make information available to other components inside its subtree without passing that information through every intermediate component.

For example, imagine the following component structure:

```text
App
│
├── Header
│   └── ThemeButton
│
├── Sidebar
│
└── Dashboard
    │
    ├── ProductList
    │
    └── ProductCard
        └── ThemeBadge
```

Several components need to know whether the application uses light or dark mode.

Without Context, we might have to pass the theme through several levels of props.

With Context, we can provide the theme near the application root and allow the components that need it to read it directly.

### Creating a Context

Let's create a theme system for our productivity application.

First, import the required functions and types:

```tsx
import {
  createContext,
  useContext,
  useState,
} from 'react';

import type { ReactNode } from 'react';
```

Next, define the possible theme values:

```tsx
type Theme = 'light' | 'dark';
```

Then, describe the information our Context will provide:

```tsx
type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
};
```

Our Context will provide two things: the current theme and a function that allows the user to switch between themes.

Now we can create the Context:

```tsx
const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined
);
```

Why do we use `undefined`?

Because initially, we want the Context to have no value until a component provides one. This also allows us to detect situations where a component tries to use the theme outside its provider.

### Creating the Theme Provider

A Provider is the component responsible for making the Context value available to its children.

Let's create one:

```tsx
type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');

  function toggleTheme() {
    setTheme((currentTheme) =>
      currentTheme === 'light' ? 'dark' : 'light'
    );
  }

  return (
    <ThemeContext.Provider
      value={{ theme, toggleTheme }}
    >
      <div data-theme={theme}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
```

Let's understand what happens.

First, the provider creates a state variable for the theme:

```tsx
const [theme, setTheme] = useState<Theme>('light');
```

Then, it defines a function that changes the theme:

```tsx
function toggleTheme() {
  setTheme((currentTheme) =>
    currentTheme === 'light' ? 'dark' : 'light'
  );
}
```

Finally, it makes both values available through the Context:

```tsx
<ThemeContext.Provider value={{ theme, toggleTheme }}>
  {children}
</ThemeContext.Provider>
```

Any component inside this provider can access these values without receiving them through props.

The surrounding `<div>` also receives a `data-theme` attribute. This allows us to use CSS selectors to apply different styles depending on the selected theme.

For example:

```css
[data-theme='light'] {
  background: white;
  color: black;
}

[data-theme='dark'] {
  background: #222;
  color: white;
}
```

### Create a Custom Hook for the Context

We could use `useContext` directly inside every component that needs the theme. However, we can make the code easier to use by creating a custom Hook.

```tsx
export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    );
  }

  return context;
}
```

Now, whenever a component needs the theme, it can simply call:

```tsx
const { theme, toggleTheme } = useTheme();
```

The custom Hook also checks whether the component is inside the provider. If it is not, the Hook throws a clear error instead of allowing the application to continue with an invalid Context setup.

### Using the Theme Provider

We now need to wrap our application with `ThemeProvider`.

For example:

```tsx
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  );
}
```

Here, all components rendered inside `AppRoutes` can access the theme, regardless of how deeply nested they are.

### Using Context Inside Components

Now let's create a button that allows the user to change the theme.

```tsx
import { useTheme } from './context/ThemeContext';

function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme}>
      Switch to {theme === 'light' ? 'dark' : 'light'} mode
    </button>
  );
}
```

We did not pass the theme or its update function through props. Instead, the component reads them directly from Context.

Any other component inside the same provider can do the same.

This is useful when information needs to be available across several parts of an application.

## When Should We Use Context?

Now that we understand how Context works, an important question remains:

Should we put all our application state inside Context?

No.

Context provides a way to share information with components, but it does not automatically solve every state management problem.

For example, if a component manages its own form input, there is no reason to place that value in a global Context. Similarly, if two closely related components need the same value, passing it through props may be simpler.

Context becomes useful when several components need the same information, especially when they are separated by multiple levels in the component tree and passing the same props through intermediate components becomes inconvenient.

Some common examples include application themes, the current language, user interface preferences, and information about the signed-in user.

### Context and Performance

There is another detail worth understanding.

When a Context provider's value changes, components that consume that Context are notified and may render again.

This is normally fine for relatively small values such as the application theme.

However, imagine placing thousands of frequently changing records inside one large Context. Many components may need to respond whenever that value changes, which can create unnecessary rendering work and make the application harder to maintain.

A better approach is to keep Context values focused.

For example:

```text
App
│
├── ThemeProvider
│
├── AuthProvider
│
└── Router
```

Each provider manages a particular concern.

We do not need to create a Context for every state variable, but we should avoid turning one Context into a container for everything.

Remember:

**Context helps components access shared information. It is not automatically a replacement for every state management tool.**

## Understanding Client State and Server State

We have discussed local state, URL state, and shared client state.

Now let's explore an important distinction when building real applications: the difference between client state and server state.

Imagine that our productivity application manages tasks for several users.

A user opens the task list and retrieves the tasks from the backend. Another user then modifies one of those tasks.

The first user's application may now display outdated information because the data shown in the browser does not automatically update whenever someone else changes the database.

This is different from something like opening a dropdown menu, which is entirely controlled by the current interface.

These two types of information have different responsibilities.

### Client State

Client state is information controlled by the frontend application.

For example:

```tsx
const [isDialogOpen, setIsDialogOpen] = useState(false);
```

This state describes whether a dialog is visible.

The frontend owns this information. There is no reason to ask the backend whether the dialog should be open.

Other examples include whether a sidebar is collapsed, which tab is selected, the current theme, or a temporary form value.

These values are generally managed using React state, Context, or a state management library.

### Server State

Server state is information that belongs to an external system, usually a backend database.

For example:

```text
Product:
  ID: 12
  Name: Keyboard
  Quantity: 35
```

The backend owns this product information. The frontend retrieves it through an API and displays the returned data.

Unlike local interface state, server data introduces additional challenges. Retrieving it takes time, requests can fail, the data can become outdated, and other users may modify it independently.

It may also need to be cached, refreshed, or synchronized with the backend after an operation.

This is why server state often requires more than a simple `useState` variable.

### Why Is This Distinction Important?

Imagine trying to manage every product record, user, order, and API response inside one global Context.

As the application grows, we would need to implement many behaviors ourselves, such as tracking loading states, handling errors, avoiding duplicate requests, caching previous results, refreshing outdated information, and updating related components after a mutation.

Instead of building all these features manually, we can use tools designed for managing server data.

For example, TanStack Query provides features for fetching, caching, and synchronizing server data. React Router also provides data APIs that can load information as part of route navigation.

For this workshop, the important thing is to understand that server state and client state are different problems.

A useful way to decide where information belongs is to ask:

1. Does this information describe the current URL?
2. Is it needed by only one component?
3. Is it shared between several components?
4. Does the backend own this information?

The answers help us choose the appropriate solution.

## Redux Toolkit: Managing Complex Shared State

We have now learned how to share information using Context.

For many applications, local state and Context are enough. However, imagine building a larger application where many unrelated components need to access and update the same client-side information.

For example, an application may have a shopping cart, a collection of locally selected products, shared UI preferences, and several features that need to coordinate around the same data.

As the application grows, managing all these updates through several Context providers may become difficult.

In such situations, a dedicated state management library can help.

One popular option is **Redux Toolkit**.

### What Is Redux?

Redux is a state management library that provides a central place to store shared application state and a predictable way to update it.

Instead of allowing different components to modify shared data independently, components send actions describing what happened. The central store processes those actions through reducers and produces the next state.

The general process looks like this:

```text
Component
    |
    | Dispatch an action
    v
Redux Store
    |
    v
Reducer
    |
    | Calculates the next state
    v
Updated Store
    |
    v
Components receive the updated data
```

This approach makes it easier to understand how shared state changes throughout a larger application.

### Why Redux Toolkit?

Older Redux examples often require considerable code to create stores, actions, and reducers manually.

Redux Toolkit simplifies this process and is the recommended standard approach for writing new Redux applications. It provides tools that reduce repetitive code while maintaining Redux's predictable state update model.

Let's create a small counter using Redux Toolkit.

First, install the required packages:

```bash
npm install @reduxjs/toolkit react-redux
```

We need two packages:

- `@reduxjs/toolkit` provides the Redux tools.
- `react-redux` connects the Redux store to React components.

### Step 1: Create a Slice

A Redux slice represents one part of the application state and contains the logic for updating it.

For example, we can create a counter slice.

Create the following file:

```text
src/
└── features/
    └── counter/
        └── counterSlice.ts
```

Inside `counterSlice.ts`, write:

```tsx
import {
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

type CounterState = {
  value: number;
};

const initialState: CounterState = {
  value: 0,
};

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

export const {
  increment,
  decrement,
  setValue,
} = counterSlice.actions;

export default counterSlice.reducer;
```

Let's understand the important parts.

**`name`**

The name identifies this slice. In our example, it is `counter`.

**`initialState`**

This defines the starting value of this part of the application state.

**`reducers`**

This object contains the functions that describe how the state can change.

For example:

```tsx
increment(state) {
  state.value += 1;
}
```

This function increases the counter.

You may notice something unusual. We are modifying `state.value` directly instead of returning a new object.

Isn't that something we learned to avoid when working with React state?

Normally, yes. However, Redux Toolkit uses a library called Immer internally.

Immer allows us to write code that looks like direct mutation while producing a new immutable state behind the scenes.

This special behavior applies to Redux Toolkit reducers. It does not mean that we can directly modify ordinary React state.

### Understanding Actions and Payloads

Notice this reducer:

```tsx
setValue(state, action: PayloadAction<number>) {
  state.value = action.payload;
}
```

Here, the action contains additional information called a `payload`.

For example, we may want to set the counter to 10. The payload carries that value to the reducer.

Redux Toolkit automatically creates action functions for the reducers we define.

For example:

```tsx
increment()
decrement()
setValue(10)
```

We export these functions so our components can use them when they need to update the counter.

### Step 2: Create the Redux Store

Now that we have defined our counter slice, we need to create the central store.

Create the following file:

```text
src/
└── app/
    └── store.ts
```

Inside `store.ts`, write:

```tsx
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

The `configureStore` function creates the Redux store.

We provide the reducers that belong to the application. Here, we register the counter reducer under the name `counter`.

This means that the counter state will be accessible through:

```tsx
state.counter
```

We also export two TypeScript types.

`RootState` describes the complete state stored in Redux, while `AppDispatch` describes the type of the dispatch function.

These types will help us use Redux safely with TypeScript.

### Step 3: Create Typed Redux Hooks

React Redux provides two Hooks that we need:

- `useSelector` allows us to read information from the Redux store.
- `useDispatch` allows us to send actions to the Redux store.

Since we are using TypeScript, we can create typed versions of these Hooks.

Create:

```text
src/
└── app/
    └── hooks.ts
```

Write:

```tsx
import {
  useDispatch,
  useSelector,
} from 'react-redux';

import type {
  AppDispatch,
  RootState,
} from './store';

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

export const useAppSelector = useSelector.withTypes<RootState>();
```

These Hooks allow us to access the store with the correct TypeScript types without repeating those types inside every component.

The `.withTypes()` API shown here is supported by modern React Redux versions.

### Step 4: Provide the Store to React

Just like Context, Redux needs a Provider.

We place it near the root of the application so that all child components can access the store.

For example:

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

Now every component inside `AppRoutes` can access the Redux store.

### Step 5: Use Redux Inside a Component

Let's create our counter component:

```tsx
import {
  increment,
  decrement,
} from './counterSlice';

import {
  useAppDispatch,
  useAppSelector,
} from '../../app/hooks';

function CounterPanel() {
  const value = useAppSelector(
    (state) => state.counter.value
  );

  const dispatch = useAppDispatch();

  return (
    <section>
      <p>Count: {value}</p>

      <button onClick={() => dispatch(decrement())}>
        -
      </button>

      <button onClick={() => dispatch(increment())}>
        +
      </button>
    </section>
  );
}
```

Let's understand what happens.

First:

```tsx
const value = useAppSelector(
  (state) => state.counter.value
);
```

We use `useAppSelector` to read the current counter value from the store.

Next:

```tsx
const dispatch = useAppDispatch();
```

We use `useAppDispatch` to obtain the function that sends actions to Redux.

When the user clicks the Increment button:

```tsx
dispatch(increment());
```

Redux processes the action through the counter reducer. The state is updated, and the component receives the new counter value.

React then updates the displayed interface.

### Redux Toolkit and Immutability

You may wonder again why the reducer code looks like it modifies the state directly.

For example:

```tsx
increment(state) {
  state.value += 1;
}
```

This is allowed because Redux Toolkit uses Immer.

Immer records the changes made to the draft state and produces a new immutable state behind the scenes.

This is different from writing:

```tsx
setCount(count + 1);
```

or modifying an array inside a normal `useState` updater.

The special behavior belongs to Redux Toolkit's reducer system.

Do not copy Redux Toolkit's mutation-style examples into ordinary React state updates.

### When Should We Use Redux Toolkit?

Redux Toolkit is useful when an application has complex shared client state that needs to be coordinated between many components.

However, it is not necessary for every React application.

For example, a simple form does not need Redux. A theme preference can usually be managed through Context, and a dialog's visibility can remain inside local component state.

Similarly, product records retrieved from an API are server state. Their presence alone does not mean that we need to create a Redux store.

Start with local state and Context. Consider Redux Toolkit when the complexity of shared client-state management justifies introducing a central store.

## How Do We Decide Where State Belongs?

We have now learned several ways to manage information in React applications.

Let's bring these ideas together.

Imagine that we are building a larger task management application. It contains a search input, a task filter, a task collection, a theme preference, and task records stored in a database.

Where should each piece of information go?

We can organize them like this:

| Information | Where should it live? | Reason |
|---|---|---|
| Search input being typed | Local state | It belongs to the search component. |
| Submitted search term | URL | It should be bookmarkable and shareable. |
| Selected page | URL | Navigation should preserve the current location. |
| Open sidebar | Local state | It is a temporary UI setting. |
| Application theme | Context | Several components need the same preference. |
| Complex shared client data | Redux Toolkit, when justified | Several features need coordinated updates. |
| Tasks stored in a database | Server state | The backend owns the records. |

There is no single solution for every situation. The correct choice depends on who owns the information, which components need it, and how long it needs to exist.

A useful decision process is to ask a few questions.

**Does only one component need this information?**

In that case, local state is usually the simplest solution.

**Should the information be represented in the URL?**

If it describes the current view and should survive refreshing or sharing the page, use route parameters or query parameters.

**Do several components need the same information?**

Consider Context or a shared state management solution.

**Does the information belong to a backend system?**

Retrieve and manage it as server state.

**Is shared client-state logic becoming difficult to coordinate?**

Consider Redux Toolkit or another suitable state management solution.

Understanding these decisions is more valuable than simply learning how to use every state management library. The goal is to choose the simplest approach that correctly manages the information.

## Workshop Challenge: Build a Multi-Page Task Manager

Now it is time to apply what we have learned.

Starting from the task manager developed in Workshop 2, expand it into a multi-page application.

Your application should contain the following structure:

```text
Productivity App
│
├── Dashboard
│
├── Tasks
│   └── Task Details
│
└── Settings
```

### Requirements

**1. Create the Application Routes**

Add the following routes:

```text
/
/tasks
/tasks/:taskId
/settings
```

The dashboard should be displayed when the user visits `/`.

**2. Create a Shared Layout**

Create an `AppLayout` component containing the application header, navigation sidebar, and main content area.

Use `<Outlet />` to display the currently selected page.

**3. Add Navigation**

Use `NavLink` for the application navigation.

The currently selected page should have a different visual appearance so users can easily identify where they are.

**4. Create a Task Details Page**

When the user clicks a task, navigate to:

```text
/tasks/123
```

Use `useParams` to retrieve the task ID and display the details of the selected task.

If the task does not exist, display an appropriate message.

**5. Add Search Through Query Parameters**

Allow users to search tasks using a URL such as:

```text
/tasks?q=meeting
```

The search term should remain available when the user refreshes or shares the URL.

**6. Create a Theme Context**

Allow users to switch between light and dark themes from the settings page.

The selected theme should be available throughout the application.

**7. Add a Not Found Page**

Display a useful message when the user visits an unknown route.

**8. Test Direct Navigation**

Open a nested route directly in the browser and refresh the page.

Make sure the development server and production hosting configuration support the application's routes.

**9. Organize Application State**

For each piece of information in your application, decide whether it belongs in local component state, the URL, Context, a dedicated client-state store, or the backend.

Be prepared to explain your choices.

### Challenge Goal

By completing this exercise, you will practise creating multiple routes, navigating between pages, reading URL parameters, working with query parameters, creating nested layouts, sharing information using Context, and organizing different types of application state.

Try to complete the challenge yourself before looking for a complete solution.

## Workshop Recap

In this workshop, we moved beyond individual pages and explored how to organize a larger React application. We learned how routing connects URLs to components and how different types of state can be managed and shared throughout the application.

### Routing and Navigation

A component represents a piece of the interface, while a route connects a URL to the component that should be displayed.

`BrowserRouter` connects React Router to browser navigation, while `Routes` contains the route definitions. Each `Route` connects a URL pattern to a component.

We use `Link` for internal navigation and `NavLink` when we also need to identify the active route. Dynamic routes allow us to work with variable URL segments, and `useParams` gives us access to those values.

Nested routes allow several pages to share the same layout, while `Outlet` determines where the currently matched child page should appear. We can also use `Navigate` for redirects and `useSearchParams` to read and update query parameters.

### Application State

Local state belongs to a component or a small part of the interface. URL state describes the current page or view, while Context allows components to share information without passing props through every intermediate component.

Server state represents information owned by an external system, such as a backend. Redux Toolkit provides a structured approach for managing complex shared client state.

### Architecture Decisions

Not every state variable needs to be global. Props remain a good solution for simple parent-child communication, while Context is useful when information needs to be shared across a component tree.

Server data should be treated differently from temporary interface state, and Redux Toolkit should be introduced when shared client-state complexity justifies a central store.

The backend remains responsible for persistent application data.

### Self-Check

Before moving to the next workshop, make sure you can answer these questions:

1. What is routing, and why do applications need it?
2. What is the difference between a component and a route?
3. What is the difference between `Link` and `NavLink`?
4. How do dynamic routes work?
5. What does `useParams` return?
6. Why do we use nested routes and `Outlet`?
7. What is the difference between a route parameter and a query parameter?
8. What problem does Context solve?
9. Why should we not put every state variable inside one Context?
10. What is the difference between client state and server state?
11. When should we consider Redux Toolkit?
12. Why is Redux Toolkit's mutation-style reducer syntax different from ordinary React state updates?

If you can answer these questions and complete the multi-page task manager challenge, you have understood the main concepts of this workshop.

## How This Leads to Workshop 5

In this workshop, we learned how to organize a React application into multiple pages, manage navigation, and decide where different types of information should live.

Our application now has a clearer structure, but there is another important aspect of development that we have not explored in depth: the visual design.

Imagine using our task manager. It has a dashboard, a task list, a settings page, and several reusable components. Although everything works correctly, the interface may still feel inconsistent if every page uses different colors, spacing, buttons, or typography.

A professional application should provide a consistent experience across all its pages.

To achieve this, we need more than individual CSS rules. We need a shared way of making design decisions.

In **Workshop 5**, we will explore design principles, design systems, visual consistency, reusable UI components, and design tokens.

We will learn how to create a common visual language and apply it throughout a React application so that the entire product feels like one coherent interface.
