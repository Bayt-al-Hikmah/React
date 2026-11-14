# Front-End Readiness Guide

This course starts with React, but professional front-end development also depends on understanding the browser platform. Use this guide as a prerequisite checklist or as a recap alongside the workshops.

React does not replace HTML, CSS, or JavaScript; it organizes how we build an interface using those browser technologies. When a React screen behaves unexpectedly, the cause may be a CSS layout rule, a browser event, a JavaScript value, or a request to the server. A developer who understands the underlying platform can diagnose the problem instead of treating every issue as a React-specific mystery. Use the sections below to identify gaps. You do not need to master every advanced browser topic before beginning, but you should be comfortable with the fundamentals and willing to learn them as the course uses them.

## 1. HTML and the Browser

HTML provides the structure and meaning of a page. Before React can render a form or navigation menu, the browser still needs to understand whether an element is a button, a link, a heading, or a region of main content. Semantic HTML gives that meaning to browsers, assistive technologies, and other developers. React does not remove this responsibility; it gives you a component model for producing the markup.

You should be comfortable with:

- The structure of an HTML document: `<!doctype html>`, `html`, `head`, and `body`.
- Semantic elements such as `header`, `nav`, `main`, `section`, `article`, `aside`, `footer`, and `button`.
- Links, images, lists, tables, and forms.
- Form labels, input types, required fields, and browser validation.
- The difference between an element's role, accessible name, and visual appearance.
- The browser DOM, events, event bubbling, and the difference between the DOM and a React component tree.

**Practice:** Build a semantic contact page using only HTML. Navigate it with a keyboard and make sure every form field has a label.

## 2. CSS and Layout

CSS controls how that structure is presented. React can decide which classes and content should be present, but CSS still determines how elements flow, size themselves, align, and adapt to different screen widths. A developer who understands the cascade and box model can distinguish a component bug from a styling conflict. Flexbox and Grid are especially important because most application interfaces are composed of repeated rows, columns, cards, sidebars, and content regions.

You should understand:

- The cascade, inheritance, specificity, and the box model.
- Normal document flow, `display`, positioning, and stacking contexts.
- Flexbox for one-dimensional layouts and Grid for two-dimensional layouts.
- Responsive design using flexible units, media queries, and mobile-first rules.
- Typography, color, spacing, borders, focus styles, and hover/active/disabled states.
- CSS custom properties (`--tokens`) and reusable class naming.

**Practice:** Create a responsive card grid that becomes one column on a narrow screen and three columns on a wide screen.

## 3. JavaScript for React

React is a JavaScript library, so the language remains the foundation of every component. JSX is only one part of the syntax; filtering data, handling events, transforming arrays, importing modules, and waiting for API responses all use JavaScript concepts. If array methods or asynchronous functions are unfamiliar, React examples can feel like several new subjects at once. Review the language features here so that the workshop can focus on React's model rather than repeatedly stopping to explain basic JavaScript.

React code uses ordinary JavaScript and TypeScript. Review:

- `const` and `let`, primitive values, objects, and arrays.
- Function declarations, arrow functions, parameters, return values, and scope.
- Destructuring, spread syntax, rest parameters, and template strings.
- Array methods: `map`, `filter`, `find`, `some`, `every`, and `reduce`.
- Imports and exports using ES modules.
- The difference between statements and expressions.
- Promises, `async` / `await`, `try` / `catch`, and the `fetch` API.
- Immutable updates: create a new object or array rather than mutating existing state.

**Practice:** Given an array of products, filter by category, search by name, and calculate the total price without changing the original array.

## 4. TypeScript Essentials

TypeScript adds a checking layer to JavaScript. It helps describe the data that components receive and the values that functions return. You do not need advanced type-level programming to benefit from it; simple object types, optional fields, unions, and narrowing are enough for many application features. Learn types alongside the React examples, and resist the temptation to use `any` whenever the compiler reports a problem. The error is often pointing to an assumption that should be clarified.

Workshop 1 introduces the TypeScript concepts needed for React. Before or during that workshop, become familiar with:

- Primitive types: `string`, `number`, `boolean`, `null`, and `undefined`.
- Object types, arrays, and optional properties.
- Function parameter and return types.
- Type inference and type annotations.
- Union types and narrowing.
- `type` and `interface` declarations.
- Why `any` removes useful checking and why `unknown` is safer for untrusted values.

You do not need to master advanced TypeScript before starting React. Learn each feature when it solves a real problem in the examples.

## 5. HTTP and API Basics

A front-end application rarely owns all of its data. It requests information from servers and sends changes back through HTTP. Understanding methods, status codes, headers, and JSON helps you interpret what happened when an API call fails. It also establishes an important security boundary: browser code is public, while the server is responsible for protecting privileged data and operations. Workshop 3 builds on these basics when it introduces asynchronous requests and their loading, success, empty, and error states.

Understand the purpose of:

- A client and a server.
- HTTP methods such as `GET`, `POST`, `PATCH`, `PUT`, and `DELETE`.
- Status codes, request headers, response headers, and JSON.
- Asynchronous requests and network failures.
- Authentication versus authorization.
- Why a browser application must never contain a private server secret.

**Practice:** Use the browser Network panel to inspect a request to a public JSON API. Identify its URL, method, status code, and response body.

## 6. Git and the Command Line

The terminal is where you create projects, install dependencies, run checks, and produce builds. Git records how the project changes over time and makes collaboration safer. You do not need to memorize every Git command, but you should be able to tell which folder you are in, inspect the current changes, create a meaningful commit, and recognize which files are generated or machine-specific. These habits become increasingly important as the course moves from individual exercises to a complete application.

Be able to:

- Move between folders and inspect files in a terminal.
- Run npm commands from the project root.
- Initialize a Git repository, create commits, and inspect changes.
- Use `.gitignore` to exclude generated files, local secrets, and dependencies.
- Read terminal errors instead of immediately deleting configuration files.

## Readiness Standard

You are ready to start Workshop 1 when you can build a simple responsive HTML/CSS page, write functions that transform arrays and objects, use ES module imports, and explain what happens when a browser sends a request to a server. You can learn the remaining details as you progress through the course.
