# Workshop 6: Professional Front-End Engineering

The final workshop moves from learning individual React techniques to delivering a feature that another person can rely on and maintain. Professional front-end development is not a collection of advanced APIs. It is the discipline of making sound decisions across architecture, data, accessibility, tests, performance, security, and delivery. We will revisit ideas from earlier workshops and ask how they behave when the application becomes larger, the requirements change, and more than one developer works on the same codebase.

## Objectives

- Organize a React application so it remains understandable as it grows.
- Understand modern TypeScript patterns used in component APIs and data models.
- Test component behavior with Vitest and React Testing Library.
- Use React performance tools and optimization techniques appropriately.
- Understand portals, lazy loading, and error states.
- Apply practical security, accessibility, and debugging habits.
- Configure environment variables and create a production build with Vite.
- Plan, review, and deliver a complete front-end feature professionally.

##  Organize the Application

An application should be easy to navigate. Developers should be able to locate a feature, understand its responsibilities, and change it without searching through one enormous component.

A small application can start with a simple structure:

```text
src/
├── assets/
├── components/
├── pages/
├── hooks/
├── types/
├── App.tsx
├── main.tsx
└── index.css
```

As the application grows, a feature-based structure often keeps related files together:

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers.tsx
├── components/
│   ├── Button/
│   ├── Card/
│   └── FormField/
├── features/
│   ├── products/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── types.ts
│   │   └── pages/
│   └── customers/
├── hooks/
├── lib/
├── styles/
└── main.tsx
```

There is no single folder structure that fits every project. Organize around understandable responsibilities and actual reuse. Avoid creating empty architecture layers before they are needed.

The first structure is intentionally simple. It is enough while the application has a small number of pages and shared components. As the number of product areas grows, a feature-based structure can keep related UI, types, hooks, and API functions close together. A developer fixing the product editor can find the files for that feature without searching through unrelated customer and reporting code. Shared components remain separate only when they are genuinely used across features.

Architecture should follow the actual shape of the application. Creating an `entities`, `repositories`, `services`, and `managers` folder before the project needs those boundaries can make a beginner project harder to navigate. Start with a clear structure, notice where responsibilities become tangled, and introduce a new layer when it solves a concrete problem. A professional structure is one that the team can explain, not one that has the most folders.

## TypeScript Patterns for Professional Components

In the first workshop, TypeScript helped describe simple values and props. In a larger application, its value becomes more visible because many components and API functions exchange data. Types form contracts between those parts. A good contract explains which values are required, which are optional, and which combinations are valid. It should make the code easier to understand, not simply silence compiler warnings.

TypeScript is most useful when types explain the data and constraints of a feature.

### Type Component Props and Define Defaults

Define the public contract of a component with a `type` or `interface`. Mark a prop optional with `?`, then provide its default value in the function parameter:

```tsx
type AlertProps = {
  title?: string;
  tone?: 'info' | 'success' | 'warning';
};

function Alert({ title = 'Notice', tone = 'info' }: AlertProps) {
  return <aside data-tone={tone}>{title}</aside>;
}
```

For new TypeScript function components, this is the straightforward way to express optional props and defaults. Do not copy older function-component `defaultProps` or add `PropTypes` just to duplicate TypeScript's compile-time prop checking. TypeScript does not validate data arriving at runtime, however: validate API responses, browser storage, and other external input at the boundary.

A component's props are its public API. If a component accepts a `tone` string with no restrictions, callers can accidentally pass values the component does not know how to display. The union type limits the contract to three supported options. Optional properties let a caller omit a value when the component has a sensible default. This makes the component easier to use while keeping its behavior predictable.


### Model UI States with a Union

Avoid several loosely related booleans when only certain combinations are valid. A discriminated union can represent the state more accurately:

```tsx
type LoadState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; message: string };
```

A component can switch on `status` and TypeScript narrows the available fields:

The benefit of the union is that it describes valid states instead of allowing every possible combination of booleans. With `isLoading`, `hasError`, and `isSuccess`, the program can accidentally reach impossible combinations such as all three being true. A discriminated union makes the state mutually exclusive by design. It also guarantees that `data` is available only in the success case and `message` is available only in the error case. This is especially useful for API screens, forms, and multi-step workflows.

```tsx
function ResultMessage({ state }: { state: LoadState<string[]> }) {
  switch (state.status) {
    case 'idle':
      return <p>Enter a search term.</p>;
    case 'loading':
      return <p role="status">Loading...</p>;
    case 'error':
      return <p role="alert">{state.message}</p>;
    case 'success':
      return <p>{state.data.length} results found.</p>;
  }
}
```

### Use Generic Types When They Represent Real Reuse

A generic component or function works with multiple types while preserving information about the type it receives.

```tsx
type SelectOption<TValue extends string | number> = {
  value: TValue;
  label: string;
};

