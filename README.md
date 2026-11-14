# Modern React & Front-End Development Course

A practical, workshop-based course for learning **React with TypeScript and Vite** from the beginning, then applying those skills using professional front-end development practices.

The course uses modern function components, Hooks, TypeScript (`.ts` / `.tsx`), Vite, and current ecosystem conventions. It does **not** use Create React App, class components, `ReactDOM.render`, legacy lifecycle methods, or the old Redux `createStore` pattern.

## The Learning Story

You will follow a practical product-building journey rather than study React APIs as disconnected vocabulary. Imagine that a small business needs a browser-based workspace: staff must review products, monitor stock, manage tasks, look up records, and understand what needs attention. We will use this kind of application as a recurring mental model. The examples remain small enough to study, but the questions are the same ones that appear in real front-end work: where should data live, how should a page respond, what happens when a request fails, and how can several screens feel like one product?

Each workshop adds one layer to that application. First, you learn how a React application starts and how a component describes a screen. Next, you make that screen interactive and divide responsibilities across components. Then you connect it to external data and browser capabilities. Once there is more than one screen, you introduce routing and shared state. Only after you understand the behavior of the application do you build its design language and reusable page structures. The final workshop brings these decisions together as professional engineering work: testing, accessibility, architecture, performance, security, and deployment.

This order is intentional. It is easier to understand a design system after you know what a component is, and it is easier to choose a global state tool after you have experienced ordinary component state and Context. The course therefore moves from the smallest understandable unit toward the complete application.

## Who This Course Is For

- Beginners who already know basic HTML, CSS, and JavaScript and want to learn React properly.
- Developers who know React but want a structured recap of modern patterns and professional workflows.
- Front-end developers who want to strengthen their skills in design systems, accessibility, responsive interfaces, testing, performance, and production builds.

This course teaches React from the ground up. It is not a replacement for learning the browser platform, HTML, CSS, and JavaScript. Use the [Front-End Readiness Guide](Front-End-Readiness.md) to identify and review any gaps.

## Learning Outcomes

By the end of the course, learners should be able to:

1. Create, configure, run, type-check, build, and preview a React + TypeScript application with Vite.
2. Understand `package.json`, npm scripts, dependencies, lockfiles, Vite configuration, environment variables, and TypeScript configuration.
3. Build reusable, accessible React components and understand props, state, events, lists, conditional rendering, forms, and component composition.
4. Model application state with `useState`, `useReducer`, Context, and—when appropriate—Redux Toolkit.
5. Work with APIs, asynchronous requests, routing, URL parameters, refs, and custom Hooks.
6. Translate a design brief into a visual language, reusable design tokens, page templates, and a consistent component library.
7. Build responsive interfaces with semantic HTML, maintainable CSS, and accessibility in mind.
8. Test, debug, optimize, and deploy a front-end application using a professional workflow.

## Course Roadmap

| Workshop | Main theme | What you will build or practice |
|---|---|---|
| 1 | React foundations and modern tooling | Create a Vite + React + TypeScript project; understand its files, configuration, JSX, components, props, and first stateful component. |
| 2 | Components, state, and interaction | Compose reusable components; render lists and conditions; build accessible forms; implement a task manager with `useReducer`. |
| 3 | Effects, APIs, and browser features | Handle asynchronous data, loading and error states, effect cleanup, refs, browser storage, and reusable custom Hooks. |
| 4 | Routing and application state | Build multi-page client-side navigation, nested layouts, route parameters, Context, and an introduction to Redux Toolkit. |
| 5 | Design philosophy and design systems | Move from user needs to a design language, design tokens, reusable components, responsive layouts, and page templates. |
| 6 | Professional front-end engineering | Test components, improve accessibility and performance, organize projects, handle security concerns, and prepare production builds. |

## Recommended Learning Sequence

Follow the workshops in order. Each workshop includes objectives, explanations, examples, practice tasks, a workshop challenge, and a professional recap. The examples are deliberately small at first; complexity grows as concepts are introduced.

### How to Study Each Workshop

Treat every workshop as a short learning cycle. Begin by reading the explanation without trying to memorize the terminology. Ask what problem the concept solves and what would become difficult without it. Then trace the example from its input to its visible result: identify the data, the component that owns it, the event that changes it, and the next render that reflects that change. After that, type the example yourself instead of copying it blindly. Small typing mistakes are useful because they teach you how to read compiler and browser feedback.

When an example works, change one requirement. Add another prop, introduce an empty state, change the initial value, or make the layout responsive. This is where understanding becomes practical skill: you are no longer repeating the author's exact steps; you are using the same idea to solve a slightly different problem. Finish with the workshop challenge and explain your decisions in your own words. A learner who can explain why state belongs in a parent, why a request needs cleanup, or why a page template exists is progressing more reliably than someone who can only reproduce the code.

The professional recap is not a substitute for the lesson. It is a compact review after you have worked through the full explanation. Beginners should read it at the end; experienced developers can use it as a diagnostic checklist and return to the detailed sections where their reasoning is incomplete.

