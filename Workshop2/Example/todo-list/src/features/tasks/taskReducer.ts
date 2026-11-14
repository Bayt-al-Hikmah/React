import type { Task, TaskAction } from './taskTypes';

export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'task/added':
      return [...state, action.payload];
    case 'task/toggled':
      return state.map((task) =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task,
      );
    case 'task/deleted':
      return state.filter((task) => task.id !== action.payload);
  }
}