function getSelectedOption<TValue extends string | number>(
  options: SelectOption<TValue>[],
  value: TValue,
): SelectOption<TValue> | undefined {
  return options.find((option) => option.value === value);
}
```

Do not add generics just to make a simple component look sophisticated. Use them when the component or function genuinely supports several data types.

The purpose of the generic parameter is to preserve the relationship between an input and its output. If the option values are numbers, the selected value remains a number; if they are strings, the type remains a string. Without that relationship, a helper might accept a broad `string | number` and return a result that loses information the caller already knows. Generics are powerful when they model a real reusable relationship, but they make code harder to read when applied without a reason.

### Type External Data at the Boundary

An API response, local storage value, URL parameter, and form submission are external input. Treat them as untrusted. TypeScript can check code after data has been validated, but it does not prove that external data is correct.

For example, receive `unknown`, validate its structure, and only then use it as a trusted domain type. A schema library such as Zod can help with larger validation requirements.

This boundary rule applies even when the API is maintained by your own team. Front-end code and back-end code can be deployed at different times, cached responses may be old, and network data can be malformed. Parse and validate once near the boundary, then pass a well-defined model through the application. That creates a clean separation: components focus on presentation and interaction, while API modules handle communication and conversion into trusted application data.

## Testing React Applications

Testing is a way to preserve behavior while the implementation changes. Without tests, a developer may fix one screen and accidentally break a different flow that depends on the same component. A test gives the team a repeatable check of an expectation. The most useful expectation is usually phrased in terms of user behavior: when a person enters a valid email and submits the form, the application should show a success message or move to the next step.

Tests help protect behavior as the application changes. A useful test asks what the user can observe and do rather than checking private implementation details.

### Install Testing Tools

```bash
npm install -D vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

Add scripts to `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "typecheck": "tsc --noEmit",
    "build": "npm run typecheck && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

Configure Vitest in `vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
});
```

Create the setup file:

```ts
// src/test/setup.ts
import '@testing-library/jest-dom/vitest';
```

### Test User-Visible Behavior

```tsx
// src/components/Counter.test.tsx
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import Counter from './Counter';

