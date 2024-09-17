export interface Task {
  title: string;
  description: string;
  createdDate: string;
  deadline: string;
  subtasks: Subtask[];
  isHistory: boolean;
}

export interface Subtask {
  title: string;
  description: string;
  createdDate: string;
  deadline: string;
  completed: boolean;
}