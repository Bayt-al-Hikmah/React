## Objectives
- Working with `useReducer`
- Children Components
- Rendering lists of data using `.map()`.
- Working with Conditional Rendering.
- Handle User Input with "Controlled Components."

## Working with `useReducer`
We used `useState` for managing data. However, when state becomes complex for example, when one action changes multiple parts of the state, or when the next state depends heavily on the previous one `useState` can get messy.   
`useReducer` is an alternative hook. It is based on the idea that instead of telling React what to change directly, we send an Action, and a central function (the Reducer) decides how to update the state.
### The Three Parts of a Reducer
1. **State:** The current data.
2. **Dispatch:** A function used to send commands (Actions).
3. **Reducer:** A function that takes the current state and an action, and returns the new state.

```jsx
import { useReducer } from 'react';

function counterReducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { count: state.count + 1 };
    case 'decrement':
      return { count: state.count - 1 };
    case 'reset':
      return { count: 0 };
    default:
      return state; // Do nothing if action is unknown
  }
}

function Counter() {
  // 2. Initializing the hook
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div>
      Count: {state.count}
      {/* 3. Dispatching Actions */}
      <button onClick={() => dispatch({ type: 'decrement' })}>-</button>
      <button onClick={() => dispatch({ type: 'reset' })}>Reset</button>
      <button onClick={() => dispatch({ type: 'increment' })}>+</button>
    </div>
  );
}
```
Here we created reducer function `counterReducer`. This function receives two parameters: the current state and an action object. Based on the action’s `type`, the reducer returns a new state.

After defining the reducer, we build the `Counter` component, it use the `useReducer` hook to manage its internal state, this hook take tow argument. The first one is the reducer function we created that manage the state, and the second is the initial state here, an object with `count: 0`.

The `useReducer` returns an array containing two items: the current `state` and the `dispatch` function. This function is what we use to send actions to that reducer. When we call `dispatch({ type: 'increment' })`, React passes both the current state and that action to `counterReducer`. The reducer computes the new state and React updates the component accordingly.

Finally,  we display the current count and add three buttons. Each button dispatches a different action decrement, reset, or increment.
## Children Components 
Building a UI often requires nesting components, much like elements nest in plain HTML. In React, this is achieved using a special built-in prop called ``children``, which represents whatever is placed between a component’s opening and closing tags. This allows us to create components that act as containers or layouts focus on providing structure or styling while leaving the actual content up to the developer.
The `children` prop solves this by letting us inject arbitrary UI into another component.
### Creating a Component That Uses `children`
There is two ways to make React component accept the children we can use props then access children by using `props.children` or we can use ``{ children }`` destructor as parametre for the component.
```jsx
import { Children } from 'react';

// Method 1
function Card({ children }) {
  return <div className="card">{children}</div>;
}
// Method 2
function Card_2(props) {
  return <div className="card">{props.children}</div>;
}
```
Here, the `Card` component doesn’t know or care what content it will display. Its only job is to wrap the children with a styled `<div>`.
### Passing Children to a Component
To pass children, we simply write JSX between the component’s opening and closing tags. React automatically collects that JSX and hands it to the component as the `children` prop.
```jsx
function App() {
  return (
    <Card>
      <h2>Hello</h2>
      <p>This content is passed as children.</p>
    </Card>
  );
}
```
Everything inside `<Card> ... </Card>` becomes the value of `children` when `Card` renders.
## Rendering Lists in React
In Workshop 1, we displayed a single piece of data (a counter). However, real-world applications usually deal with lists: a feed of tweets, a gallery of products, or a menu of options. In React, we don't repeat code manually or copy past for every item; we use JavaScript to generate the HTML for us.
### `For` Loops in JSX
In standard JavaScript, if we want to loop through an array, we often use a `for` loop. However, JSX is "syntactic sugar" for function calls. We cannot put a statement (like `for` or `if`) inside the curly braces `{}` of JSX. We can only put expressions, things that produce a value.    
Therefore, in React, the standard way to render a list is using the JavaScript array method `.map()`.
### Working with `.map()`
The `.map()` function takes an array of raw data and "transforms" it into an array of JSX elements.
```jsx
const fruits = ["Apple", "Banana", "Orange"];

return (
  <ul>
    {fruits.map((fruit) => (
      <li>{fruit}</li>
    ))}
  </ul>
);
```
In this code we used the map function to loop over the fruits arrays and return array of `<li>` elements , React will recive them and render them to the screen, The code work, but it will print a warning in the console:
```
Warning: Each child in a list should have a unique "key" prop.
```
It drop this warning because React needs a way to identify each item in the list uniquely. We fix that by adding a special `key` prop to the element we return inside the map. This key props help us later to target the items of the list   
To use it we just loop over the collection of data and render `<li>` element with additional attribute called ``key`` have the unique id of the item as value.
```jsx
const users = [
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" }
];

return (
  <ul>
    {users.map((user) => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);
```
## Conditional Rendering
Looping over the Elements isn't the only thing we can do in React. Often, we want to display different things depending on the state of our application. For example, showing a "Login" button if the user is logged out, or a "Welcome" message if they are logged in. Since the `if/else` is statement we can't use them inside JSX, Javascript offer us two other patterns to deal with conditional rendring.
### The Ternary Operator (`? :`)
This is a shortcut for an `if...else` statement. It is useful when we want to switch between two different UI elements.    

