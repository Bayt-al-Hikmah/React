# Workshop 2: Components, State, and User Interaction

In the previous workshop, we learned how to create a React application, build components, pass information through props, and use state to make components interactive. Our examples introduced the basic ideas behind React, but they were still relatively simple. We mostly worked with individual components that displayed information or managed a small amount of data.

Real applications are more involved because different parts of the interface need to work together. Imagine building a task manager where users can add tasks, mark them as completed, delete them, and filter the list to see only the tasks they need. Each of these actions affects the information displayed elsewhere in the application.

To build something like this, we need to understand more than how individual components work. We need to know how to organize components, how they communicate, and how user interactions change the application's data.

In this workshop, we will explore these ideas step by step. We will begin by organizing an application into smaller components, then look at how they communicate and respond to user interactions. After that, we will learn how to work with arrays, forms, and more complex state. Finally, we will bring everything together by building a small task manager using React and TypeScript.

## Objectives

By the end of this workshop, you should be able to:

- Divide an application into components with clear responsibilities.
- Understand how parent and child components communicate.
- Use `children` to build reusable layout components.
- Handle user interactions with React events.
- Update arrays and objects in state without modifying the original data.
- Display lists using `map()` and stable keys.
- Display different content depending on the application's state.
- Build forms and manage user input using controlled components.
- Understand the differences between `useState` and `useReducer`.
- Build a small interactive task manager using React and TypeScript.

## How Do We Organize a React Application?

Before writing any code, let's think about the application we want to build.

Our task manager needs to display a collection of tasks and provide a way for users to create new ones. Each task should have a title, a completion status, and a button that allows the user to delete it. We also want to give users the ability to filter the list, so they can display all tasks, only active tasks, or only completed tasks.

We could place all this functionality inside a single React component. While that might work for a small example, the component would gradually become harder to understand as we add more features. Its code would need to handle the form, the task collection, the filters, and the display of individual tasks.

A better approach is to divide the interface into smaller components, each responsible for a particular part of the application.

For our task manager, the structure could look like this:

```text
TaskPage
│
├── PageHeader
│
├── TaskForm
│
├── TaskFilters
│
└── TaskList
    │
    ├── TaskItem
    ├── TaskItem
    └── TaskItem
```

Each component has a specific responsibility. `TaskPage` brings the application together, while `PageHeader` displays the page title. `TaskForm` handles the process of entering a new task, and `TaskFilters` allows the user to choose which tasks should appear. `TaskList` displays the collection it receives, while each `TaskItem` represents one task and provides its completion and deletion controls.

Notice that we are not simply dividing the code into smaller files. We are separating responsibilities. This makes the application easier to understand because each component has a focused purpose, and we can work on one part without needing to understand the entire interface.

### Who Should Manage the Data?

Once we have divided the interface into components, we need to decide where the task collection should be stored.

Consider what happens when a user submits the form. `TaskForm` collects the title, but the new task needs to appear inside `TaskList`. If both components manage their own separate task collections, we would need a way to keep those collections synchronized. That would introduce unnecessary complexity.

A simpler solution is to let their common parent manage the shared data.

In our example, `TaskPage` is the closest common parent of the components that need access to the task collection. Therefore, it should own the tasks and pass the information or functions required by its children.

```text
                  TaskPage
              (Owns the tasks)
                     |
          -----------------------
          |          |          |
          v          v          v
       TaskForm  TaskFilters  TaskList
                               |
                               v
                            TaskItem
```

The parent manages the data, while the child components receive only what they need. For example, `TaskList` receives the tasks it must display, while `TaskForm` receives a function that allows it to request the addition of a new task.

We already learned how to pass information through props in Workshop 1. Now we are applying that same concept to connect several components.

This leads to an important React principle: **when multiple components need access to the same data, it is often best to keep that data in their closest common parent and pass it down through props.**

## Component Composition

We have seen how dividing an application into smaller components makes each part easier to manage. However, components are not only useful for separating responsibilities. They can also be combined to build larger interfaces.

This technique is called **component composition**.

For example, our `TaskPage` is composed of several smaller components. Each one handles a particular part of the interface, and the parent combines them into a complete page.

```tsx
function TaskPage() {
  return (
    <main>
      <PageHeader />
      <TaskForm />
      <TaskFilters />
      <TaskList />
    </main>
  );
}
```

Instead of writing the entire interface inside `TaskPage`, we use it to describe how the smaller components fit together. This makes the overall structure easier to read and allows us to reuse individual components elsewhere in the application.

### Passing Content with `children`

Sometimes, a component needs to provide a reusable structure while allowing the component that uses it to decide what content appears inside.

For example, imagine creating a panel with a title and a content area. We might want to reuse that panel for different purposes: one panel could display task information, while another could display account information.

We could create separate props for every possible type of content, but that would make the component unnecessarily complicated. React provides a more flexible solution through a special prop called `children`.

The `children` prop contains the content placed between a component's opening and closing tags. This allows the component to control its outer structure without needing to know exactly what content will appear inside.

