import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  function decrement() {
    setCount((current) => Math.max(0, current - 1));
  }

  return (
    <section className="counter" aria-labelledby="counter-title">
      <h2 id="counter-title">Counter</h2>
      <p className="counter__value" aria-live="polite">Current count: {count}</p>
      <div className="counter__actions">
        <button type="button" onClick={decrement} disabled={count === 0}>
          Decrement
        </button>
        <button type="button" onClick={() => setCount((current) => current + 1)}>
          Increment
        </button>
        <button type="button" className="button--secondary" onClick={() => setCount(0)}>
          Reset
        </button>
      </div>
    </section>
  );
}
