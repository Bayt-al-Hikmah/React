import Counter from './components/Counter';

function Welcome({ name }: { name: string }) {
  return <p className="intro">A small example of React components, props, and state, {name}.</p>;
}

export default function App() {
  return (
    <main className="page">
      <header className="page__header">
        <p className="eyebrow">Workshop 1</p>
        <h1>React Foundations</h1>
        <Welcome name="developer" />
      </header>
      <Counter />
    </main>
  );
}