Let's create a reusable panel:

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
      <div className="panel__content">
        {children}
      </div>
    </section>
  );
}
```

We can now use this component by placing the content between its tags:

```tsx
function App() {
  return (
    <Panel title="My Tasks">
      <p>You have 3 tasks to complete.</p>
      <button type="button">View Tasks</button>
    </Panel>
  );
}
```

Here, the paragraph and button become the value of the `children` prop. The `Panel` component displays its title and places that content inside its content area.

The advantage becomes clearer when we reuse the same component with different content:

```tsx
function App() {
  return (
    <>
      <Panel title="My Tasks">
        <p>You have 3 tasks to complete.</p>
      </Panel>

      <Panel title="Account">
        <p>Your account is active.</p>
      </Panel>
    </>
  );
}
```

We only need to define the panel structure once. Each time we use it, we provide a different title and different content.

You may also have noticed the `ReactNode` type. We use it because `children` can contain many kinds of content that React knows how to display, including text, JSX elements, and other components.

## How Do Components Communicate?

Now that we understand how components are organized, let's look more closely at how they communicate.

Imagine that a user wants to add a new task. They enter a title inside `TaskForm` and click the Add button. The form now has the information needed to create the task, but remember that `TaskPage` owns the task collection.

So how can the form request that its parent add a task?

We already know that a parent can send information to a child through props. The same idea can be used to pass a function from the parent to the child. The child can then call that function whenever it needs the parent to perform an action.

### Passing a Function Through Props

Let's first understand this with a simple example. Imagine that a parent component contains a function that displays a message:

```tsx
function Parent() {
  function handleMessage() {
    console.log('Hello from the parent!');
  }

  return <Child onSendMessage={handleMessage} />;
}
```

The parent passes `handleMessage` to the child through a prop called `onSendMessage`. The child receives the function and can call it when needed:

```tsx
type ChildProps = {
  onSendMessage: () => void;
};

function Child({ onSendMessage }: ChildProps) {
  return (
    <button onClick={onSendMessage}>
      Send Message
    </button>
  );
}
```

When the user clicks the button, the child calls the function it received from the parent. As a result, the message appears in the console.

Notice what happened: the parent created the function, passed it to the child through props, and the child called it in response to a user interaction. Although the function was called inside the child, its logic was defined by the parent.

This is an important pattern in React. **Parents pass data and functions to their children, and children use those functions to request actions from their parents.**

### Applying This to Our Task Manager

Let's return to the task manager. Since `TaskPage` owns the task collection, it should also define how new tasks are added.

We can start by creating a function inside `TaskPage`:

```tsx
function TaskPage() {
  function handleAddTask(title: string) {
    console.log('New task:', title);
  }

  return <TaskForm onAddTask={handleAddTask} />;
}
```

The function is passed to `TaskForm` through props. We can describe that prop using a TypeScript type:

```tsx
type TaskFormProps = {
  onAddTask: (title: string) => void;
};
```

When the user submits the form, `TaskForm` will call `onAddTask` and pass the entered title to its parent.

This keeps the responsibilities separate. The form collects the information, while the parent decides how to use it and update the task collection. We will follow this pattern throughout the task manager.

## Handling User Events

We have just seen how a child component can call a function when the user clicks a button. But how does React know when the user clicks, types, or submits a form?

React uses **events** to detect interactions with the interface. An event represents something that happens, usually as a result of user input. For example, clicking a button triggers a click event, changing the value of an input triggers a change event, and submitting a form triggers a submit event.

Some common React events include:

| Event | When it happens |
|---|---|
| `onClick` | The user clicks an element. |
| `onChange` | The value of an input changes. |
| `onSubmit` | The user submits a form. |
| `onMouseEnter` | The mouse enters an element. |
| `onFocus` | An element receives keyboard or programmatic focus. |

We connect these events to functions called **event handlers**. An event handler is simply a function that runs when a particular event occurs.

For example:

```tsx
function SaveButton() {
  function handleSave() {
    console.log('Saved successfully!');
  }

  return (
    <button onClick={handleSave}>
      Save
    </button>
  );
}
```

Here, `handleSave` runs when the user clicks the button. React takes care of calling the function when the event occurs.

There is one important detail to notice:

```tsx
onClick={handleSave}
```

We pass the function itself to React. We do not write:

```tsx
onClick={handleSave()}
```

The second version calls the function immediately while the component is rendering. That is not what we want because we need the function to run in response to the click, not during rendering.

### Why Do We Use Named Event Handlers?

For simple operations, we can write a function directly inside JSX:

```tsx
<button onClick={() => console.log('Saved')}>
  Save
</button>
```

This is perfectly valid. However, as the operation becomes more complicated, a separate named function makes the code easier to understand.

For example, deleting a task may require us to identify the selected task and update the task collection. Instead of placing that logic inside the JSX, we can define it separately:

```tsx
function handleDelete() {
  // Find the task to delete.
  // Update the task collection.
  // Perform any other required logic.
}
```

Then we connect it to the button:

```tsx
<button onClick={handleDelete}>
  Delete
</button>
```

Using descriptive names such as `handleSave`, `handleDelete`, and `handleSubmit` also makes it easier to understand what each function does when reading the component.

## Updating State and Working with Arrays

We now know how to respond to user interactions, but responding to an event is only part of the process. In our task manager, clicking the Add button should actually add a new task to the collection.

To understand how to do that, let's remember how React state works. In Workshop 1, we used `useState` to manage a counter:

```tsx
const [count, setCount] = useState(0);
```

When the user clicks a button, we update the state using its setter function. The same principle applies when our state contains an array or an object.

For the task manager, we can define a task type and use an array to store the collection:

```tsx
type Task = {
  id: string;
  title: string;
  completed: boolean;
};

