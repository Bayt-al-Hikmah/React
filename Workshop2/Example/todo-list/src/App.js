import './App.css';
import { useState, useReducer} from 'react';


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

function Todo({children}){
  return (
    <div className="Todo">
      <h1>Todo List</h1>
      {children}
     </div>

    )
}
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

function App() {
  const [tasks,setTasks] = useReducer(reducer,[]);
  return (
      <Todo >
      <Form tasks={tasks} setTasks={setTasks} />
      <Tasks tasks={tasks} setTasks={setTasks}/>
      </Todo>

  );

}

export default App;
