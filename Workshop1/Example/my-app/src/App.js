import './App.css';
import { useState } from 'react'; 
function App() {
  const [count, setCount] = useState(0);
  const handleIncrement = () => {
	  setCount(count + 1);
  };

  const handleDecrement = () => {
	  setCount(count - 1);
  };
  return (
	  <>
      <h1>My Click Counter</h1>
      <h2>Current Count: {count}</h2>

      <div className="button-container">
        <button onClick={handleIncrement}>Increment (+)</button>
        <button onClick={handleDecrement}>Decrement (-)</button>
      </div>
	  </>
  );
}

export default App;
