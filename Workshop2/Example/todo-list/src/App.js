import {useState} from 'react';
import './App.css';



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

export default App;