const [tasks, setTasks] = useState<Task[]>([]);
```

Here, `tasks` contains the current collection, while `setTasks` allows us to update it.

However, working with arrays and objects in React introduces an important rule: **we should not directly modify data stored in state. Instead, we should create a new array or object containing the changes.** This approach is known as immutability.

### Adding an Item to an Array

Imagine that our task collection currently contains two tasks:

```tsx
const tasks = [
  { id: '1', title: 'Study React', completed: false },
  { id: '2', title: 'Practise TypeScript', completed: false },
];
```

Now suppose we want to add another task. JavaScript provides methods such as `push()` that can add elements to an existing array. However, we should not use `push()` to modify an array directly when that array is stored in React state.

Instead, we can use the spread operator:

```tsx
setTasks((currentTasks) => [
  ...currentTasks,
  newTask,
]);
```

The spread operator (`...`) copies the existing elements into a new array, after which we add the new task. The result is a new array containing all the previous tasks and the new one.

Notice that we use the functional form of the setter. This gives us the most recent state value when calculating the next state, which is useful when an update depends on the previous value.

### Removing an Item from an Array

When a user deletes a task, we need to create a new array that excludes the selected item. The `filter()` method is useful for this because it keeps only the elements that satisfy a given condition.

```tsx
setTasks((currentTasks) =>
  currentTasks.filter((task) => task.id !== taskId)
);
```

The condition checks whether each task's ID is different from the ID we want to delete. Every task that passes this condition remains in the new array, while the selected task is excluded.

### Updating an Item in an Array

We may also need to update an existing task. For example, when the user marks a task as completed, we want to change its `completed` property without affecting the other tasks.

We can use `map()` to create a new array and update only the matching task:

```tsx
setTasks((currentTasks) =>
  currentTasks.map((task) =>
    task.id === taskId
      ? { ...task, completed: true }
      : task
  )
);
```

The `map()` method goes through every task. If the current task has the ID we are looking for, we create a new object by copying its existing properties and setting `completed` to `true`. Otherwise, we return the original task object unchanged.

The result is a new array containing the updated task and all the other tasks.

### Why Do We Create New Arrays and Objects?

React uses state updates to determine when a component needs to render again. When we directly modify an existing array or object, we change the same value rather than creating a new one. If we then pass that same reference to a state setter, React may treat it as unchanged because the reference is still the same.

Creating new arrays and objects makes each update explicit: the previous state remains unchanged, the next state contains the updated data, and React can use that new state when rendering the interface.

The following methods are especially useful when working with collections:

| Method | Purpose |
|---|---|
| `map()` | Creates a new array by transforming each element. |
| `filter()` | Creates a new array containing only elements that match a condition. |
| Spread operator (`...`) | Copies elements or properties into a new array or object. |

You will use these techniques frequently when managing data in React.

## Displaying Lists of Data

Now that we know how to store and update an array of tasks, we need a way to display those tasks in the interface.

Real applications frequently work with collections of information. A store may display products, a learning platform may display students, and our task manager needs to display tasks. Creating a separate JSX element manually for every item would quickly become inefficient, especially when the number of items changes.

Instead, we can use JavaScript's `map()` method to go through an array and create an element for each item. React can then render the resulting elements as a list.

### Rendering a List with `map()`

Imagine that we have a collection of students:

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
```

We want to display their names inside an HTML list. We can use `map()` to transform each student object into a list item:

```tsx
function StudentList() {
  return (
    <ul>
      {students.map((student) => (
        <li key={student.id}>
          {student.name}
        </li>
      ))}
    </ul>
  );
}
```

The `map()` method goes through the `students` array and creates an `<li>` element for each student. Each element displays the corresponding student's name, so we do not need to write a separate HTML element for every student.

The same approach works with our task collection:

```tsx
function TaskList({ tasks }: { tasks: Task[] }) {
  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.title}
        </li>
      ))}
    </ul>
  );
}
```

Whenever the task collection changes, React renders the list using the updated data.

### Why Do We Need `key`?

You may have noticed that every list item includes a `key`:

```tsx
<li key={student.id}>
  {student.name}
</li>
```

This key helps React identify individual elements in a list when the collection changes.

Imagine that our task list contains three items:

```text
1. Study React
2. Practise TypeScript
3. Build a Task Manager
```

If the user deletes the first task, the list becomes:

```text
1. Practise TypeScript
2. Build a Task Manager
```

React needs to distinguish between the item that was removed and the items that remain. A stable key gives each item an identity that does not depend on its current position in the array. This allows React to identify which elements have been added, removed, or moved.

In our task manager, every task already has an ID, so we can use it as the key:

```tsx
<li key={task.id}>
  {task.title}
</li>
```

This is generally better than using the array index:

```tsx
<li key={index}>
```

The index represents the current position of an item, not its identity. When items are added, removed, or reordered, their positions may change. Using those positions as keys can therefore lead to problems when React updates the list.

Whenever possible, use a stable ID from your data.

One final detail: `key` is a special value that React uses internally. It is not passed to a component as an ordinary prop.
## Conditional Rendering

So far, we have displayed components and lists of data. However, an interface does not always need to display the same content. What the user sees often depends on the current state of the application.

Consider opening our task manager for the first time. There are no tasks yet. Although displaying an empty list is technically correct, it does not tell the user what to do next. We could instead display a message such as:

```text
You don't have any tasks yet.
Add your first task to get started!
```

Now imagine that the user has already created several tasks but applies a filter that does not match any of them. In that situation, a different message would be more useful:

```text
No tasks match your search.
Try changing your filter.
```