describe('Counter', () => {
  it('increments when the user presses the increment button', async () => {
    const user = userEvent.setup();
    render(<Counter />);

    await user.click(screen.getByRole('button', { name: /increment/i }));

    expect(screen.getByText(/current count: 1/i)).toBeInTheDocument();
  });
});
```

Prefer queries that reflect how a user finds an element, such as `getByRole`, `getByLabelText`, or `getByText`. Avoid testing the internal state variable name or a component's private implementation.

This approach makes tests more resilient to refactoring. You may rename a state variable, split a component into two files, or replace a reducer with another implementation without changing what the user sees. A test that checks the visible button and resulting message can continue to pass. By contrast, a test that reaches into component internals can fail after an implementation-only change even though the feature still works correctly.

### A Practical Testing Strategy

- **Unit tests:** test pure functions such as formatters, reducers, and validation logic.
- **Component tests:** test interactions, accessibility roles, and visible states.
- **Integration tests:** test several components working together, including routing and data boundaries.
- **End-to-end tests:** test critical user journeys in a real browser with a tool such as Playwright.

Do not chase a coverage percentage while ignoring important user journeys. Test the behavior that would cause real problems if it broke.

The different test levels answer different questions. A unit test can quickly verify a pure reducer. A component test can verify that a button click changes the visible state. An integration test can verify that a route, data-loading component, and form work together. An end-to-end test can verify a critical browser journey from the user's perspective. A balanced test suite uses the cheapest level that gives confidence for the behavior being tested, while protecting the flows that matter most to the product.

## Portals and Dialogs

Sometimes an element belongs to a component in the React tree but needs to appear elsewhere in the DOM. A dialog is a common case: a deeply nested modal can be affected by an ancestor's `overflow` or stacking context. A portal lets React render the dialog into a separate DOM mount point while keeping it logically connected to the component that controls it.

A portal lets React render a component into a different DOM node while keeping it in the same React component tree. Portals are useful for dialogs, popovers, and tooltips that should not be clipped by an ancestor's layout or stacking context.

```tsx
import { createPortal } from 'react-dom';
import type { ReactNode } from 'react';

function Modal({ children }: { children: ReactNode }) {
  const modalRoot = document.getElementById('modal-root');

  if (!modalRoot) {
    throw new Error('Missing #modal-root element');
  }

  return createPortal(
    <div className="modal-backdrop">
      <section
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <h2 id="modal-title">Confirmation</h2>
        {children}
      </section>
    </div>,
    modalRoot,
  );
}
```

Add a second mount point to `index.html`:

```html
<div id="root"></div>
<div id="modal-root"></div>
```

This example demonstrates where the content is rendered. A production dialog also needs correct focus management, focus restoration, keyboard dismissal where appropriate, scroll behavior, and accessible labeling. Prefer a mature accessible dialog primitive when you do not need to build and maintain those behaviors yourself.

A portal changes the DOM placement, not the ownership of the component. The dialog still receives props and state from its React parents, and React event propagation follows the React tree rather than simply following the physical DOM ancestry. Most importantly, a portal is not an accessibility solution by itself. A visually correct overlay can still trap keyboard users, fail to announce its title, or leave focus behind the dialog. Treat the example as a demonstration of placement and use a well-tested dialog primitive when production-grade behavior is required.

## Performance: Measure Before Optimizing

Performance is part of user experience, but it should be approached as an engineering investigation. A page can feel slow because the JavaScript bundle is large, because an image takes too long to download, because the browser performs expensive layout, because an API responds slowly, or because React renders more work than necessary. These problems have different causes and different solutions. Before changing code, reproduce the slowdown and use the browser's tools to identify which part of the system is responsible.

A fast application is not achieved by wrapping every component in a memoization API. First identify the actual performance problem.

### Common Causes of Slow Interfaces

- Rendering more data than the user needs.
- Repeating expensive calculations unnecessarily.
- Fetching the same data repeatedly without an appropriate cache.
- Sending very large JavaScript bundles to the browser.
- Loading unnecessarily large images or fonts.
- Blocking the main thread with expensive synchronous work.
- Creating overly broad state updates that cause many components to render.

Use the browser Performance panel and React Developer Tools Profiler to identify what is slow. Optimize the measured bottleneck.

A render is not automatically a problem. React can render a component and determine that the browser DOM does not need a visible change. The important question is whether the work is expensive enough to affect the user's experience. A small filter over twenty products is unlikely to need memoization. A large table with thousands of rows may need pagination, virtualization, or a different data-loading strategy. Measurements help distinguish the real problem from an assumption based on code appearance.

### `React.memo`, `useMemo`, and `useCallback`

- `memo` can skip rendering a component when its props have not changed according to its comparison.
- `useMemo` can cache the result of a calculation between renders.
- `useCallback` can cache a function reference between renders.

These tools are useful in measured cases, but they add complexity and are not automatically beneficial. A new object or function passed as a prop may defeat memoization. Start with simple components and clear state ownership, then profile.

Here is a compact example that uses all three APIs in a meaningful way:

```tsx
import { memo, useCallback, useMemo, useState } from 'react';

