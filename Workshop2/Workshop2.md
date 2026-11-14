# Workshop 2: Components, State, and User Interaction

In Workshop 1, the interface was mostly a description of fixed content with one small counter. Real applications become more interesting when users can change data. A user may add a task, complete it, filter the list, or delete an item. Those actions introduce a new question: which component should know about the data, and how should the change travel through the component tree? This workshop builds a small task manager so you can learn component composition, events, forms, lists, and state transitions as parts of one feature.

## Objectives

- Design components with clear responsibilities and typed props.
- Compose components using `children` and reusable layout components.
- Render lists with stable keys and display conditional UI.
- Handle user events and build accessible forms.
- Understand when to use `useState` and when a reducer is clearer.
- Build a small task manager using TypeScript and React.

## Component Composition

A component should represent one understandable piece of the interface. It may be a small control, a card, a form, a navigation area, or a full page. Avoid both extremes: one component that contains the entire application, and dozens of tiny components that have no meaningful responsibility.

A typical hierarchy might look like this:

Imagine that the task page needs to show a form and a list. The form must know how to collect the title of a new task, while the list must know how to display existing tasks. Neither component needs to own the entire page. The page can coordinate them: it stores the task collection, passes the current tasks to the list, and passes a function to the form that explains how a new task should be added. This division keeps each child focused while leaving shared decisions in the parent that has the full context.

```text
App
└── TaskPage
    ├── PageHeader
    ├── TaskForm
    ├── TaskFilters
    └── TaskList
        └── TaskItem (one per task)
```

The parent assembles the screen and owns the state that multiple children need. Children receive data and callback props.
### Passing `children`

React provides a special prop called `children`. It contains whatever JSX is placed between a component's opening and closing tags. This is useful for cards, dialogs, page shells, and other components that provide a reusable container.

```tsx
import type { ReactNode } from 'react';

type PanelProps = {
  title: string;
  children: ReactNode;
};

function Panel({ title, children }: PanelProps) {
  return (
    <section className="panel">
      <h2>{title}</h2>
      <div className="panel__content">{children}</div>
    </section>
  );
}

function App() {
  return (
    <Panel title="Account summary">
      <p>Your account is active.</p>
      <button type="button">View account</button>
    </Panel>
  );
}
```

`ReactNode` is a useful type for content that React can render. Import it with `import type` because it is needed only for TypeScript checking, not as a runtime value.

This pattern is called composition. Instead of making `Panel` understand every possible kind of content, we let the parent place the desired content between its tags. The panel owns the frame its border, title, padding, and semantic section while the calling component decides what belongs inside. Composition is often more flexible than adding a long list of props such as `showButton`, `showImage`, `showWarning`, and `showFooter` to one generic component.

## Events and State Updates

An event is the moment when the user interacts with the interface. The click is not itself the business rule: clicking a button might add a task, mark a product inactive, or open a dialog. React lets us connect an event to a named handler so the UI markup stays readable and the behavior can be understood separately. Naming handlers according to the action they perform `handleSave`, `handleDelete`, or `handleFilterChange` makes the intent easier to follow than placing complicated expressions directly inside JSX.

React event props use camelCase names such as `onClick`, `onChange`, and `onSubmit`. Pass a function, not the result of calling a function during render.

```tsx
function SaveButton() {
  function handleSave() {
    console.log('Saved');
  }

  return <button onClick={handleSave}>Save</button>;
}
```
When the next value depends on the previous state, use an updater function:

```tsx
setCount((currentCount) => currentCount + 1);
```
Do not mutate objects or arrays stored in state. Create a new object or array:

Immutability is important because React state is not an ordinary mutable scratch variable. React uses the identity of values to reason about updates, and other parts of the application may rely on the previous state remaining unchanged. If you change an existing array with `push`, you alter the same object that the previous render referenced. Creating a new array with spread, `map`, or `filter` makes the transition explicit: the old value remains intact, and the next render receives a new value. This also makes reducers and tests easier to reason about because the input state is not secretly modified.

```tsx
// Avoid mutating the existing array
// tasks.push(newTask);

setTasks((currentTasks) => [...currentTasks, newTask]);
```

## Rendering Lists

A list in React is usually the result of transforming data into elements. The array remains the data model; `map` produces a corresponding array of JSX elements. This separation is useful because you can sort, filter, or transform the data before deciding how each item should look. In a real task manager, the task objects may contain IDs, titles, descriptions, status, and creation dates, while the JSX decides which of those fields should be visible in a row.

Real applications display arrays of data: products, users, messages, lessons, tasks, or notifications. Use JavaScript to transform the data into JSX.