These examples show why an interface sometimes needs to display different elements depending on the application's data. This technique is called **conditional rendering**.

React uses ordinary JavaScript conditions to decide which elements should appear.

### Using the Ternary Operator

A ternary operator is useful when we need to choose between two possible results.

For example, suppose we want to display a different message depending on whether a user is signed in:

```tsx
function App() {
  const isSignedIn = true;

  return (
    <main>
      {isSignedIn
        ? <p>Welcome back!</p>
        : <p>Please sign in.</p>
      }
    </main>
  );
}
```

When `isSignedIn` is `true`, React displays the first message. Otherwise, it displays the second one.

### Using Logical AND (`&&`)

Sometimes, we only want to display an element when a condition is true. In that situation, the logical AND operator (`&&`) provides a simple solution.

For example, we may want to display a warning only when there are unfinished tasks:

```tsx
{remainingTasks > 0 && (
  <p>You have unfinished tasks.</p>
)}
```

The paragraph appears when `remainingTasks > 0` evaluates to `true`. If the condition is false, React does not display the paragraph.

There is one detail to be careful about when using `&&`. Consider this example:

```tsx
{count && <p>You have tasks.</p>}
```

If `count` is `0`, JavaScript evaluates the expression to `0`. React can then render that number on the screen, which may not be what we intended.

To avoid this, write the condition explicitly:

```tsx
{count > 0 && <p>You have tasks.</p>}
```

### Using Early Returns

Sometimes, a component needs to display completely different content depending on its current state. A component that loads data from an API, for example, may need to display a loading message while waiting, an error message if something goes wrong, an empty message if no data is available, or the actual list once the data has loaded.

We can handle these situations using early returns:

```tsx
function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return <p>No tasks available.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <li key={task.id}>
          {task.title}
        </li>
      ))}
    </ul>
  );
}
```

The component first checks whether the array is empty. If it is, the function immediately returns the message. Otherwise, execution continues and the task list is displayed.

### Thinking About Different Interface States

A good interface should not only handle situations where everything works as expected. It should also explain what is happening when there is no data, when an operation is in progress, or when something goes wrong.

For example, an application may need to display the following states:

| State | Example |
|---|---|
| Loading | Loading tasks... |
| Empty | You don't have any tasks yet. |
| No results | No tasks match your filter. |
| Error | Something went wrong while loading tasks. |
| Success | Task added successfully. |
| Disabled | Add button is disabled while submitting. |

It is important to distinguish between an empty collection and a collection that contains no matching results. If the user has never created a task, we should encourage them to add one. If tasks already exist but none match the selected filter, we should suggest changing the filter instead.

The message should reflect the actual situation so the user understands what happened and what they can do next.

## Working with Forms and User Input

We now know how to display data, respond to user interactions, and update state. The next question is how the application receives new information from the user.

For example, how can someone create a task in our task manager?

We need a form.

Forms allow users to enter information through input fields, text areas, selection controls, and buttons. In our case, the form will contain a text field for the task title and a button to submit it.

Before building the form, however, we need to understand how React manages the values entered by the user.

### Controlled Inputs

In React, a common way to manage input fields is through **controlled components**. An input is controlled when its displayed value is linked to React state.

Let's look at a simple search form:

```tsx
import { useState } from 'react';

function SearchForm() {
  const [query, setQuery] = useState('');

  return (
    <form>
      <label htmlFor="search">Search</label>

      <input
        id="search"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />
    </form>
  );
}
```

First, we create a state variable called `query` and initialize it with an empty string:

```tsx
const [query, setQuery] = useState('');
```

Next, we connect that state to the input using the `value` prop:

```tsx
value={query}
```

This tells React that the input should display the value currently stored in `query`.

We also use the `onChange` event to update the state whenever the user types something:

```tsx
onChange={(event) => setQuery(event.currentTarget.value)}
```

When the input changes, React triggers the event handler. We read the new text from the input and pass it to `setQuery`. React then renders the component again using the updated state, so the input displays the new value.

The process can be summarized as follows:

```text
1. The user types something.
             |
             v
2. The input triggers onChange.
             |
             v
3. We read the new input value.
             |
             v
4. We update the React state.
             |
             v
5. React renders the component again.
             |
             v
6. The input displays the updated value.
```

This creates a direct connection between the input and React state. The state becomes the source of truth for the value displayed in the field.

### Handling Form Submission

Now that we know how to read and manage input values, let's see how to submit a form.

React provides the `onSubmit` event, which allows us to handle form submission using a function.

```tsx
import { useState } from 'react';
import type { FormEvent } from 'react';

function SearchForm() {
  const [query, setQuery] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log('Searching for:', query);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="search">Search</label>

      <input
        id="search"
        value={query}
        onChange={(event) => setQuery(event.currentTarget.value)}
      />

      <button type="submit">Search</button>
    </form>
  );
}
```

Notice this line inside the event handler:

```tsx
event.preventDefault();
```

By default, submitting an HTML form can cause the browser to perform its normal submission behavior, which may involve navigating to another page or reloading the current one. When we handle the submission ourselves in React, we usually do not want that behavior.

Calling `preventDefault()` stops the browser's default action and allows our JavaScript function to process the form.

The button also has an important attribute:

```tsx
type="submit"
```

This tells the browser that the button should submit the form. Because it is placed inside the form, the user can submit by clicking the button or by pressing Enter in an appropriate input field.

### Understanding Form Events in TypeScript

You may have noticed that we used this type for the submission event:

