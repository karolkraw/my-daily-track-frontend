import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task, Subtask } from '../../models/goal.model';


@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {
  private baseUrl = 'http://localhost:8000/goals';

  constructor(private http: HttpClient) {}

  getTasks(sectionName: string): Observable<Task[]> {
    sectionName = "abc"
    console.log("asd")
    return this.http.get<Task[]>(`${this.baseUrl}/${sectionName}/`);
  }

  getHistoryTasks(sectionName: string): Observable<Task[]> {
    sectionName = "abc"
    console.log("yty")
    return this.http.get<Task[]>(`${this.baseUrl}/history/${sectionName}/`);
  }

  createTask(task: Task, sectionName: string): Observable<String> {
    sectionName = "abc"

    const partialTask: Partial<Task> = {
      title: task.title,
      description: task.description,
      deadline: task.deadline
    };

    const url = `${this.baseUrl}/create/${sectionName}/`;
    return this.http.post<String>(url, partialTask);
  }

  completeTask(taskTitle: string, sectionName: string): Observable<string> {
    sectionName = "abc"
    const url = `${this.baseUrl}/complete/${sectionName}/${taskTitle}/`;
    return this.http.patch<string>(url, {isHistory: true});
  }

  addSubtaskToTask(taskTitle: string, subtask: Subtask, sectionName: string): Observable<Subtask> {
    console.log("sdmkdf")
    sectionName = "abc"
    const url = `${this.baseUrl}/subtasks/create/${sectionName}/${taskTitle}/`;
    return this.http.post<Subtask>(url, subtask);
  }

  completeSubtask(completed: boolean, subtaskTitle: string, taskTitle: string, sectionName: string): Observable<Subtask> {
    sectionName = "abc"
    return this.http.patch<Subtask>(`${this.baseUrl}/subtasks/complete/${sectionName}/${taskTitle}/${subtaskTitle}/`, {completed});
  }

  deleteSubtask(subtaskTitle: string, taskTitle: string, sectionName: string): Observable<void> {
    sectionName = "abc"
    return this.http.delete<void>(`${this.baseUrl}/subtasks/delete/${sectionName}/${taskTitle}/${subtaskTitle}/`);
  }

}