```tsx
type Student = {
  id: number;
  name: string;
};

const students: Student[] = [
  { id: 1, name: 'Maya' },
  { id: 2, name: 'Omar' },
  { id: 3, name: 'Lina' },
];

function StudentList() {
  return (
    <ul>
      {students.map((student) => (
        <li key={student.id}>{student.name}</li>
      ))}
    </ul>
  );
}
```

### Why Does React Need `key`?

A key gives React a stable identity for each item in a rendered list. When an item is inserted, removed, or reordered, keys help React match the rendered elements to the underlying data.

Use a stable identifier from the data, such as `task.id`. Avoid using the array index when the list can change order or have items inserted or deleted. Do not use `useId` for list keys; it is intended for generating IDs that connect accessible elements such as labels and form controls.

The reason becomes clear when the user changes a list. Suppose the first row is deleted. If keys are array positions, the item that used to be second now occupies the first position, and React may associate the existing rendered row with a different task. This can lead to confusing behavior, especially when rows contain input fields or local component state. A stable data ID tells React that a particular row represents the same task even when its position changes. A key is therefore an identity for reconciliation, not merely a warning-suppressing attribute.

## Conditional Rendering

Conditional rendering is how a component describes the different states of a feature. It is tempting to think only about the normal state where data exists, but users also encounter a list before the first item is created, a search with no matching results, a request that is still loading, or an operation that failed. These are different situations and deserve different messages. A good interface helps users understand whether they should wait, change their search, retry, or create the first item.

A component often displays different content depending on application state. Common options include:

**Ternary operator:** Use when there are two alternate results.

```tsx
return isSignedIn
  ? <p>Welcome back.</p>
  : <button onClick={openLogin}>Sign in</button>;
```

**Logical AND (`&&`):** Use when content should appear only when a condition is true.

```tsx
{unreadCount > 0 && <p>You have {unreadCount} unread messages.</p>}
```

Be careful with numeric conditions. `{count && <p>...</p>}` can render `0` when count is zero. Prefer `{count > 0 && ...}`.

**Early return:** Useful for loading, error, and empty states.

```tsx
if (isLoading) return <p role="status">Loading tasks...</p>;
if (error) return <p role="alert">{error}</p>;
if (tasks.length === 0) return <p>No tasks yet.</p>;

return <TaskList tasks={tasks} />;
```

A professional interface deliberately handles loading, empty, error, success, and disabled states. Do not design only the happy path.

Be precise about what is empty. “No tasks have been created yet” is different from “No tasks match this filter.” The first suggests that the user should create a task; the second suggests that the filter should be adjusted. This small wording difference comes from understanding the state that produced the screen.

## Forms and User Input

Forms are one of the most important boundaries between the user and the application's data. They collect values, but they also communicate what information is expected, explain invalid input, and provide a clear way to submit or cancel an operation. A form is not complete just because it has an input and a button. It should have labels, appropriate input types, validation, a submission path, and feedback about what happened.

Forms allow users to create, update, and submit data. In a controlled React input, React state is the source of truth for the input's value.

```tsx
import { useState } from 'react';

function SearchForm() {
  const [query, setQuery] = useState('');

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <label htmlFor="search">Search</label>
      <input
        id="search"
        name="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

The input's `value` comes from state. The `onChange` handler updates that state as the user types. TypeScript can usually infer the event type from the JSX attribute. For a separately declared handler, type it explicitly:

This is called a controlled input because React state controls the value shown by the field. When the user types, the browser emits an input event, the handler reads the new value, and the state setter schedules a render with that value. The input then receives the updated `value` prop. This creates one clear source of truth and makes it possible to validate, format, or submit the value using ordinary component logic. It is also why a controlled field should not be given a changing `value` without an `onChange` handler: the user would be unable to change the value that React keeps supplying.

```tsx
import type { ChangeEvent, FormEvent } from 'react';

function ExampleForm() {
  const [email, setEmail] = useState('');

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    setEmail(event.currentTarget.value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    console.log({ email });
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="email">Email address</label>
      <input id="email" type="email" value={email} onChange={handleEmailChange} required />
      <button type="submit">Continue</button>
    </form>
  );
}
```

### Form Validation
Validation has two responsibilities. First, it should help the user correct mistakes by explaining what is wrong and where. Second, the server must independently enforce the rules before accepting the submitted data. A browser can be bypassed or modified, so client validation improves the experience but cannot protect the database or business rules. For example, a store interface may prevent a negative quantity in the form, but the backend must still reject an invalid stock adjustment.

To validate your forms you can start with the browser's built-in validation when it meets the requirement: `required`, `minLength`, `maxLength`, `type="email"`, `min`, and `max`. Add clear error messages and associate them with the relevant input. 

For complex forms, libraries can reduce repetitive work:

- **React Hook Form** provides a form state and registration model.
- **Zod** can describe and validate data schemas at runtime and infer TypeScript types.

Do not add a form library to a one-field exercise. Learn controlled inputs first, then choose a library when the form complexity justifies it.

## Choosing Between `useState` and `useReducer`

As a feature grows, the state update logic can become as important as the state value itself. A counter with one number is easy to manage with `useState`. A task manager has a list and several related operations: add, toggle, delete, perhaps edit or clear completed items. A reducer makes those operations visible as named transitions. It gives the team one place to inspect what each action is allowed to do.

`useState` is a good default for independent values and straightforward updates. `useReducer` can make complex state transitions easier to understand when several actions update the same state structure.

A reducer receives the current state and an action, then returns the next state. It must be pure: it should not make network requests, modify the DOM, or mutate the current state.

```tsx
import { useReducer } from 'react';

