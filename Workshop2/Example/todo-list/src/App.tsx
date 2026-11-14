import { useReducer, useState } from 'react';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { taskReducer } from './features/tasks/taskReducer';
import type { Task, TaskFilter } from './features/tasks/taskTypes';

const initialTasks: Task[] = [
  {
    id: 'task-1',
    title: 'Plan the next release',
    description: 'Review the open issues and agree on priorities.',
    priority: 'high',
    completed: false,
  },
  {
    id: 'task-2',
    title: 'Review the component styles',
    description: 'Check the interface on a narrow screen.',
    priority: 'medium',
    completed: true,
  },
];

const filters: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export default function App() {
  const [tasks, dispatch] = useReducer(taskReducer, initialTasks);
  const [filter, setFilter] = useState<TaskFilter>('all');
  const remainingCount = tasks.filter((task) => !task.completed).length;

  return (
    <main className="page">
      <header className="page-header">
        <p className="eyebrow">Workshop 2</p>
        <h1>Task Manager</h1>
        <p>Practice components, typed props, forms, lists, and reducer-based state.</p>
      </header>

      <section className="panel" aria-labelledby="new-task-title">
        <h2 id="new-task-title">Create a task</h2>
        <TaskForm onAdd={(task) => dispatch({ type: 'task/added', payload: task })} />
      </section>

      <section className="tasks-section" aria-labelledby="task-list-title">
        <div className="section-heading">
          <div>
            <h2 id="task-list-title">Your tasks</h2>
            <p className="muted">{remainingCount} remaining</p>
          </div>
          <div className="filters" aria-label="Filter tasks">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                className={filter === item.value ? 'filter filter--active' : 'filter'}
                aria-pressed={filter === item.value}
                onClick={() => setFilter(item.value)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <TaskList
          tasks={tasks}
          filter={filter}
          onToggle={(id) => dispatch({ type: 'task/toggled', payload: id })}
          onDelete={(id) => dispatch({ type: 'task/deleted', payload: id })}
        />
      </section>
    </main>
  );
}
