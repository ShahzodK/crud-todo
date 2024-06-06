import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CommonUrl } from 'src/app/shared/consts/commonUrl';
import { Task } from '../models/task.model';
import { TaskRes } from '../models/tasksRes.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(private http: HttpClient) { }

  public getTasks(): Observable<TaskRes> {
    return this.http.get<TaskRes>(CommonUrl.MAIN_URL + CommonUrl.TODO_URL)
  }

  public getTask(id: string): Observable<Task> {
    return this.http.get<Task>(CommonUrl.MAIN_URL + CommonUrl.TODO_URL + `${id}`)
  }

  public createTask(data: Omit<Task, 'id' | 'created_at' | 'updated_at'>): Observable<Task> {
    return this.http.post<Task>(CommonUrl.MAIN_URL + CommonUrl.TODO_URL, data)
  }

  public deleteTask(id: string): Observable<null> {
    return this.http.delete<null>(CommonUrl.MAIN_URL + CommonUrl.TODO_URL + `${id}`)
  }

  public updateTask(data: Omit<Task, 'created_at' | 'updated_at'>): Observable<Task> {
    return this.http.put<Task>(CommonUrl.MAIN_URL + CommonUrl.TODO_URL + `${data.id}/`, data);
  }
}
