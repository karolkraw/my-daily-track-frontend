export interface Task {
  title: string;
  description: string;
  dateCreated: string;
  deadline: string;
  dateCompleted: string | null;
  subtasks: Subtask[];
  showSubtasks: false;
  showAddSubtaskForm: false,
}

export interface Subtask {
  title: string;
  description: string;
  dateCreated: string;
  deadline: string;
  completed: boolean;
  dateCompleted: string;
}