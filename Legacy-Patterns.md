# Modern React: Patterns to Use and Patterns to Recognize

This guide is for learners who arrive with older React tutorials or need a professional refresher. It is not a migration manual for every existing codebase; it explains which patterns this course teaches by default.

The React ecosystem has evolved, so an older tutorial may teach a valid idea through an API or tool that is no longer the preferred starting point for a new application. The goal of this guide is not to claim that every older codebase is wrong or must be rewritten. The goal is to separate the underlying concept from the historical implementation. A class component, for example, may still need to be maintained in an existing product; a new beginner course can still teach function components and Hooks as its default approach.

| Older pattern found in tutorials | Modern course approach | Reason |
|---|---|---|
| Create React App (`react-scripts`) | Vite React + TypeScript template | Create React App is deprecated; Vite is used here for the client-side learning setup. |
| `index.js` with `ReactDOM.render` | `main.tsx` with `createRoot` from `react-dom/client` | `createRoot` is the modern client entry API. |
| JavaScript `.js` / `.jsx` examples | TypeScript `.ts` / `.tsx` examples | The course uses type checking from the beginning. |
| Class components and lifecycle methods | Function components and Hooks | Function components are the normal teaching path for new React code. |
| `componentDidMount` / `componentDidUpdate` / `componentWillUnmount` as the default mental model | Effects for synchronizing with external systems, with cleanup | Effects are not a mechanical one-to-one replacement for lifecycle methods. First ask whether an Effect is needed. |
| Function component `defaultProps` | Default values in destructured function parameters | More direct and readable for function components. |
| `prop-types` as the primary prop validation approach | TypeScript types for compile-time component contracts | TypeScript provides editor and build-time checks. Runtime data still needs validation. |
| Plain Redux `createStore` and hand-written boilerplate | Redux Toolkit (`configureStore`, `createSlice`) | Redux Toolkit is the recommended modern Redux approach. |
| Old router imports and APIs copied without checking version | Current `react-router` package and current documentation | Router packages and APIs have changed across major versions. |
| Manual DOM updates for normal UI changes | Declarative rendering from props and state | React should own the rendering of its managed UI. |
| `useEffect` for every derived value or event response | Calculate derived values during render and handle user actions in event handlers | Avoid unnecessary Effects and duplicated state. |
| Memoize every function or component | Profile first; use memoization when it addresses a measured problem | Premature memoization adds complexity and may not improve performance. |
| Inject API/user content with `dangerouslySetInnerHTML` | Render untrusted content as text or sanitize with a trusted solution when HTML is required | Avoid introducing cross-site scripting vulnerabilities. |

## How to Read Legacy Material

When you compare an older example with a current project, first identify the version of React and its related tools. Then ask what problem the code is solving. A lifecycle method may be coordinating a subscription; an Effect in a function component may solve that synchronization problem, but the translation is not always mechanical. A Redux example may be showing shared state, but modern Redux Toolkit changes the amount of setup and the recommended structure. Understanding the problem prevents you from copying an API without understanding its role.

Older tutorials can still explain useful ideas. When you encounter one:

1. Identify the React, router, and tooling versions it targets.
2. Separate the underlying concept from the specific API used.
3. Check the official documentation for the current API.
4. Rewrite the example using TypeScript and current project conventions.
5. Preserve legacy code only when maintaining or migrating an existing application requires it.

A professional developer should recognize older patterns without accidentally making them the default for a new application.

When maintaining an existing application, follow the conventions of that codebase unless there is a clear reason to change them. A gradual migration should preserve behavior, include tests, and avoid mixing unrelated refactors with feature work. When starting a new project, use current documentation and the modern patterns taught in this course. Professional judgment means knowing both how to read existing systems and how to choose an appropriate foundation for new work.