type Product = {
  id: string;
  name: string;
  price: number;
};

const ProductRow = memo(function ProductRow({
  product,
  onSelect,
}: {
  product: Product;
  onSelect: (id: string) => void;
}) {
  return (
    <li>
      <button onClick={() => onSelect(product.id)}>
        {product.name} — ${product.price.toFixed(2)}
      </button>
    </li>
  );
});

function ProductCatalog({ products }: { products: Product[] }) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const visibleProducts = useMemo(
    () => products.filter((product) =>
      product.name.toLowerCase().includes(query.toLowerCase()),
    ),
    [products, query],
  );

  const handleSelect = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  return (
    <section>
      <label>
        Search products
        <input value={query} onChange={(event) => setQuery(event.target.value)} />
      </label>
      <ul>
        {visibleProducts.map((product) => (
          <ProductRow key={product.id} product={product} onSelect={handleSelect} />
        ))}
      </ul>
      <p>Selected product: {selectedId ?? 'None'}</p>
    </section>
  );
}
```

In this example, `useMemo` caches the filtered array, `useCallback` keeps the selection callback stable, and `memo` lets a row skip rendering when its props remain unchanged. This is an illustration of the APIs, not a recommendation to optimize every list. For a small list, the simpler implementation may be better.

React projects may also be configured with React Compiler, which can automate some memoization work. Compiler availability and setup depend on the project architecture. Understand the basic concepts, but follow the current project tooling rather than adding memoization by habit.

When you do optimize, keep the reasoning attached to the change. State which measurement showed the problem, which component or calculation was responsible, and how you verified the improvement. This turns optimization from guesswork into a reviewable engineering decision. Also remember that memoization has a cost: it adds comparisons, retained values, and concepts for the next developer to understand. The best optimization is often the simpler data flow or better component boundary that removes unnecessary work in the first place.

### Higher-Order Components (HOCs): Recognize the Pattern

A higher-order component belongs to the same broad family of composition techniques as wrappers and custom Hooks, but it works at the component level: it accepts a component and returns another component. This was a common way for libraries to share behavior before Hooks became available. When maintaining older projects, you may encounter HOCs that add subscriptions, permissions, analytics, or injected props. Understanding the shape lets you follow the code even when you would choose a different abstraction for a new feature.

A higher-order component is a function that receives a component and returns an enhanced component. HOCs appear in established React libraries and older codebases. Hooks and ordinary component composition are usually simpler choices for new reusable behavior, but professionals should still be able to read and maintain HOCs.

A small typed example that logs when the wrapped component mounts:

```tsx
import { useEffect } from 'react';
import type { ComponentType } from 'react';

function withMountLog<Props extends object>(WrappedComponent: ComponentType<Props>) {
  const componentName = WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component';

  function WithMountLog(props: Props) {
    useEffect(() => {
      console.info(`${componentName} mounted`);
    }, []);

    return <WrappedComponent {...props} />;
  }

  WithMountLog.displayName = `withMountLog(${componentName})`;
  return WithMountLog;
}
```

The returned component preserves the wrapped component's props through the generic `Props` type. In real applications, consider how an HOC handles refs, static properties, display names, and prop collisions. Do not introduce an HOC when a custom Hook or a small wrapper component communicates the behavior more clearly.

A custom Hook is often easier when the shared behavior is stateful logic used by function components. A wrapper component is often clearer when the shared behavior is visible structure such as a permission boundary or layout. An HOC may still be appropriate when working with an established library or architecture that expects one. Choose the abstraction that makes data flow and ownership easiest to follow; do not treat a pattern's age as the only measure of whether it is useful.

### Lazy Loading and Suspense

Route-level code splitting can reduce the JavaScript needed for the first screen. React provides `lazy` and `Suspense` for loading a component when it is first needed:

```tsx
import { lazy, Suspense } from 'react';

