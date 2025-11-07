import { Injectable } from '@angular/core';
import { Task } from '../models/task';
import { Observable, of } from 'rxjs';
import { Criteria } from '../models/criteria';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  tasks: Task[] = [];

  constructor() { 
     const savedTasks = localStorage.getItem('tasks');
     this.tasks = savedTasks ? JSON.parse(savedTasks) : [
      { name: 'Zrobić zakupy spożywcze', status: 'Completed', date: '2025-05-01', description: 'Muszę kupić mleko, mąkę i jajka.' },
      { name: 'Opłacić rachunki', status: 'Pending', date: '2025-05-10', description: 'Tylko nie odkładaj tego na inny dzień!' },
      { name: 'Urodziny mamy', status: 'Planned', date: '2025-05-15', description: 'Kupić kwiaty i tort.' }
    ];
  }

  getTasks(): Observable<Task[]> {
    return of(this.tasks);
  }

  filterTasks(criteria: Criteria): Observable<Task[]> {
    let filteredTasks = this.tasks;

    if (criteria.name) {
      filteredTasks = filteredTasks.filter(task =>
        task.name.toLowerCase().includes(criteria.name!.toLowerCase())
      );
    }

    if (criteria.date) {
      filteredTasks = filteredTasks.filter(task =>
        task.date === criteria.date
      );
    }

    if (criteria.status) {
      filteredTasks = filteredTasks.filter(task =>
        task.status.toLowerCase() === criteria.status!.toLowerCase()
      );
    }

    return of(filteredTasks);
  }

  createTask(newTask: Task): void {
    this.tasks.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }
}
