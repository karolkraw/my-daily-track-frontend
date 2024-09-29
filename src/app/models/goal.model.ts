export interface Task {
  title: string;
  description: string;
  createdDate: string;
  deadline: string;
  completedDate: string | null;
  subtasks: Subtask[];
  showSubtasks: false;
  showAddSubtaskForm: false,
}

export interface Subtask {
  title: string;
  description: string;
  createdDate: string;
  deadline: string;
  completed: boolean;
  completedDate: string;
}