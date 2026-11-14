import type { Task, TaskFilter } from '../features/tasks/taskTypes';

type TaskListProps = {
  tasks: Task[];
  filter: TaskFilter;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function TaskList({ tasks, filter, onToggle, onDelete }: TaskListProps) {
  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  if (visibleTasks.length === 0) {
    return <p className="empty-state">No tasks in this view. Add a task or choose another filter.</p>;
  }

  return (
    <ul className="task-list">
      {visibleTasks.map((task) => (
        <li className={`task-card${task.completed ? ' task-card--completed' : ''}`} key={task.id}>
          <div className="task-card__content">
            <h3>{task.title}</h3>
            {task.description && <p>{task.description}</p>}
            <span className={`priority priority--${task.priority}`}>{task.priority} priority</span>
          </div>
          <div className="task-card__actions">
            <button type="button" onClick={() => onToggle(task.id)}>
              {task.completed ? 'Mark active' : 'Complete'}
            </button>
            <button className="button--danger" type="button" onClick={() => onDelete(task.id)}>
              Delete
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
