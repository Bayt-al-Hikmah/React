# Workshop 1: React Foundations and Modern Tooling

This first workshop answers a simple question: what actually happens between opening a browser page and seeing a React interface? Before building complicated screens, we need a reliable mental model of the tools and the rendering process. Think of a product dashboard that begins as an empty page. Vite creates the project environment, the browser loads its HTML entry document, React mounts the application, and components describe the content that appears. Each later workshop will add behavior to this foundation.

## Objectives

By the end of this workshop, you should be able to:

- Explain what React does and when a client-side application is useful.
- Create a modern React project with Vite and TypeScript.
- Understand the purpose of `package.json`, npm scripts, `vite.config.ts`, and TypeScript configuration.
- Navigate the generated project structure and identify the application entry point.
- Write JSX in `.tsx` files and build function components.
- Pass typed props and use state to make a component interactive.

## What Is React?

React is a library for building user interfaces from reusable components. A component receives data, describes what should appear on the screen, and can respond to user interactions. React coordinates rendering when that data changes.

It helps to think of a user interface as a visual description of application data. A stock dashboard, for example, may display a product name, its current quantity, and whether the quantity is low. If the quantity changes, the interface should display the new value and possibly change its status label. React gives us a way to describe how the interface should look for the current data, rather than writing separate instructions for every possible visual change.

React is not a complete front-end framework by itself. It does not automatically provide every application feature, such as routing, data fetching conventions, server rendering, or a deployment platform. We add appropriate tools when the application needs them. This is an important distinction for beginners: learning React means learning its component and rendering model, while building a complete product also requires decisions about navigation, data, styling, testing, hosting, and the browser platform.

### Multi-Page Applications and Single-Page Applications

In a traditional multi-page application, navigation commonly asks the server for a new HTML document. In a client-side single-page application (SPA), the browser initially loads the application shell, and JavaScript can update the visible view as the user navigates. A routing library manages the relationship between the URL and the displayed page.

Neither approach is automatically better in every situation. Server-rendered pages can be simple, accessible, and effective for content-focused sites. A client-side application can provide rich interactions and persistent application state. Rendering strategy is an architectural decision, not a definition of React itself.

Consider the difference from the user's point of view. A customer reading an article may benefit from a straightforward page delivered by the server. A staff member working in an inventory dashboard may spend several minutes filtering rows, opening details, editing quantities, and moving between related screens. A client-side application can make those repeated interactions feel continuous because the browser can update the relevant view without requesting a new document each time. The choice should follow the product's needs, not a belief that every modern website must be an SPA.

**Important:** React can be used inside an existing page, in a client-rendered SPA, or as part of a framework that supports server rendering. This course uses Vite to learn the client-side React model. For a production project requiring server rendering or an integrated full-stack architecture, evaluate a React framework as well.

### React's Main Ideas

React becomes easier to understand when its main ideas are treated as parts of one model rather than as a list of unrelated features. A component receives information, uses that information to describe a piece of the interface, and may receive events from the user. When the information changes, React calls the relevant components again and updates the browser DOM to match the new description. The following ideas explain the different parts of that process.

**Declarative UI:** In an imperative approach, you might search for a paragraph in the DOM, replace its text, find a button, add a CSS class, and then remember to undo those changes later. In React, you describe the paragraph and button for the current state. For example, you can say that a product row should show a warning badge when its quantity is below a threshold. When the quantity changes, React receives the new description and updates the rendered interface. You focus on what should be visible, while React coordinates the DOM updates.

**Components:** A component is a named unit of interface and behavior. A large dashboard can be composed from a page header, navigation, product table, filter form, and status badge. Each component should have a reason to exist: it might encapsulate a repeated visual pattern, a meaningful piece of behavior, or a page region with a clear responsibility. Components are not created merely to split every few lines of JSX; they are created to make the interface easier to understand, reuse, and change.

**One-way data flow:** Information normally moves from a parent component to its children through props. A child receives what it needs to display, but it does not directly edit the parent's data. When the user clicks an action in the child, the child can call a callback supplied by the parent. The parent then decides how the data should change and passes the updated value back down. This may sound like an extra step, but it creates a predictable direction for data and makes it easier to locate the source of a change. Workshop 2 will turn this idea into practical component communication.

**Rendering and committing:** When React renders a component, it calls the component function to calculate the JSX for the current props and state. React then compares that description with the previous one and commits the required changes to the browser DOM. This is why component functions should be pure: rendering should describe the UI, not perform unrelated work such as sending requests or manually changing DOM nodes. The internal reconciliation process helps React determine what needs updating, but it does not guarantee that every update changes only one DOM node or that performance is automatically perfect. Component design, data size, browser layout, and network work still matter.