```tsx
FormEvent<HTMLFormElement>
```

It describes a form submission event in TypeScript. When handling changes to an input, we can use another event type:

```tsx
ChangeEvent<HTMLInputElement>
```

For example:

```tsx
import { useState } from 'react';
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

      <input
        id="email"
        type="email"
        value={email}
        onChange={handleEmailChange}
        required
      />

      <button type="submit">Continue</button>
    </form>
  );
}
```

TypeScript helps us understand which properties and methods are available on the event. For simple inline event handlers, it can usually infer the correct event type automatically. We mainly need to declare the type explicitly when writing a separate event handler or when TypeScript cannot infer it from the context.

### Basic Form Validation

Before submitting information, we usually need to check whether the entered values are valid. For example, a task title should not be empty.

HTML provides several built-in validation features that can handle common requirements:

```tsx
<input
  type="text"
  required
  minLength={3}
  maxLength={100}
/>
```

Here, `required` tells the browser that the user must enter a value, `minLength` requires at least three characters, and `maxLength` prevents the text from exceeding 100 characters.

For more specific requirements, we can write our own validation logic. Consider a task title that must contain at least three non-whitespace characters:

```tsx
const trimmedTitle = title.trim();

if (trimmedTitle.length < 3) {
  setError('The task title must contain at least 3 characters.');
  return;
}
```

We use `trim()` to remove unnecessary spaces from the beginning and end of the text. This means that a user cannot submit a title containing only spaces and have it treated as valid.

### Client-Side Validation Is Not Enough

There is an important distinction between validating information in the browser and validating it on the server.

Client-side validation helps users correct mistakes before submitting a form, but it should not be treated as a security measure. Users can bypass or modify browser-side validation and send requests directly to a backend.

For example, even if our interface prevents a user from entering a negative product quantity, someone could still send an invalid request directly to the server. The backend must therefore validate submitted information independently before accepting it.

For now, we will focus on client-side validation because we are learning how forms work in React. As our applications become more complex, we can use libraries such as **React Hook Form**, which helps manage form values, errors, and submission, or **Zod**, which allows us to describe and validate data using schemas.

We do not need these libraries for every form. Understanding controlled inputs and basic validation first will make them much easier to use when we eventually need them.

## Managing More Complex State with `useReducer`

So far, we have used `useState` to manage different kinds of data, including a counter, the text inside an input, and an array of tasks. `useState` is usually the best place to start because it is straightforward and works well for many situations.

However, imagine that our task manager grows and needs several operations. Users should be able to add tasks, mark them as completed, mark them as active, delete them, and edit their titles. All these operations affect the same task collection.

We could manage each operation using separate state update functions. That approach is perfectly valid, but as the number of operations grows, the update logic may become harder to organize.

React provides another Hook called `useReducer`, which can help us manage state when several related operations affect the same data.

### What Is a Reducer?

A reducer is a function that receives two values: the current state and an action describing what happened. It then uses those values to calculate and return the next state.

Think of it as a central place where we define the different ways our data can change.

For example, our task manager might support actions such as:

```text
task/added
task/toggled
task/deleted
```

Each action describes an event that should change the task collection. The reducer receives the action and determines what the updated collection should look like.

### Creating a Reducer

Let's start with a simple counter to understand the concept before applying it to the task manager.

First, define the structure of the state:

```tsx
type CounterState = {
  count: number;
};
```

Next, define the actions the reducer can receive:

```tsx
type CounterAction =
  | { type: 'increment' }
  | { type: 'decrement' }
  | { type: 'reset' };
```

We use a TypeScript union type because the reducer can receive several different actions, each identified by its `type`.

Now we can create the reducer:

```tsx
function counterReducer(
  state: CounterState,
  action: CounterAction
): CounterState {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };

    case 'decrement':
      return { count: state.count - 1 };

    case 'reset':
      return { count: 0 };

    default:
      return state;
  }
}
```

The reducer receives the current state and checks the action's type. If the action is `increment`, it returns a new state with the count increased by one. If it is `decrement`, it returns a state with the count decreased by one. The `reset` action returns a state where the count is zero.

Notice that the reducer does not directly modify the existing state. It returns a new object containing the updated value.

### Using `useReducer`

Now that we have a reducer, we can connect it to a React component:

```tsx
import { useReducer } from 'react';

function Counter() {
  const [state, dispatch] = useReducer(
    counterReducer,
    { count: 0 }
  );

  return (
    <section>
      <p>Count: {state.count}</p>

      <button onClick={() => dispatch({ type: 'decrement' })}>
        -
      </button>

      <button onClick={() => dispatch({ type: 'reset' })}>
        Reset
      </button>

      <button onClick={() => dispatch({ type: 'increment' })}>
        +
      </button>
    </section>
  );
}
```

Notice that `useReducer` returns two values. The first, `state`, contains the current state. The second, `dispatch`, is a function that allows us to send an action to the reducer.

For example:

```tsx
dispatch({ type: 'increment' });
```

This tells React that an increment action should be processed. React passes the current state and the action to the reducer, which calculates the next state.

The complete process looks like this:

```text
1. The user clicks the Increment button.
                  |
                  v
2. dispatch sends an increment action.
                  |
                  v
3. The reducer receives the current state
   and the action.
                  |
                  v
4. The reducer calculates the next state.
                  |
                  v
5. React updates the component.
                  |
                  v
6. The new count appears on the screen.
```

### When Should We Use `useState` or `useReducer`?