- **Beginner route:** Complete every explanation and exercise, type the examples yourself, and finish each workshop challenge.
- **Professional recap route:** Read the objective and recap sections first, attempt the challenge without looking at the solution, then revisit only the concepts you cannot explain or implement confidently.
- **Capstone:** Combine the workshops into a responsive dashboard or product application with routing, forms, API data, a consistent design system, tests, and a production build.

## Prerequisites

- Basic HTML: semantic elements, forms, links, images, and document structure.
- Basic CSS: selectors, box model, Flexbox, Grid, media queries, and responsive units.
- Basic JavaScript: variables, functions, arrays, objects, modules, promises, `async` / `await`, and array methods such as `map`, `filter`, and `find`.
- A computer with a terminal and a code editor such as VS Code.
- Node.js and npm. Use a supported Node.js release that satisfies the current Vite requirement. The current Vite guide lists Node.js `20.19+` or `22.12+`; newer supported LTS releases are also suitable.

If any of these topics are unfamiliar, start with [Front-End Readiness Guide](Front-End-Readiness.md) before Workshop 1.

## Tooling Used in This Course

| Tool | Purpose |
|---|---|
| React | Build the user interface using components. |
| TypeScript | Add static type checking to JavaScript and JSX. |
| Vite | Run the development server and create production assets. |
| npm | Install dependencies and run project scripts. |
| React Router | Add client-side navigation and route-based layouts. |
| React Developer Tools | Inspect component trees, props, state, and renders. |
| Vitest and React Testing Library | Test behavior from the user's point of view. |

The main examples use ordinary CSS and CSS custom properties so learners understand the browser styling layer before choosing a utility framework or component library.

The tooling is deliberately introduced by responsibility. React describes and coordinates the interface; TypeScript checks the shapes of values and component contracts; Vite serves the application during development and produces the deployable assets; npm manages packages and project scripts. Keeping these roles separate makes configuration easier to reason about. When a build fails, you can ask whether the issue belongs to the application code, TypeScript, Vite, or dependency installation instead of treating the entire toolchain as one mysterious system.

## Getting Started

Create a new project with the official Vite React + TypeScript template:

```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
npm run dev
```

Open the local address printed by Vite in your terminal. The development server normally uses `http://localhost:5173`.

To build and preview a production version:

```bash
npm run build
npm run preview
```

See [Workshop 1](Workshop1/Workshop1.md) for a full explanation of the generated files, Vite configuration, `package.json`, and TypeScript configuration. See [Modern React Patterns](Legacy-Patterns.md) when reviewing older tutorials or maintaining a legacy project.

Do not rush past the first successful run. Open the project in your editor, change the heading in `App.tsx`, save the file, and observe how the browser updates. Then stop the server and run the build command. The development server and the production build are two different parts of the workflow: one is designed for fast feedback while you work, and the other creates optimized assets that can be deployed. Workshop 1 explains how the project files connect and why both steps matter.

## Examples

Each included example is a separate Vite + TypeScript project. Open the relevant folder before running npm commands:

```bash
cd Workshop1/Example/my-app
npm install
npm run dev
```

The included examples are: the Workshop 1 counter, the Workshop 2 task manager, the Workshop 4 routed show browser, and the Workshop 5 design-system dashboard. The examples intentionally omit generated `node_modules` and lockfiles. Run `npm install` to create a local `package-lock.json`; commit that lockfile in a real application so the team and CI use the same dependency resolution.

## Professional Practice

Do not measure progress only by whether the page renders. For every feature, ask:

- Does it solve the user's actual problem?
- Is the HTML semantic and the interface keyboard-accessible?
- Does the layout work at small, medium, and large screen widths?
- Are state ownership and component responsibilities clear?
- Are loading, empty, error, and success states handled?
- Are types meaningful, not just added to silence errors?
- Can the feature be tested and maintained by another developer?
- Does the production build work, and are secrets kept out of client code?

Use the [Professional Front-End Checklist](Professional-Checklist.md) while completing the capstone. Use the [Front-End Readiness Guide](Front-End-Readiness.md) to review platform fundamentals and [Modern React Patterns](Legacy-Patterns.md) to compare current and older conventions.

## Official Documentation

- [React documentation](https://react.dev/learn)
- [React with TypeScript](https://react.dev/learn/typescript)
- [Vite guide](https://vite.dev/guide/)
- [Vite configuration reference](https://vite.dev/config/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React Router documentation](https://reactrouter.com/)
- [Vitest documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [MDN Web Docs](https://developer.mozilla.org/)

## Version Policy

The commands in this course use the current documented Vite workflow. Package versions change frequently, so create fresh projects from the official template rather than copying old lockfiles from tutorials. The example `package.json` files provide a modern baseline; check the official package documentation when upgrading major versions.

## Contributing

Contributions are welcome. Prefer modern function components, TypeScript examples, accessible markup, and official documentation links. Do not add Create React App or legacy React examples as the default teaching path. If a legacy pattern is discussed for migration or recap, clearly label it as legacy.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE).

---

Happy coding. Build interfaces that are useful, understandable, inclusive, and maintainable.