## Prepare the Development Environment

A React project runs in a browser, but its development tools run through Node.js. Node provides the environment in which npm and Vite execute; npm downloads the libraries the project depends on and runs the commands defined by the project. These tools do not replace the browser. They prepare and transform the files that the browser will eventually load. Understanding that boundary will help you make sense of terminal errors, browser errors, and build errors later in the course.

Install a current supported Node.js release and npm. The current Vite guide lists Node.js `20.19+` or `22.12+` as supported minimum lines; newer supported LTS versions are suitable too. Check the Vite documentation when setting up a new machine because tool requirements can change.

Verify the installation:

```bash
node --version
npm --version
```

Use a code editor with TypeScript and ESLint support. React Developer Tools is useful for inspecting component trees, props, state, and renders in the browser.

## Create a React + TypeScript Project with Vite

Scaffolding is the process of generating a project with a known starting structure. It saves time, but it does not mean that the generated files should remain mysterious. After running the commands, open the folder and inspect every top-level file. The aim is not to memorize the generated template; it is to learn which file starts the development server, which file configures the build, which file declares packages, and which file contains the first React component. We will connect those pieces one by one.

Create React applications with the official Vite React + TypeScript template:

```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev
```

Open the local URL shown in the terminal. Vite serves the project and updates the browser during development when source files change.

To stop the development server, return to the terminal and press `Ctrl + C`.

### Why Vite?

Vite is a build tool. It provides a development server, fast module updates during development, and a production build process. It is not a React component library and does not replace React or TypeScript. Its job is to make the development cycle efficient and to prepare browser-ready assets when the application is ready to ship.

During development, Vite serves the source modules and uses the browser's module system together with its development transformations. When you edit a component, its development tooling can update the affected module without requiring a full page reload in many cases. This feedback loop is often called Hot Module Replacement or HMR. It lets you make a small change, see the result, and keep working quickly. When you run the production build, Vite follows a different path: it processes assets and creates the optimized files that will be deployed.

The responsibilities are different:

| Tool | Responsibility |
|---|---|
| React | Component model and UI rendering. |
| TypeScript | Static type checking and editor feedback. |
| Vite | Development server, asset processing, and production bundling. |
| npm | Installing packages and running scripts. |

## Understand the Project Structure

The exact generated files can change between Vite template versions. A typical React + TypeScript project contains:

```text
my-react-app/
├── public/                 # Static files copied as-is
├── src/
│   ├── assets/             # Imported assets such as images
│   ├── App.tsx             # Root application component
│   ├── main.tsx            # React entry point
│   └── index.css           # Global styles
├── index.html              # HTML entry document
├── package.json            # Project metadata, dependencies, scripts
├── package-lock.json       # Exact npm dependency resolution
├── tsconfig.json           # TypeScript project configuration
├── tsconfig.app.json       # Often used for application source
├── tsconfig.node.json      # Often used for Node-based config files
└── vite.config.ts          # Vite configuration
```

**`index.html`** is the browser document Vite uses as its entry point. It contains the root element where React mounts the application and a module script that loads `src/main.tsx`.

**`src/main.tsx`** is the client entry point. It finds the root DOM element and asks React to render the root component:

```tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const container = document.getElementById('root');

if (!container) {
  throw new Error('Root element #root was not found');
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

`createRoot` is the modern browser entry API. Do not use the old `ReactDOM.render` API in new projects. `StrictMode` enables additional development checks. It may intentionally run render logic and Effects more than once in development to reveal bugs; this is not an extra production render guarantee.

The call to `createRoot` connects React to that DOM element; after that point, the React tree controls the UI inside the root. You can still use ordinary browser APIs when appropriate, but normal interface updates should be expressed through React state and props rather than by manually editing elements that React manages.

**`src/App.tsx`** is usually the root component. It composes other application components.

**`public/`** is for files that should be served with their original names. Files imported from `src/` can be processed and fingerprinted by Vite.

## Understand `package.json` and npm

`package.json` describes a Node project. It commonly contains a package name, version, scripts, dependencies, and development dependencies. Think of it as the project's manifest: it tells npm what the project is called, which packages it needs, and which repeatable commands the team can run. It is also the first file another developer usually inspects when joining a project, because the scripts reveal how the application is started, checked, tested, and built.

Example:

```json
{
  "name": "my-react-app",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --noEmit",
    "build": "npm run typecheck && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^19.3.1",
    "react-dom": "^19.3.1"
  },
  "devDependencies": {
    "@types/react": "^19.3.0",
    "@types/react-dom": "^19.3.0",
    "@vitejs/plugin-react": "^6.3.0",
    "typescript": "^7.0.2",
    "vite": "^8.3.8"
  }
}
```

The versions above are a modern baseline checked for this course update. When you scaffold a new project, prefer the package versions generated by the current official Vite template rather than forcing these numbers into an older project.

The version strings use semantic-versioning conventions. A prefix such as `^` generally allows npm to resolve compatible updates within the specified major version, while the lockfile records the exact resolved versions used for a particular installation. The manifest expresses the project's dependency policy; the lockfile records the concrete result. 

The `private` field prevents accidental publication of an application package to the public npm registry. The `type: "module"` field tells Node to interpret relevant `.js` files as ES modules, which is consistent with the import/export syntax used by modern Vite configuration.

### Dependencies vs. Development Dependencies

- `dependencies` are packages the application needs at runtime, such as `react` and `react-dom`.
- `devDependencies` are tools used to develop, type-check, test, or build the application, such as Vite and TypeScript.

### npm Scripts

Scripts are named commands defined in `package.json`:

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Vite development server. |
| `npm run typecheck` | Run TypeScript without emitting JavaScript. |
| `npm run build` | Type-check, then create production assets. |
| `npm run preview` | Serve the built output locally for a production-like check. |

Use `npm run <script>` to run a custom script.

A script is valuable because it gives the team one agreed command for a task. Instead of asking every developer to remember a long TypeScript or bundler command, the team can document `npm run typecheck` and `npm run build`. The command is not magic: npm simply finds the script in `package.json` and executes it. 
### `package-lock.json`

The lockfile records the resolved dependency tree. Commit it to version control in an application so other developers and CI can install the same dependency versions. Use `npm ci` in automated clean installs when a lockfile is committed. Do not delete the lockfile just to make an installation error disappear; understand and resolve the dependency conflict first.

## Configure Vite with `vite.config.ts`
Most projects can begin with the generated Vite configuration. Configuration becomes useful when the application has a real requirement: a backend API runs on another local port, the app is deployed beneath a URL prefix, source files need a consistent import alias, or the build output must match a hosting environment. Treat every configuration option as a decision with a reason. A long configuration file is not proof of a professional setup; a small configuration that directly expresses the project's needs is often easier to maintain.

Vite reads its configuration from the project root. The React plugin enables React-specific transforms and Fast Refresh:

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
```

This example sets a predictable local port, proxies `/api` requests to a local backend, and writes the production build to `dist/`. The proxy is a development-server feature; it does not create a production backend proxy by itself. Configure the production web server separately.

Common Vite options include:

- `server.port`: development server port.
- `server.proxy`: forward selected development requests to another server.
- `base`: public path used when deploying under a subpath.
- `resolve.alias`: define import aliases such as `@` for `src`.
- `build.outDir`: output directory for the production build.
- `build.sourcemap`: generate source maps for debugging a production build.

Do not add configuration just because it exists. Start with defaults and change a setting only when your deployment or project requires it.

## Understand TypeScript Configuration

A `tsconfig` file describes how TypeScript should interpret and check the source code. Modern Vite templates may split configuration into several files because application code runs in the browser while configuration code runs in a Node environment. Those environments have different built-in APIs and module-resolution needs. Rather than combining them into one permissive configuration, the template can give each environment the compiler options it needs.

TypeScript checks types before the browser runs the built JavaScript. A Vite project typically has one or more `tsconfig` files because the browser application and Node-based configuration files run in different environments.

A simplified application configuration looks like this:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": true,
    "noEmit": true,
    "skipLibCheck": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}
```

Keep the configuration generated by the Vite template unless you have a reason to customize it. `strict: true` enables important type-checking rules. `noEmit: true` tells TypeScript to check the project without trying to generate the JavaScript bundle; Vite handles the build transformation.

## TypeScript Essentials for React

TypeScript is JavaScript with a static type system. It helps catch certain errors before the application runs. TypeScript does not validate data received from an API at runtime.

```ts
type User = {
  id: number;
  name: string;
  email?: string;
};

const currentUser: User = {
  id: 1,
  name: 'Maya',
};