type CounterState = {
  count: number;
};

type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };

function counterReducer(state: CounterState, action: CounterAction): CounterState {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
  }
}

function ReducerCounter() {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      <p>Count: {state.count}</p>
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  );
}
```

`dispatch` sends an action to the reducer. The action type is a discriminated union, so TypeScript checks that each action has the correct shape.

It is helpful to read a reducer as a small state-transition table. The current state is the input; the action explains what happened; the returned state is the result. An action such as `{ type: 'task/deleted', payload: taskId }` describes an intention rather than giving the reducer a set of arbitrary instructions. The reducer remains pure because it only calculates the next state. Network requests, alerts, and DOM operations belong elsewhere. This predictability makes reducers straightforward to test without rendering a component.

Do not choose `useReducer` simply because it looks more advanced. The decision is about the shape of the update logic. Use `useState` when a value has a few straightforward updates. Consider a reducer when related actions update the same state structure and a single transition function makes the behavior easier to understand.

## Build a Task Manager
The task manager brings the earlier ideas together. The form is responsible for collecting a new task; the page or feature component owns the task collection; the reducer defines allowed changes; and the list turns the current collection into rows. The user never needs to know that a reducer exists. They see a familiar interaction: enter a task, submit it, see it appear, and change its status. Our job as developers is to choose a structure that keeps that interaction correct as more requirements are added.

The example in `Workshop2/Example/todo-list` is a small task manager. It uses a reducer because actions such as adding, toggling, and deleting tasks all update the same list.

Each task has a stable identifier:

```tsx
type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

type TaskAction =
  | { type: 'task/added'; payload: Task }
  | { type: 'task/toggled'; payload: string }
  | { type: 'task/deleted'; payload: string };
```

A reducer might handle those actions as follows:

```tsx
function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'task/added':
      return [...state, action.payload];
    case 'task/toggled':
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task,
      );
    case 'task/deleted':
      return state.filter((task) => task.id !== action.payload);
  }
}
```

Notice that `map` and `filter` return new arrays. The reducer never changes the original list or task objects.

Follow one action from beginning to end. A user submits the form. The form validates the title and calls the callback it received from its parent. The parent creates an ID and dispatches a `task/added` action. The reducer returns a new task array containing the new task. React renders the page again with that new array, and the list now includes an additional row. Seeing this entire chain is more valuable than memorizing the syntax of `dispatch`: it shows how event handling, component communication, state ownership, and rendering fit together.

## Workshop Challenge: Extend the Task Manager

Starting from `Workshop2/Example/todo-list`:

1. Add a priority field with the union type `'low' | 'medium' | 'high'`.
2. Add filters for all, active, and completed tasks.
3. Show a useful empty state when the filter has no matching tasks.
4. Add form validation for the task title.
5. Make the complete task row usable with a keyboard; keep the delete action as a real button.
6. Display a summary such as “3 tasks remaining”.
7. Add a stable ID to every task and use it as the list key.

## Professional Recap

- Components communicate through props and callback functions.
- `children` is typed as `ReactNode` when a component accepts arbitrary renderable content.
- Use stable data IDs as keys; array indexes are not reliable identities for changing lists.
- Keep state immutable. Use functional state updates when the next value depends on the previous one.
- Use `useState` for simple state and `useReducer` for more involved state transitions.
- Controlled inputs synchronize their displayed value with React state.
- Browser validation improves usability, but the server must validate submitted data too.
- Design loading, error, empty, success, and disabled states—not only the successful result.

### Self-Check

Can you explain why a list needs stable keys? Can you pass a callback from a parent to a child? Can you write a reducer with a discriminated union? Can you build and validate a form without querying the DOM manually? If not, revisit the matching section before continuing.

## How This Leads to Workshop 3

The task manager currently works with data held in the browser. That is enough to understand interaction, but a real application usually receives its records from somewhere else and may need to preserve user preferences. In the next workshop, the same ideas of state and rendering will be applied to asynchronous requests, timers, browser storage, and other systems that React does not control directly.
