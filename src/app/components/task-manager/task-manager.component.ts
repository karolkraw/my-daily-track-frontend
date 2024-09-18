import { Component, OnInit } from '@angular/core';
import { TaskManagerService } from '../../services/task-manager/task-manager.service';
import { ActivatedRoute } from '@angular/router';
import { Task, Subtask } from '../../models/goal.model';
import { format } from 'date-fns';



@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css'],
})
export class TaskManagerComponent implements OnInit {
  sectionName!: string;
  newTaskTitle: string = '';
  isEditing: boolean = false;
  newSubtaskTitle: string = '';
  tasks: Task[] = [];
  history: Task[] = [];

  completedTasks: Task[] = [];

  constructor(private taskManagerService: TaskManagerService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.sectionName = this.route.snapshot.paramMap.get('name') || '';
    this.loadActiveTasks();
    this.loadHistoryTasks(); 
  }

  loadActiveTasks(): void {
    this.taskManagerService.getTasks(this.sectionName).subscribe(data => {
      this.tasks = data;
      console.log(data)
    });
  }

  loadHistoryTasks(): void {
    this.taskManagerService.getHistoryTasks(this.sectionName).subscribe(data => {
      this.history = data;
      console.log("werjier")
      console.log("werjier" + data)
    });
  }

  addTask() {
    
    if (this.newTaskTitle.trim()) {
  
      const task: Task = {
        title: this.newTaskTitle,
        description: 'desc',
        deadline: this.formatDate(new Date()),
        createdDate: this.formatDate(new Date()),
        subtasks: [],
        isHistory: false,
      }
    
      
      this.taskManagerService.createTask(task, this.sectionName).subscribe(
        (data: any) => {
          this.tasks.push(task)
         
        },
        error => {
          console.error('Error fetching tasks data', error);
        }
      );
     /*  this.tasks.push({
        title: this.newTaskTitle,
        subtasks: [],
        completed: false,
        isEditing: false,
        newSubtaskTitle: '',
      }); */
      this.newTaskTitle = '';  // Clear the input after adding the task
    }
  }

  // Add a new subtask to a specific task
  addSubtaskToTask(taskIndex: number) {
     const task = this.tasks[taskIndex];
    if (this.newSubtaskTitle.trim()) {
      const subtask: Subtask =  { title: this.newSubtaskTitle, description: "asdmksd", createdDate: this.formatDate(new Date()),
         deadline: this.formatDate(new Date()), completed: false }
      this.taskManagerService.addSubtaskToTask(task.title, subtask, this.sectionName).subscribe(data => {
          task.subtasks.push(data);

          console.log(data)
      },

      )
      this.newSubtaskTitle = ''; // Reset the subtask input for this task
    } 
  }

  completeSubtask(taskIndex: number, subtaskIndex: number) {
    const task = this.tasks[taskIndex]
    const subtask = task.subtasks[subtaskIndex]
    const newCompletedState = !subtask.completed;
    this.taskManagerService.completeSubtask(newCompletedState, subtask.title, task.title, this.sectionName).subscribe(
      (data: Subtask) => {
        this.tasks[taskIndex].subtasks[subtaskIndex].completed = data.completed
      },
    )
  }


  removeSubtask(taskIndex: number, subtaskIndex: number) {
    const task = this.tasks[taskIndex]
    const subtask = task.subtasks[subtaskIndex]
    this.taskManagerService.deleteSubtask(subtask.title, task.title, this.sectionName).subscribe(
      (data: any) => {
        this.tasks[taskIndex].subtasks.splice(subtaskIndex, 1);
      },
    )
  }

  // Edit a task (show the input field)
  editTask(index: number) {
    //this.tasks[index].isEditing = true;
    this.isEditing = true;
  }

  // Save the edited task title
  updateTask(index: number) {
    // this.tasks[index].isEditing = false;
    this.isEditing = false;
  }

  // Delete a task
  deleteTask(index: number) {
    this.tasks.splice(index, 1);
  }

  completeTask(index: number) {
    this.taskManagerService.completeTask(this.tasks[index].title, this.sectionName).subscribe(
      (data: any) => {
        const completedTask = this.tasks[index]
        completedTask.isHistory = true;
        this.history.push(completedTask);
        this.tasks.splice(index, 1);
      }
    )
  }


  formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }
}
