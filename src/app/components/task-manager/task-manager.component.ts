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

  constructor(private taskManagerService: TaskManagerService, private route: ActivatedRoute) {}

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
          console.log('History data:', response.data);
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
            console.log("History data...")
            console.log('History data:', response.data);
            pollSubscription.unsubscribe();
          }
        },
        (error) => {
          console.error('Error polling history tasks:', error);
          pollSubscription.unsubscribe();
        }
      );
  }

  /* onDateChange(event: any): void {
    this.newDeadline = event.value ? event.value : null;
    console.log("onDateChange " + this.newDeadline)
    //this.searchReflection();
  } */

  switchPanel(panel: string) {
    this.activePanel = panel;
  }

  toggleSubtasks(task: any) {
    task.showSubtasks = !task.showSubtasks;
  }

  showAddSubtaskForm(task: any) {
    task.showAddSubtaskForm = true;
  }

  // Hide form for adding a subtask
  cancelAddSubtask(task: any) {
    task.showAddSubtaskForm = false;
  }

  markTaskComplete(task: Task) {
    this.taskManagerService.completeTask(task.title, this.sectionName).subscribe(
        data => {
          this.currentTasks = this.currentTasks.filter(t => t !== task)
          this.history.push(task)
        }     
    ); 
  }

  markSubtaskComplete(task: Task, subtask: Subtask) {
    subtask.completed = true;
    this.taskManagerService.completeSubtask(
      true, subtask.title, task.title, this.sectionName).subscribe(
        data => { subtask.completed = true; }
      ); 
  }

  createTask() {
    
    if (this.newTaskTitle.trim()) {
      console.log(this.newDeadline)
      console.log(this.formatDate(new Date()))
  
      const task: Task = {
        title: this.newTaskTitle,
        description: this.newDescription,
        deadline: this.formatDate(new Date(this.newDeadline!)),
        dateCreated: this.formatDate(new Date()),
        dateCompleted: null,
        subtasks: [],
        showSubtasks: false,
        showAddSubtaskForm: false,
      }
    
      
      this.taskManagerService.createTask(task, this.sectionName).subscribe(
        (data: any) => {
          console.log("returned task")
          this.currentTasks.push(task)
         
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

  addSubtask(task: any) {
    if (this.newSubtask.title && this.newSubtask.description && this.newSubtask.deadline) {
      const createdDate = this.formatDate(new Date()); // Set the current date
      const subtask = { ...this.newSubtask, createdDate };
      this.newSubtask = { title: '', description: '', deadline: '', completed: false }; // Reset form
      task.showAddSubtaskForm = false;  // Hide form
      this.taskManagerService.addSubtaskToTask(task.title, subtask, this.sectionName).subscribe(data => {
        task.subtasks.push(data);

        console.log(data)
    },

    )
    } else {
      alert('Please fill in all fields.');
    }
  }

  // Add a new subtask to a specific task
  /* addSubtaskToTask(taskIndex: number) {
     const task = this.currentTasks[taskIndex];
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
  } */

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


  removeSubtask(taskIndex: number, subtaskIndex: number) {
    const task = this.currentTasks[taskIndex]
    const subtask = task.subtasks[subtaskIndex]
    this.taskManagerService.deleteSubtask(subtask.title, task.title, this.sectionName).subscribe(
      (data: any) => {
        this.currentTasks[taskIndex].subtasks.splice(subtaskIndex, 1);
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
    this.currentTasks.splice(index, 1);
  }

  formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
  }
}