const ReportsPage = lazy(() => import('./pages/ReportsPage'));

function AppRoutes() {
  return (
    <Suspense fallback={<p role="status">Loading page...</p>}>
      <ReportsPage />
    </Suspense>
  );
}
```

For a real application, combine this pattern with route-level loading and error handling. Lazy loading does not make a page faster if the user immediately needs every chunk, so measure the effect.

`Suspense` displays the fallback while the lazy component's code is being loaded. It does not by itself explain what should happen if loading the module fails; error handling must be designed as well. Code splitting is most useful when it allows the browser to avoid downloading code the user may not need during the first visit, such as a reports section that is opened infrequently. If every route is needed immediately, splitting may add network requests without improving the experience.

### Other Practical Optimizations

- Use appropriately sized, compressed images and modern image formats.
- Avoid rendering thousands of rows at once; consider pagination or virtualization.
- Keep dependencies intentional and remove unused packages.
- Split code by routes or feature boundaries when useful.
- Avoid duplicating API requests and state.
- Use production builds when measuring bundle and runtime performance.

## Security Basics for Front-End Developers

Front-end developers are part of the application's security model, but the browser must be treated as an environment controlled by the user. A user can inspect downloaded JavaScript, change local state, alter requests, and call an API without using your interface. Therefore, client-side checks are useful for guidance and usability, but protected data and operations must be enforced on the server.

The browser is a public environment. Anything included in the client bundle can be inspected by the user.

### Environment Variables Are Not Secret Storage

Vite exposes variables with the `VITE_` prefix to client-side code:

```env
VITE_API_BASE_URL=https://api.example.com
```

Read a value with:

```ts
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
```

Do not put private API keys, database passwords, signing secrets, or privileged credentials in a `VITE_` variable. Those values are bundled into files delivered to the browser. Keep secrets on a trusted server.

A public API base URL is usually safe to expose because the browser needs to know where to send requests. A privileged key that grants access to private data is not safe because every visitor can inspect the built JavaScript and network requests. If a service requires a secret credential, create a server-side endpoint that holds the secret and performs the protected operation. The `VITE_` prefix means “make this value available to browser code”, not “store this value securely”.

### Avoid Unsafe HTML Injection

Do not render untrusted strings using `dangerouslySetInnerHTML`. A string from an API, user profile, or comment may contain malicious markup. Prefer ordinary text rendering. When rich HTML is a genuine requirement, sanitize it with a trusted solution and apply a clear security policy.

### Authentication Is Not Just Hiding a Button

Hiding an admin button in React does not protect an admin API. The backend must enforce authentication and authorization for every protected operation. The front end can improve the experience, but it is not a security boundary.

For instance, hiding an “Delete user” button from someone without an admin role is a helpful interface decision, but it does not prevent that person from sending a delete request manually. The backend must check the user's identity and permission on every protected operation. The frontend can show or hide options based on the permissions it has been told about, but the server must make the final security decision.

## Environment Variables and Vite Modes

Vite loads `.env` files based on its mode. Common files include:

```text
.env                 # shared defaults
.env.local           # local-only values; keep out of Git
.env.development     # development mode values
.env.production      # production mode values
.env.example         # safe template showing required variable names
```

Example `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

A corresponding `.env.local` may contain the local value for your machine. Add local environment files to `.gitignore`.

Vite exposes built-in values through `import.meta.env`, including `MODE`, `DEV`, `PROD`, and `BASE_URL`. Custom variables exposed to browser code must use the configured environment prefix, which defaults to `VITE_`.

Environment files are read when Vite starts. Restart the development server after editing them.

