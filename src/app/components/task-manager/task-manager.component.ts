import { Component, OnInit } from '@angular/core';
import { TaskManagerService } from '../../services/task-manager/task-manager.service';
import { ActivatedRoute } from '@angular/router';
import { Task, Subtask } from '../../models/goal.model';
import { format } from 'date-fns';
import { DatePipe } from '@angular/common';
import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';



export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY', // Input format when parsing
  },
  display: {
    dateInput: 'DD/MM/YYYY',  // How it shows in the input field
    monthYearLabel: 'MMM YYYY', // Month and year at the top of the picker
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-task-manager',
  templateUrl: './task-manager.component.html',
  styleUrls: ['./task-manager.component.css'],
  providers: [DatePipe,
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS } // Provide custom date formats
  ]
})
export class TaskManagerComponent implements OnInit {
  sectionName!: string;
  isEditing: boolean = false;
  newSubtaskTitle: string = '';
  currentTasks: Task[] = [];
  history: Task[] = [];
  newTaskTitle: string = '';
  newDescription: string = '';
  newDeadline: Date | null = null;
  tomorrow: Date = new Date(new Date().setDate(new Date().getDate() + 1));

  activePanel: string = 'current';

  newSubtask: any = { title: '', description: '', deadline: '', completed: false };

  completedTasks: Task[] = [];

  constructor(private taskManagerService: TaskManagerService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.sectionName = this.route.snapshot.paramMap.get('name') || '';
    this.loadActiveTasks();
    this.loadHistoryTasks();
  }

  loadActiveTasks(): void {
    this.taskManagerService.getTasks(this.sectionName).subscribe(data => {
      this.currentTasks = data;
    });
  }

  loadHistoryTasks(): void {
    this.taskManagerService.getHistoryTasks(this.sectionName).subscribe(
      (response) => {
        if (response.status === 'processing') {
          this.pollForHistoryTasks();
        } else {
          this.history = response.data;
        }
      },
      (error) => {
        console.error('Error fetching history tasks:', error);
      }
    );
  }

  pollForHistoryTasks(): void {
    const pollInterval = 300;
    const pollSubscription = interval(pollInterval).pipe(
      switchMap(() => this.taskManagerService.pollHistoryTasks(this.sectionName)))
      .subscribe(
        (response) => {
          if (response.status === 'processing') {
            console.log('History task is still processing...');
          } else {
            this.history = response.data;
            pollSubscription.unsubscribe();
          }
        },
        (error) => {
          console.error('Error polling history tasks:', error);
          pollSubscription.unsubscribe();
        }
      );
  }

  switchPanel(panel: string) {
    this.activePanel = panel;
  }

  toggleSubtasks(task: any) {
    task.showSubtasks = !task.showSubtasks;
  }

  showAddSubtaskForm(task: any) {
    task.showAddSubtaskForm = true;
  }

  cancelAddSubtask(task: any) {
    task.showAddSubtaskForm = false;
  }

  markTaskComplete(task: Task) {
    const allCompleted = this.checkIfAllSubtasksCompleted(task)
    if (!allCompleted) {
      alert('All subtasks must be completed');
      return;
    }
    this.taskManagerService.completeTask(task.title, this.sectionName).subscribe()
    this.currentTasks = this.currentTasks.filter(t => t !== task)
    task.completedDate = this.formatDateStartDay(new Date())
    this.history.push(task)
  }

  deleteTask(task: Task) {
    const isConfirmed = window.confirm(`Are you sure you want to delete the task: "${task.title}"?`);
    if (isConfirmed) {
      const taskIndex = this.currentTasks.findIndex(t => t.title === task.title);
      this.taskManagerService.deleteTask(task.title, this.sectionName).subscribe(
        (data: any) => {
          this.currentTasks.splice(taskIndex, 1);
        },
      )
    }
  }

  /*deleteSubtask(taskIndex: number, subtaskIndex: number) {
    const task = this.currentTasks[taskIndex]
    const subtask = task.subtasks[subtaskIndex]
    this.taskManagerService.deleteSubtask(subtask.title, task.title, this.sectionName).subscribe(
      (data: any) => {
        this.currentTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
      },
    )
  }
    */

  checkIfAllSubtasksCompleted(task: Task): Boolean {
    return !task.subtasks.find(subtask => !subtask.completed);
  }

  markSubtaskComplete(task: Task, subtask: Subtask) {
    subtask.completed = true;
    this.taskManagerService.completeSubtask(true, subtask.title, task.title, this.sectionName)
      .subscribe(data => {
        const currentSubtask = task.subtasks.find(st => st.title === subtask.title);
        if (currentSubtask) {
          currentSubtask.completed = true;
          currentSubtask.completedDate = data.completedDate
        } else {
          console.error('Subtask not found in the task');
        }
      }
      );
  }

  createTask() {
    if (this.newTaskTitle.trim()) {
      const task: Task = {
        title: this.newTaskTitle,
        description: this.newDescription,
        deadline: this.formatDate(new Date(this.newDeadline!)),
        createdDate: this.formatDate(new Date()),
        completedDate: null,
        subtasks: [],
        showSubtasks: false,
        showAddSubtaskForm: false,
      }

      this.taskManagerService.createTask(task, this.sectionName).subscribe(
        (data: any) => {
          this.currentTasks.push(task)
        },
        error => {
          console.error('Error fetching tasks data', error);
        }
      );
      this.newTaskTitle = '';
    }
  }

  addSubtask(task: any) {
    if (this.newSubtask.title && this.newSubtask.description && this.newSubtask.deadline) {
      const createdDate = this.formatDate(new Date());
      const subtask = { ...this.newSubtask, createdDate: createdDate, deadline: this.newSubtask.deadline };
      this.newSubtask = { title: '', description: '', deadline: '', completed: false };
      task.showAddSubtaskForm = false;
      this.taskManagerService.addSubtaskToTask(task.title, subtask, this.sectionName).subscribe(data => {
        task.subtasks.push(data);
      })
    } else {
      alert('Please fill in all fields.');
    }
  }

  completeSubtask(taskIndex: number, subtaskIndex: number) {
    const task = this.currentTasks[taskIndex]
    const subtask = task.subtasks[subtaskIndex]
    const newCompletedState = !subtask.completed;
    this.taskManagerService.completeSubtask(newCompletedState, subtask.title, task.title, this.sectionName).subscribe(
      (data: Subtask) => {
        this.currentTasks[taskIndex].subtasks[subtaskIndex].completed = data.completed
      },
    )
  }

  deleteSubtask(taskIndex: number, subtaskIndex: number) {
    const task = this.currentTasks[taskIndex]
    const subtask = task.subtasks[subtaskIndex]
    this.taskManagerService.deleteSubtask(subtask.title, task.title, this.sectionName).subscribe(
      (data: any) => {
        this.currentTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
      },
    )
  }

  editTask(index: number) {
    this.isEditing = true;
  }

  updateTask(index: number) {
    this.isEditing = false;
  }

  formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }

  formatDateStartDay(date: Date): string {
    return format(date, 'dd-MM-yyyy');
  }
}