Both Hooks allow us to manage state, but they are useful in different situations.

`useState` is usually the better choice when we are managing a simple value, such as a number or string, or when the update logic is straightforward. It is also a natural choice for individual input fields and other small pieces of state.

`useReducer` becomes useful when several related actions update the same state, especially when that state contains a more complex structure, such as a collection of objects. It allows us to keep the update logic in one place and makes the possible state transitions easier to understand and test.

There is no need to use `useReducer` simply because it appears more advanced. The goal is to choose the approach that makes the code easier to understand and maintain.

## Build the Task Manager

We have now covered the main concepts needed to build our task manager. Before writing the final code, let's bring those ideas together.

Our application will contain the following components:

```text
TaskPage
│
├── TaskForm
│
├── TaskFilters
│
└── TaskList
    │
    └── TaskItem
```

`TaskPage` owns the task collection and coordinates the other components. `TaskForm` collects information and asks the parent to add a task, while `TaskFilters` allows the user to choose which tasks should appear. `TaskList` displays the filtered collection, and `TaskItem` represents an individual task with controls for completing or deleting it.

We will use `useReducer` to manage the task collection because several operations need to update the same array.

### Define the Task Structure

First, we need to describe what a task looks like. Create a TypeScript type containing the information required by each task:

```tsx
type Task = {
  id: string;
  title: string;
  completed: boolean;
};
```

Each task has a unique identifier, a title describing what needs to be done, and a boolean value indicating whether it has been completed.

We use a string for the ID because the browser provides `crypto.randomUUID()`, which can generate a unique identifier for each new task.

### Define the Available Actions

Next, we need to describe the operations that can change the task collection.

```tsx
type TaskAction =
  | { type: 'task/added'; payload: Task }
  | { type: 'task/toggled'; payload: string }
  | { type: 'task/deleted'; payload: string };
```

This type defines three possible actions.

The `task/added` action adds a new task, so its payload contains the complete task object. The `task/toggled` action changes a task's completion status, so it only needs the task's ID. The `task/deleted` action also uses an ID because it needs to identify which task should be removed.

The `payload` is simply the additional information required to perform an action.

### Create the Task Reducer

Now we can define how each action changes the task collection:

```tsx
function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'task/added':
      return [...state, action.payload];

    case 'task/toggled':
      return state.map((task) =>
        task.id === action.payload
          ? { ...task, completed: !task.completed }
          : task
      );

    case 'task/deleted':
      return state.filter(
        (task) => task.id !== action.payload
      );

    default:
      return state;
  }
}
```

Let's follow each operation.

When the reducer receives `task/added`, it creates a new array containing the existing tasks and the new task:

```tsx
return [...state, action.payload];
```

For `task/toggled`, it goes through the collection using `map()`. When it finds the task with the matching ID, it creates a new object with the opposite completion status:

```tsx
return state.map((task) =>
  task.id === action.payload
    ? { ...task, completed: !task.completed }
    : task
);
```

This means that a task with `completed: false` becomes completed, while a task with `completed: true` becomes active again. All other tasks remain unchanged.

Finally, when the reducer receives `task/deleted`, it creates a new array that excludes the task with the matching ID:

```tsx
return state.filter(
  (task) => task.id !== action.payload
);
```

All three operations return new data instead of modifying the existing state. This keeps our reducer consistent with React's approach to state updates.

### Build the Task Form

Now we need a form that allows the user to enter a task title.

Remember that `TaskPage` owns the task collection, so `TaskForm` should not manage the collection itself. Its responsibility is to collect the input, validate it, and send the title to the parent through the callback function.

```tsx
import { useState } from 'react';
import type { FormEvent } from 'react';

type TaskFormProps = {
  onAddTask: (title: string) => void;
};

function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (trimmedTitle.length < 3) {
      setError('The task title must contain at least 3 characters.');
      return;
    }

    onAddTask(trimmedTitle);

    setTitle('');
    setError('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="task-title">Task Title</label>

      <input
        id="task-title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.currentTarget.value)}
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit">Add Task</button>
    </form>
  );
}
```

Let's follow what happens when the user submits the form. As the user types, React stores the input value in the `title` state. When the form is submitted, `handleSubmit` runs and first prevents the browser's default submission behavior.

The function then removes unnecessary spaces using `trim()` and checks whether the resulting title contains at least three characters. If the title is invalid, the component stores an error message and stops the submission.

When the title is valid, the form calls `onAddTask` and passes the title to its parent. It then clears the input and removes any previous error message.

Notice that `TaskForm` does not add anything directly to the task collection. It simply sends the title to `TaskPage`, leaving the parent responsible for creating and storing the new task.

### Build the Task Item

Next, we need a component responsible for displaying one task. It should show the task title, provide a checkbox to change its completion status, and include a button to delete it.

The parent will provide the task and the functions required to perform these actions:

```tsx
type TaskItemProps = {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li>
      <label>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />

        <span>{task.title}</span>
      </label>

      <button
        type="button"
        onClick={() => onDelete(task.id)}
      >
        Delete
      </button>
    </li>
  );
}
```

The checkbox displays the current value of `task.completed`. When the user changes it, the component calls `onToggle` and sends the task ID to the parent. The Delete button follows the same pattern, calling `onDelete` with the ID of the task that should be removed.

Both functions come from the parent component, so `TaskItem` does not need to know how the task collection is updated.

Notice that we use actual HTML form controls instead of making the entire task row clickable. These controls provide familiar interactions and make the interface easier to use with a keyboard and assistive technologies.

