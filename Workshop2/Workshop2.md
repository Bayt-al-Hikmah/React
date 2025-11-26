## Objectives
- Working with `useReducer`
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
Here we start by creating a reducer function called `counterReducer`. This function receives two parameters: the current state and an action object. Based on the action’s `type`, the reducer returns a new state. In our case, it handles three possible actions: increasing the count, decreasing it, or resetting it back to zero. The reducer’s job is to decide how the state should change in response to each action.

After defining the reducer, we build the `Counter` component, which uses the `useReducer` hook to manage its internal state. Inside the component, we call `useReducer(counterReducer, { count: 0 })`. The first argument is the reducer function we created, and the second argument is the initial state here, an object with `count: 0`.

React returns an array containing two items: the current `state` and the `dispatch` function. The `state` represents the latest value managed by the reducer, and `dispatch` is what we use to send actions to that reducer. For example, when we call `dispatch({ type: 'increment' })`, React passes both the current state and that action to `counterReducer`. The reducer computes the new state and React updates the component accordingly.

Finally, inside the component’s JSX, we display the current count and add three buttons. Each button dispatches a different action decrement, reset, or increment. This structure keeps our state updates predictable, organized, and easy to maintain as the component grows more complex.

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
## Building To-Do List App
### Introduction
Let's put what we have learned into practice and build a To-Do List App. Users will have the ability to add, edit, and remove tasks, and React will render these as a dynamic list of elements.
### App Logic
So, what do we need to build? First, we need an input area with fields for the Task Name and Description, plus a button to submit the data.     

Second, inside the list itself, every task needs controls. We will add a Delete button to remove tasks from the application.
### Creating the Components
Now lets create the components that we need, 
#### Input
First, we need a component to capture the task data. This component renders a form containing an `<input>` for the task title and a `<textarea>` for the description. 
```jsx
function Input(props){
    const [title,setTitle] = useState("");
    const [description,setDescription] = useState("");
    return(
    <form onSubmit={
    (e)=>{
        e.preventDefault()
        const newTask = {"title":title,"description":description}
        props.setTasks([...props.tasks,newTask])
        setTitle("")
        setDescription("")
        }
    }>
    <label> Title:
    <input value={title} onChange={(e)=>{setTitle(e.target.value)}} />
    </label>
    
    <label>Description:
    <textarea value={description} onChange={(e)=>{setDescription(e.target.value)}}>
    </textarea>
    </label>
    
	<button type="submit">Add Task</button>
    </form>
    )
}
```
Just as we did before, we create local state variables to handle the values of the input and text area element. 

The most critical part of this component is handling the form submission via the `onSubmit` event handler. When the form is submitted, our function runs immediately. The first thing we must do is call `e.preventDefault()`. This is essential because standard HTML forms automatically refresh the page upon submission. In a React application, a refresh would wipe out all our current variables and state, so we must prevent this to keep the app running smoothly.

Once the default behavior is blocked, we create a new task object using the current `title` and `description` from our state. We then use the `setTasks` function which we received via props to update the main list. We do this by creating a new array that contains all the old tasks plus the new one we just created. 

Finally, we call our state setters again to reset the input fields to empty strings, clearing the form for the next entry.
#### Tasks
Now, let's create the component responsible for displaying our tasks.
```jsx
function Tasks(props){
    return (
    <div>
    {  
    props.tasks.map((task)=>{
     return (<div key="">
        <h3> {task.title}</h3>
        <p>{task.description}</p>
        <button onClick={()=>{
            const filteredTasks = props.tasks.filter(t=>t!==task)
            props.setTasks(filteredTasks)
        }}>Delete Task</button>
    </div>)
    })
}
    </div>
    )  
}
```
This component receives the list of tasks through `props`. To render them, we use the JavaScript `.map()` method to iterate over the array. For every task in the data, we return a `<div>` containing the task's title, description, and a button to remove it.

The logic for removing a task happens inside the button's `onClick` handler. We use the `.filter()` method to create a new version of our list. This function looks at every task in the array and keeps it **only if** it is not the task we just clicked. Effectively, this copies everything except the item we want to remove.   

Finally, we pass this new, filtered array to `props.setTasks`, which updates the state and removes the item from the screen.
#### The App
Finally, we bring everything together in our main `App` component. This serves as the "Parent" that manages the data for the entire application.
```jsx
function App() {
  const [tasks,setTasks] = useState([]);
  return (
    <div className="App">
      <h1>Todo List</h1>
      <Input tasks={tasks} setTasks={setTasks}/>
      <Tasks tasks={tasks} setTasks={setTasks}/>
    </div>
  );

}
```
We started by initializing our `tasks` state as an empty array `[]`. It is crucial that this state lives here, at the top level, rather than inside the individual components. This is a concept called **"Lifting State Up."**

By keeping the state in the `App` component, we can pass the `tasks` list and the `setTasks` function down to both the `<Input />` and `<Tasks />` components via **props**. This allows the Input component to add to the list, and the Tasks component to read and delete from the list, ensuring both components stay perfectly in sync with the same data.
#### Adding Styles
To make the list look clean and modern, replace the content of `App.css` with the following:
```css
.App {
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

button[type="submit"] {
  background-color: #28a745;
}

button[type="submit"]:hover {
  background-color: #218838;
}

div  div {
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