function formatGreeting(user: User): string {
  return `Hello, ${user.name}`;
}
```

Here, `User` describes the shape of a user object. The `email` property is optional. The function accepts a `User` and returns a string.


Remember the boundary between compile-time and runtime. TypeScript checks the program according to the types you write, but a JSON response can still contain a missing field or an unexpected value. Later, when we work with APIs, we will validate external data before trusting it.
## JSX and TSX

JSX is syntax that lets us describe UI using HTML-like tags inside JavaScript or TypeScript. A file containing JSX should use `.jsx` or `.tsx`; this course uses `.tsx`.

JSX is not HTML copied directly into a TypeScript file. It is a syntax extension that is transformed by the build tooling into JavaScript calls that describe React elements. It looks familiar because the browser's HTML vocabulary is a natural way to describe interfaces, but it follows JavaScript expression rules and React-specific conventions. Once you understand that JSX is part of the component's return value, the syntax becomes less mysterious: the tags describe the structure, and curly braces let the component insert values or expressions into that structure.

```tsx
const heading = <h1>Welcome to React</h1>;
```

JSX rules to remember:

1. Return one root element. Use a fragment (`<>...</>`) when you do not need an extra DOM element.
2. Use `className` for CSS classes.
3. Use camelCase DOM properties such as `onClick` and `tabIndex`.
4. Use `{}` to insert JavaScript expressions.
5. Close elements correctly, including void elements such as `<img />` and `<input />`.
6. Give mapped elements stable keys; this is covered in Workshop 2.

## Build Your First Component

A component should have a clear name and a clear responsibility. Start with a small `Welcome` component because it has no data or interaction to manage. Then compose it inside `App`. This is the same process used in larger applications: build understandable pieces, then assemble those pieces into a page. As requirements grow, a component can receive props, manage local state, or delegate a repeated pattern to another component.

A React function component starts with a capital letter and returns JSX:

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

### Pass Data with Typed Props

Props are inputs to a component. A child should not directly modify the props it receives.

```tsx
type GreetingProps = {
  name: string;
  city?: string;
};

function Greeting({ name, city = 'your city' }: GreetingProps) {
  return <p>Hello {name} from {city}.</p>;
}

export default function App() {
  return (
    <>
      <Greeting name="Sarah" city="Oran" />
      <Greeting name="Alex" />
    </>
  );
}
```

The default value is provided through JavaScript parameter syntax. This is the modern approach for function components.

It is useful to think of props as the component's public input contract. The parent decides which values to provide, and the child decides how to present them. When a greeting component receives `name="Sarah"`, it does not need to know where that name came from or how the parent stored it. That separation makes the component reusable in different places. Props should be treated as read-only; when a value needs to change, the component that owns the state should handle the update and pass the new value down.

### Add State with `useState`

A normal local variable is recreated when a component renders. State is React-managed data that persists between renders. Updating state asks React to render the component again with the new value.

```tsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState<number>(0);

  return (
    <section>
      <h1>Counter</h1>
      <p aria-live="polite">Current count: {count}</p>
      <button onClick={() => setCount((current) => current + 1)}>
        Increment
      </button>
      <button onClick={() => setCount((current) => current - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>Reset</button>
    </section>
  );
}
```
A state update does not directly rewrite the `count` variable in the currently running component function. Each render sees a snapshot of state. Calling the setter asks React to schedule another render with the next value. That mental model explains why reading `count` immediately after calling `setCount` still gives you the value from the current render. When the next value depends on the previous one, the updater form lets React apply the calculation to the latest queued value.

## Workshop Challenge: Counter Interface

Starting from the Vite example in `Workshop1/Example/my-app`:

1. Create a reusable `Counter` component.
2. Add increment, decrement, and reset buttons.
3. Prevent the count from going below zero.
4. Add a second counter that can have a different starting value.
5. Add a small summary component that receives the count as a prop.
6. Style the interface with semantic HTML and keyboard-visible focus styles.

## Professional Recap

- Vite is a build tool; React is the UI library; TypeScript adds static checking.
- `package.json` declares scripts and packages. `package-lock.json` records the resolved dependency tree.
- `vite.config.ts` configures Vite; `tsconfig` configures TypeScript.
- React uses function components and Hooks in this course.
- Props are inputs; state is data managed by a component.
- State updates describe the next UI. Do not manually mutate the DOM.
- TypeScript cannot guarantee that external JSON matches an interface at runtime.

### Self-Check

Can you create a Vite React TypeScript project without a tutorial? Can you explain what `npm run dev`, `npm run build`, `vite.config.ts`, `main.tsx`, and `package-lock.json` each do? Can you write a component with typed props and state? If not, repeat the matching section before moving on.

## How This Leads to Workshop 2

You now know how a React application starts, how a component describes content, and how props and state provide the information for that description. The next step is to make the interface respond to real user actions. We will take the small component model from this workshop and use it to build a task manager, where multiple components need to communicate and several actions update the same collection of data.