### Build the Task List

Now we need a component that displays the task collection. It receives an array of tasks and creates a `TaskItem` for each one.

We also need to handle two different situations. The first occurs when the user has not created any tasks. The second occurs when tasks exist, but none of them match the selected filter.

To distinguish between these situations, we will pass both the filtered task collection and the total number of tasks:

```tsx
type TaskListProps = {
  tasks: Task[];
  totalTasks: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

function TaskList({
  tasks,
  totalTasks,
  onToggle,
  onDelete,
}: TaskListProps) {
  if (totalTasks === 0) {
    return <p>You don't have any tasks yet. Add one to get started!</p>;
  }

  if (tasks.length === 0) {
    return <p>No tasks match the selected filter.</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
```

The component first checks the total number of tasks. If it is zero, the user has not created any tasks, so we display a message encouraging them to add one.

If tasks exist but the filtered collection is empty, we display a different message explaining that no tasks match the selected filter.

Otherwise, we use `map()` to create a `TaskItem` for every task. Each item receives its task object and the callback functions it needs.

Notice how `TaskList` does not need to know how tasks are added, updated, or deleted. Its responsibility is simply to display the collection it receives.


## Connect Everything Together

We now have the main components of our task manager. The remaining step is to connect them inside the parent component.

This is where the concepts from the workshop come together: `TaskPage` manages the state, passes information and callback functions to its children, and decides which tasks should be displayed.

First, let's define the available filters:

```tsx
type TaskFilter = 'all' | 'active' | 'completed';
```

This TypeScript union type ensures that our filter can only have one of three possible values.

We can now create the `TaskFilters` component, which is responsible for displaying the selection control and notifying its parent when the selected filter changes:

```tsx
type TaskFiltersProps = {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
};

function TaskFilters({ filter, onFilterChange }: TaskFiltersProps) {
  return (
    <div>
      <label htmlFor="task-filter">Filter Tasks</label>

      <select
        id="task-filter"
        value={filter}
        onChange={(event) =>
          onFilterChange(event.currentTarget.value as TaskFilter)
        }
      >
        <option value="all">All Tasks</option>
        <option value="active">Active Tasks</option>
        <option value="completed">Completed Tasks</option>
      </select>
    </div>
  );
}
```

The selected filter is controlled by React state in the parent. Whenever the user chooses a different option, `TaskFilters` calls `onFilterChange` and passes the selected value to `TaskPage`.

Now let's create the parent component:

```tsx
import { useReducer, useState } from 'react';

function TaskPage() {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  const [filter, setFilter] = useState<TaskFilter>('all');

  function handleAddTask(title: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      completed: false,
    };

    dispatch({
      type: 'task/added',
      payload: newTask,
    });
  }

  function handleToggleTask(id: string) {
    dispatch({
      type: 'task/toggled',
      payload: id,
    });
  }

  function handleDeleteTask(id: string) {
    dispatch({
      type: 'task/deleted',
      payload: id,
    });
  }

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') {
      return !task.completed;
    }

    if (filter === 'completed') {
      return task.completed;
    }

    return true;
  });

  return (
    <main>
      <h1>My Task Manager</h1>

      <TaskForm onAddTask={handleAddTask} />

      <TaskFilters
        filter={filter}
        onFilterChange={setFilter}
      />

      <TaskList
        tasks={visibleTasks}
        totalTasks={tasks.length}
        onToggle={handleToggleTask}
        onDelete={handleDeleteTask}
      />
    </main>
  );
}
```

Let's look at what happens inside `TaskPage`.

First, `useReducer` manages the task collection, while `useState` stores the currently selected filter. This is a useful example of using different state management approaches within the same component: the task collection has several related operations, so we use a reducer, while the filter is a simple value that can be managed with `useState`.

The `handleAddTask` function creates a new task object. It generates a unique ID, stores the title received from the form, and initializes the completion status to `false`. It then dispatches a `task/added` action to update the collection.

The other two functions dispatch actions to toggle or delete a task. In this way, the parent remains responsible for all changes to the collection.

We also calculate `visibleTasks` by filtering the complete task collection according to the selected filter. When the filter is set to `active`, we keep only tasks that are not completed. When it is set to `completed`, we keep only completed tasks. Otherwise, we display the entire collection.

Finally, we pass the required information to each child component. The form receives the function for adding tasks, the filter component receives the current filter and its update function, and the list receives the filtered tasks along with the functions for toggling and deleting them.

We can now display the task manager through our root application component:

```tsx
export default function App() {
  return <TaskPage />;
}
```

We have a working component structure in which every component has a clear responsibility.

### Follow the Complete Process

Let's follow what happens when the user enters a task and clicks the Add Task button.

Imagine the user enters:

```text
Study React
```

The form handles the submission and sends the title to `TaskPage` through the `onAddTask` callback. The parent creates a task object and dispatches an action to the reducer. The reducer returns a new task array, and React renders the interface using the updated state.

The complete process looks like this:

```text
1. The user enters a task title.
                 |
                 v
2. TaskForm stores the input in its state.
                 |
                 v
3. The user submits the form.
                 |
                 v
4. TaskForm calls onAddTask and sends
   the title to TaskPage.
                 |
                 v
5. TaskPage creates a new task with an ID.
                 |
                 v
6. TaskPage dispatches a task/added action.
                 |
                 v
7. taskReducer creates a new task array.
                 |
                 v
8. React renders the updated interface.
                 |
                 v
9. TaskList receives the updated collection.
                 |
                 v
10. TaskItem displays the new task.
```

