export interface Task {
  title: string;
  description: string;
  createdDate: string;
  deadline: string;
  completedDate: string | null;
  subtasks: Subtask[];
  showSubtasks: false;
  showAddSubtaskForm: false,
  editingField: 'title' | 'description' | 'deadline' | null;
  updatedTitle: string,
  updatedDescription: string,
  updatedDeadline: string,
}

export interface Subtask {
  title: string;
  description: string;
  createdDate: string;
  deadline: string;
  completed: boolean;
  completedDate: string;
}