**Syntax:** `condition ? (show this if true) : (show this if false)`
```jsx
return (
  <div>
    {isLoggedIn ? <h1>Welcome back!</h1> : <button>Please Sign In</button>}
  </div>
);
```
Here is `isLoggedIn` is true we will get `<h1>Welcome back!</h1>`, if it false we will get `<button>Please Sign In</button>` inside our div
### The Logical AND (`&&`)
The second pattern for conditional patter is using `&&`, this pattern useful when we want to render something if a condition is true, but render nothing if it is false.
```jsx
return (
  <div>
    <h1>My Inbox</h1>
    {unreadMessages > 0 && <p>You have new messages!</p>}
  </div>
);
```
In this example:
- If `unreadMessages > 0` is **true**, React renders the paragraph.
- If it is **false**, React ignores the line entirely and renders nothing.
## Forms and User Input
For more interactive applications, we need to handle user inputs using forms. However, handling forms in React is different from standard HTML.  
In HTML, an `<input>` tag maintains its own internal state; when you type, the browser updates the input automatically. React, on the other hand, uses **State** to handle this.   
We start by setting the input's value to a state variable. However, this creates a problem: the input becomes 'frozen.' The value will remain locked to the state variable, so typing will have no effect. To fix this, we must add an `onChange` event handler to update the state whenever the user types.
### Event Handels
The `onChange` prop is an event handler that executes every time there is a change in the input element. We use it to update the state whenever the user types. To do this, we pass it a function that sets the state variable to the current value of the input field.
```jsx
function Form() {
  const [text, setText] = useState("");

  return (
    <input 
      type="text" 
      value={text} 
      onChange={(e) => setText(e.target.value)} 
    />
  );
}
```
When the user types, the `onChange` listener detects the event immediately. Inside our function, we access the `event.target` which represents the input element to retrieve the value the user just typed.   
We then use `setText` to update our state. Once the state changes, React triggers a re-render, updating the input field to match the new text we just stored.
### Form Validation
Form need validation, and creating the validation like checking email format, password length difficult, can be complex,Better and more the industry standard is to use a library like React Hook Form. It uses uncontrolled components (refs) to manage form data efficiently without re-rendering the component on every letter typed.
#### Setting the Validation
To use this, First we install the library: `npm install react-hook-form`.
```jsx
import { useForm } from "react-hook-form";

function SignupForm() {
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Submitted:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label>Username</label>
        
        <input 
          {...register("username", { required: "Username is required" })} 
        />
        {errors.username && <p className="error">{errors.username.message}</p>}
      </div>
      
      <div>
        <label>Email</label>
        <input 
          {...register("email", { 
            required: "Email is required", 
            pattern: {
              value: /^\S+@\S+$/i,
              message: "Invalid email format"
            }
          })} 
        />
        {errors.email && <p className="error">{errors.email.message}</p>}
      </div>

      <button type="submit">Sign Up</button>
    </form>
  );
}
```
Here, we create a simple signup form with validation. We imported the ``useForm`` hook, and when using this hook, it returns three main things we need:
- **`register`**  connects each input to the form and lets us add validation rules
- **`handleSubmit`** runs validation before calling our submit function
- **`errors`** stores error messages when a field fails validation
    
After executing the hook, we created the ``onSubmit`` function. This will run only when the form is submitted and all inputs pass validation.

Finally, we built the form itself. Each input is connected to the form using the `register()` function, which takes **two arguments**: the field name and an object defining the validation rules.
- For the username, we set it as **required**.
- For the email, we added both a **required rule** and a **pattern rule** to ensure the value matches a valid email format.

If an input does not meet its validation rule, React Hook Form adds an entry to `errors`. We check for that using `errors.fieldName`, and if it exists, we display the error message under the input.
## Building To-Do List App
### Introduction
Let's put what we have learned into practice and build a To-Do List App. Users will have the ability to add, and remove tasks.
### App Logic
So, what do we need to build? First, we need an Form with input field to for the task Title and textarea for Task Description, plus a button to submit the data.     

