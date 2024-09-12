import { Component } from '@angular/core';

interface Subtask {
  title: string;
  completed: boolean;
}

interface Task {
  title: string;
  subtasks: Subtask[];
  completed: boolean;
  isEditing: boolean;
  newSubtaskTitle: string;
}

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css'],
})
export class TaskManagerComponent {
  newTaskTitle: string = '';  // Input value for new task
  tasks: Task[] = [];

  completedTasks: Task[] = [];

  // Add a new task
  addTask() {
    if (this.newTaskTitle.trim()) {
      this.tasks.push({
        title: this.newTaskTitle,
        subtasks: [],
        completed: false,
        isEditing: false,
        newSubtaskTitle: '',
      });
      this.newTaskTitle = '';  // Clear the input after adding the task
    }
  }

  // Add a new subtask to a specific task
  addSubtaskToTask(taskIndex: number) {
    const task = this.tasks[taskIndex];
    if (task.newSubtaskTitle.trim()) {
      task.subtasks.push({ title: task.newSubtaskTitle, completed: false });
      task.newSubtaskTitle = ''; // Reset the subtask input for this task
    }
  }

  // Remove a specific subtask from a task
  removeSubtask(taskIndex: number, subtaskIndex: number) {
    this.tasks[taskIndex].subtasks.splice(subtaskIndex, 1);
  }

  // Edit a task (show the input field)
  editTask(index: number) {
    this.tasks[index].isEditing = true;
  }

  // Save the edited task title
  saveTask(index: number) {
    this.tasks[index].isEditing = false;
  }

  // Delete a task
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  // Mark a task as completed/uncompleted
  completeTask(index: number) {
    const task = this.tasks[index];
    task.completed = !task.completed;
    if (task.completed) {
      this.completedTasks.push(task);
      this.tasks.splice(index, 1);
    } else {
      this.tasks.push(task);
      this.completedTasks.splice(this.completedTasks.indexOf(task), 1);
    }
  }
}
