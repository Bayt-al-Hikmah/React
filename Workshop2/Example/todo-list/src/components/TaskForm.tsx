import { useState, type FormEvent } from 'react';
import type { Priority, Task } from '../features/tasks/taskTypes';

type TaskFormProps = {
  onAdd: (task: Task) => void;
};

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedTitle = title.trim();
    if (!normalizedTitle) return;

    onAdd({
      id: crypto.randomUUID(),
      title: normalizedTitle,
      description: description.trim(),
      priority,
      completed: false,
    });

    setTitle('');
    setDescription('');
    setPriority('medium');
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="task-title">Title</label>
        <input
          id="task-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={80}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="task-description">Description</label>
        <textarea
          id="task-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={3}
        />
      </div>

      <div className="field">
        <label htmlFor="task-priority">Priority</label>
        <select
          id="task-priority"
          value={priority}
          onChange={(event) => setPriority(event.target.value as Priority)}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <button className="button button--primary" type="submit">Add task</button>
    </form>
  );
}
