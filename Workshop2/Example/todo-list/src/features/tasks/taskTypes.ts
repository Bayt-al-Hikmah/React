export type Priority = 'low' | 'medium' | 'high';

export type Task = {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
};

export type TaskAction =
  | { type: 'task/added'; payload: Task }
  | { type: 'task/toggled'; payload: string }
  | { type: 'task/deleted'; payload: string };

export type TaskFilter = 'all' | 'active' | 'completed';