This single feature connects almost every concept we studied in this workshop. Components divide the interface into smaller parts, props pass information between them, and callback functions allow children to request actions from their parents. Events respond to user interactions, forms collect input, and state stores the task collection.

The reducer defines how the data changes, while `map()` allows us to display the tasks. Stable keys help React identify individual items, and conditional rendering allows us to handle empty lists and other interface states.

The important thing is not to memorize each code example separately. What matters is understanding how these pieces work together to implement a feature. This is how we begin building real React applications.


## Workshop Challenge: Extend the Task Manager

Now it is time to practise what we have learned.

Starting from:

```text
Workshop2/Example/todo-list
```

Extend the task manager by adding the following features.

### Add Task Priority

Each task should have a priority level:

```tsx
type TaskPriority = 'low' | 'medium' | 'high';
```

Allow the user to select a priority when creating a task, and make sure the selected value is stored with the task.

### Add Task Filters

Provide three filter options so the user can display all tasks, active tasks, or completed tasks. The displayed list should update whenever the selected filter changes.

### Improve Empty States

Display a useful message when the user has not created any tasks and a different message when tasks exist but none match the selected filter.

### Improve Form Validation

Prevent users from submitting empty task titles or titles containing only spaces. Display a clear error message whenever the input is invalid.

### Improve Accessibility

Use appropriate HTML elements, labels, checkboxes, and buttons. Make sure every action can be performed using a keyboard.

### Add a Task Summary

Display the number of unfinished tasks. For example:

```text
3 tasks remaining
```

The summary should update automatically whenever tasks are added, completed, or deleted.

### Keep Task IDs Stable

Every task should have a unique ID, and that ID should be used as the React key when displaying the list.

### Challenge Goal

By completing this exercise, you will practise component composition, props and callback functions, event handling, state management, array operations, conditional rendering, controlled forms, reducers, and displaying lists with stable keys.

Try to implement the features yourself before looking for a complete solution. The goal is to practise connecting these concepts rather than simply copying code.


## Workshop Recap

In this workshop, we moved beyond individual components and explored how different parts of a React application work together. Let's review the main ideas and how they relate to one another.

### Components and Communication

Components allow us to divide an interface into smaller, reusable parts, each with a clear responsibility. A parent can combine several children, and the `children` prop allows a component to receive content placed between its opening and closing tags.

Props provide a way for parents to pass information to their children. When a child needs its parent to perform an action, the parent can pass a callback function through props. Shared data should usually be managed by the closest common parent that needs it.

### Events and State Updates

React events allow components to respond to user interactions, while event handlers define what should happen when those events occur.

When updating state, we should avoid directly modifying arrays and objects. Instead, we create new values using methods such as `map()` and `filter()`, or the spread operator. This keeps state updates predictable and allows React to detect changes more reliably.

### Lists and Conditional Rendering

The `map()` method allows us to transform arrays into JSX elements, while stable IDs provide keys that help React identify items when a list changes.

Conditional rendering allows us to display different content depending on the application's state. It is particularly useful when handling loading, empty, no-result, error, and success states.

### Forms and User Input

Controlled inputs use React state to manage their displayed values. The `onChange` event updates that state, while `onSubmit` allows us to handle form submission. We use `preventDefault()` when we want to process the submission ourselves instead of allowing the browser to perform its default behavior.

Client-side validation helps users correct mistakes, but the backend must validate submitted data independently.

### State Management

`useState` is suitable for simple state values and straightforward updates. When several related actions affect the same state, `useReducer` can help keep the update logic organized.

A reducer receives the current state and an action, then returns the next state without modifying the existing one.

### Self-Check

Before moving to the next workshop, make sure you can answer the following questions:

1. Why do we divide an application into multiple components?
2. Which component should manage data shared by several children?
3. What is the purpose of the `children` prop?
4. How can a child component request that its parent perform an action?
5. What is the difference between `onClick` and `onSubmit`?
6. Why should we avoid modifying arrays and objects directly in state?
7. What is the purpose of `map()` and `filter()`?
8. Why does React need stable keys when displaying lists?
9. What is the difference between an empty list and a list with no matching results?
10. What is a controlled input?
11. Why do we use `preventDefault()` when handling form submission?
12. What is the difference between `useState` and `useReducer`?

Being able to answer these questions and extend the task manager will show that you understand the main concepts of this workshop.

## How This Leads to Workshop 3

In this workshop, we learned how components communicate, how users interact with forms and buttons, and how to manage collections of data using state and reducers. Our task manager can now handle several operations, but it still has an important limitation: when we refresh the browser, all the tasks disappear.

This happens because our data is currently stored in React state. The state exists while the application is running, but it is not automatically saved permanently. Once the page is refreshed, the application starts again and the previous in-memory data is lost.

Real applications usually need to communicate with external systems so they can retrieve and store information beyond the lifetime of a component. For example, our task manager may need to load tasks from a backend API, save newly created tasks to a database, display a loading message while waiting for a response, and handle errors when a request fails. It may also need to store simple preferences in the browser.

This introduces the next important step in learning React: understanding how components interact with systems outside the component tree.

In **Workshop 3**, we will explore Effects, asynchronous operations, API requests, and browser storage. These concepts will help us move from interfaces that work only with local data to applications that communicate with real services and preserve information beyond a browser refresh.