Keep `.env.example` in version control so other developers know which configuration names are required, but leave real local values in ignored files or in the deployment platform's secret/configuration settings. This separates the shape of the configuration from the machine-specific values. Validate required environment values at startup where practical, so a missing API URL produces a clear setup error instead of a confusing failed request later.

## Production Build and Deployment

Create a production bundle:

```bash
npm run typecheck
npm run test:run
npm run build
```

Vite writes the production assets to `dist/` by default. Preview the result locally:

```bash
npm run preview
```

The preview command is for local verification. It is not a production server. Deploy the contents of `dist/` to a static hosting provider or serve them through your web server.

A production build is the version users receive, so it deserves its own verification. Confirm that assets load from the correct base path, environment-specific values are correct, routes work after a direct refresh, and the browser console does not show runtime errors. A page that works only on the developer's machine is not ready to ship. The deployment platform must also be configured for the chosen architecture, including API routing and client-side route fallback where necessary.

### Deploying Under a Subpath

If the application is hosted under a path such as `https://example.com/portal/`, configure Vite's `base` option to match that public path:

```ts
export default defineConfig({
  plugins: [react()],
  base: '/portal/',
});
```

Use the correct setting for the actual deployment path. A wrong base path can break generated asset URLs.

### Client-Side Route Fallback

For a client-side SPA, the web server should serve the app's `index.html` for application routes such as `/dashboard` or `/products/42`. Static assets should still be served as files. This fallback is configured on the hosting platform or web server; Vite's development server proxy does not configure production routing.

## Debugging with Developer Tools

Use the correct tool for the problem:

| Tool | Good for |
|---|---|
| Browser Console | Runtime errors, warnings, and application logs. |
| Elements panel | Inspecting the actual DOM and applied CSS. |
| Network panel | Request URLs, methods, response statuses, payloads, and timing. |
| Performance panel | Main-thread activity, layout, paint, and runtime bottlenecks. |
| Application/Storage panel | Local storage, session storage, cookies, and cache inspection. |
| React Developer Tools | Component tree, props, state, and render profiling. |
| TypeScript diagnostics | Type errors and invalid assumptions before runtime. |

Read the first meaningful error in the console. Many later errors are consequences of the first failure.

Debugging is most effective when you narrow the problem systematically. First reproduce the issue and record the action that causes it. Then check the console for the earliest error, inspect the relevant request in the Network panel, and use React Developer Tools to see which component owns the unexpected value. If the issue is visual, inspect computed CSS and layout in the Elements panel. Avoid making several unrelated changes at once; a focused change makes it easier to know whether your hypothesis was correct.

## Professional Development Workflow

A professional workflow connects implementation to a requirement that can be checked. Before coding, agree on what the user should be able to do and what counts as a successful result. During implementation, make changes small enough to understand and verify. Before delivery, review the feature from the user's perspective as well as the code's perspective. This process reduces avoidable rework and makes it easier for another developer to review the change.

Use a repeatable engineering process:

1. **Clarify the requirement:** identify the user, goal, expected behavior, and acceptance criteria.
2. **Inspect the existing system:** understand the current architecture, design language, API, and constraints.
3. **Plan the solution:** choose components, state ownership, routes, data boundaries, and failure states.
4. **Implement in small steps:** make a focused change and verify it before adding more complexity.
5. **Test:** cover important logic and user-visible behavior.
6. **Review:** check accessibility, responsive behavior, types, errors, naming, and unnecessary abstractions.
7. **Build:** run type checking, tests, linting where configured, and a production build.
8. **Document:** update setup instructions, environment variables, and any relevant usage notes.
9. **Deliver:** create a meaningful Git commit or pull request that explains the change.

### Code Review Questions

A code review is not only a search for syntax errors. It is a conversation about whether the solution is understandable, correct, and safe to extend. A reviewer should be able to trace where the data comes from, which component owns each state value, how errors are handled, and what tests protect the behavior. The questions below are useful before opening a pull request and when reviewing another developer's work.