Second, inside the task list, every task needs a Delete button to remove tasks from the application.
### Creating the Components
Now lets create the components that we need
#### Reducer Function
First Lets Create reducer function to manage the task list
```
function reducer(state,action){
  switch(action.type){
    case 'ADD_TASK':
      return [...state,action.payload];
    case 'DELETE_TASK':
      return state.filter((task)=>task.title!==action.payload);
    default:
      return state;
  }
}
```
This reducer handles two main operations:
- Adding a task: It returns a new array by spreading the existing state and appending the new task from the action’s payload.
- Deleting a task: It filters the task list and removes the task whose title matches the one provided in the payload.
#### Form
Next, we create a Form component to capture new task data. It renders an ``<input>`` for the task title and a ``<textarea>`` for the task description. When the form is submitted, it constructs a new task object and dispatches an ``ADD_TASK`` action.
```jsx
function Form({setTasks}){
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    return(
    <form>
    <label> Title:
    <input value={title} onChange={(e)=>{setTitle(e.target.value)}} />
    </label>

    <label>Description:
    <textarea value={description} onChange={(e)=>{setDescription(e.target.value)}}>
    </textarea>
    </label>
    
    <button  class = "green" onClick={
      (e)=>{
        e.preventDefault();
        const newTask = {"title":title,"description":description}
        setTasks({type:"ADD_TASK",payload:newTask})
        setTitle("")
        setDescription("")
        }
    
    }>Add Task</button>
    </form>
    )
}
```
The Form component collects a task’s title and description using controlled inputs managed by ``useState``. When the user clicks Add Task, the component prevents the default form submission, creates a new task object, and dispatches an ``ADD_TASK`` action through setTasks. After adding the task, it clears both input fields to reset the form.
#### Tasks
Now, let's create the components responsible for displaying our tasks. We need two components one represent a single task and the other represent the tasks list.
```jsx
function Task({title,description,setTasks}){
  return (
    <div key={title}>
    <h3>{title}</h3>
    <p>{description}</p>
    <button onClick={()=>{
          setTasks({type:"DELETE_TASK",payload:title})
        }}>Delete Task</button>
    </div>)

}
```
The Task component is responsible for displaying a single task. It shows the task’s title and description, and includes a Delete Task button. When clicked, it dispatches a ``DELETE_TASK`` action using the task’s title as the payload, allowing the reducer to remove that task from the list.
```jsx
function Tasks({tasks,setTasks}){
    return (
    <div>
    {  
    tasks.map((task,index)=>
     <Task 
      setTasks={setTasks}
      key={index} 
      title={task.title}
      description={task.description} /> 
    )
    }
    </div>
    )  
}
```
The Tasks component renders the entire task list by mapping over the tasks array. For each task, it creates a Task component and passes down the title, description, and the setTasks dispatcher. This component acts as a container that displays all tasks on the screen.

#### The Todo
Before finalizing our application, we'll create a central component to act as the main container, utilizing the built-in children prop to accept and render all nested content.
```jsx
function Todo({children}){
  return (
    <div className="Todo">
      <h1>Todo List</h1>
      {children}
     </div>

    )
}
```
The Todo component serves as a container for the entire app. It displays a main heading and uses the children prop to render whatever content is passed inside it. This makes the component flexible, allowing us to wrap the form, task list, or any other UI elements inside the same layout.
#### The App
Finally, we bring everything together in our main `App` component. This serves as the "Parent" that manages the data for the entire application.
```jsx
function App() {
  const [tasks,setTasks] = useReducer(reducer,[]);
  return (
      <Todo >
      <Form tasks={tasks} setTasks={setTasks} />
      <Tasks tasks={tasks} setTasks={setTasks}/>
      </Todo>
  );
}
```
In the App component, we use ``useReducer`` with the previously defined reducer to manage the task list state. The tasks state holds the current tasks, and ``setTasks`` is used to dispatch actions like adding or deleting tasks. We wrap the Form and Tasks components inside the Todo container. By passing them as children to Todo, the container can render them within its layout while keeping the structure separate from the content. Additionally, we pass tasks and setTasks as props to the child components so they can access and modify the task list for example, using the add and delete functionality.
#### Adding Styles
To make the list look clean and modern, replace the content of `App.css` with the following:
```css
.Todo {
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.1);
}

h1 {
  text-align: center;
  color: #333;

}

form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

input, textarea {
  display:block;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  width:80%;

}

button {
  cursor: pointer;
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  transition: background 0.2s;
  background-color: #dc3545; 
  width: 100%;
}

button.green {
  background-color: #28a745;
}

button.green:hover {
  background-color: #218838;
}

div  div {
  background: white;
  border: 1px solid #ddd;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  position: relative; 
}
  
div h3 {
  margin: 0 0 5px 0;
  color: #444;
}

div p {
  margin: 0 0 15px 0;
  color: #666;
}
 
button:hover {
  background-color: #c82333;

}
```
