import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Task, Subtask } from '../../models/goal.model';


@Injectable({
  providedIn: 'root'
})
export class TaskManagerService {
  private baseUrl = 'http://localhost:8080/goals';

  constructor(private http: HttpClient) {}

  getTasks(sectionName: string): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseUrl}/${sectionName}/`);
  }

  getHistoryTasks(sectionName: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/history/${sectionName}/`);
  }

  createTask(task: Task, sectionName: string): Observable<String> {
    const partialTask: Partial<Task> = {
      title: task.title,
      description: task.description,
      deadline: task.deadline
    };

    const url = `${this.baseUrl}/create/${sectionName}/`;
    return this.http.post<String>(url, partialTask);
  }

  completeTask(taskTitle: string, sectionName: string): Observable<string> {
    const url = `${this.baseUrl}/complete/${sectionName}/${taskTitle}/`;
    return this.http.delete<string>(url, {});
  }

  updateTask(taskTitle: string, partialTask: Partial<Task>, sectionName: string): Observable<String> {
    const url = `${this.baseUrl}/update/${sectionName}/${taskTitle}/`;
    return this.http.put<String>(url, partialTask);
  }

  deleteTask(taskTitle: string, sectionName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/delete/${sectionName}/${taskTitle}/`);
  }

  addSubtaskToTask(taskTitle: string, subtask: Subtask, sectionName: string): Observable<Subtask> {
    const url = `${this.baseUrl}/subtasks/create/${sectionName}/${taskTitle}/`;
    return this.http.post<Subtask>(url, subtask);
  }

  completeSubtask(completed: boolean, subtaskTitle: string, taskTitle: string, sectionName: string): Observable<Subtask> {
    return this.http.patch<Subtask>(`${this.baseUrl}/subtasks/complete/${sectionName}/${taskTitle}/${subtaskTitle}/`, {completed});
  }

  deleteSubtask(subtaskTitle: string, taskTitle: string, sectionName: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/subtasks/delete/${sectionName}/${taskTitle}/${subtaskTitle}/`);
  }
}