- Is the implementation correct for the acceptance criteria?
- Does each component have a clear responsibility?
- Is state stored in the right place?
- Are effects necessary and correctly cleaned up?
- Are API errors and empty states handled?
- Is the user interface accessible and responsive?
- Are types accurate and runtime input validated?
- Are secrets or personal data exposed?
- Is the solution simpler than the alternative?

## Capstone Project: Build a Complete Front-End Application

Choose a realistic domain such as store management, course management, booking, inventory, or a personal finance dashboard. The capstone should combine the whole course.

A store-management application is a useful capstone because it naturally combines several kinds of front-end work. A staff member may need to browse products, review low-stock items, inspect a product detail page, edit a form, and see a summary dashboard. Those workflows create meaningful reasons for routes, forms, API requests, loading and error states, shared layout components, and a design system. You may choose a different domain, but make sure it has more than one screen and at least one complete user journey from start to finish.

### Minimum Requirements

1. **Project setup:** Vite, React, TypeScript, npm scripts, strict TypeScript, and a documented configuration.
2. **Design:** a short design philosophy, a design language, CSS tokens, reusable UI components, and at least two page templates.
3. **Structure:** feature-oriented organization with clear component responsibilities.
4. **Navigation:** at least three routes, a shared layout, and a not-found page.
5. **Interaction:** forms with validation, lists, filters, conditional rendering, and clear feedback.
6. **State:** appropriate local state and at least one deliberate shared-state solution.
7. **Data:** connect to an API or a documented mock service and handle loading, error, empty, and success states.
8. **Accessibility:** semantic HTML, keyboard interaction, labels, focus styles, and responsive layout.
9. **Quality:** automated tests for critical behavior and a clean TypeScript check.
10. **Delivery:** production build, deployment, README, and a short explanation of architecture decisions.

### Suggested Milestones

The milestones are ordered to reduce rework. Defining user stories and wireframes first helps prevent building screens that do not solve a clear task. Establishing tokens and the page shell before implementing every feature gives later pages a consistent foundation. Routes and page skeletons make the application's shape visible early, while forms and data integration add the behavior. Testing and accessibility checks should happen throughout development, but the dedicated review milestone gives you time to examine the whole product rather than only the latest component.

- Milestone 1: user stories, acceptance criteria, and wireframes.
- Milestone 2: design tokens, page shell, and component library.
- Milestone 3: routes and page skeletons.
- Milestone 4: core forms, lists, and state transitions.
- Milestone 5: API integration, loading/error handling, and persistence.
- Milestone 6: testing, accessibility, responsiveness, and performance review.
- Milestone 7: production build, deployment, and documentation.

## Professional Recap

- Good architecture reduces coupling and makes features easy to locate.
- TypeScript should model valid data and UI states; it should not be used as decoration.
- Tests should protect observable behavior and important user journeys.
- Portals change where content is rendered in the DOM; they do not automatically provide accessible dialog behavior.
- Measure before applying memoization or code splitting.
- Vite client environment variables are public; secrets belong on the server.
- Avoid injecting untrusted HTML and remember that the backend must enforce authorization.
- Build and preview the production bundle before deployment.
- A professional front-end feature includes design, accessibility, error handling, testing, documentation, and maintainability—not only JSX and CSS.

### Final Self-Assessment

You are ready to apply these skills when you can start a project, explain its configuration, model its data, implement its screens, handle its failure states, test its critical flows, and deploy it without following a step-by-step tutorial. A professional developer is not someone who memorizes every API; it is someone who can find reliable documentation, make sound decisions, and deliver maintainable software.

The capstone is complete when another person can understand the purpose of the application, install it from the README, run the checks, navigate the main user journeys, and see how the design and architecture decisions support the product. It does not need to contain every library or advanced pattern in the React ecosystem. It needs to solve a clearly defined problem with an implementation that is understandable, inclusive, testable, and safe to extend. That is the standard this course is designed to help you reach.
