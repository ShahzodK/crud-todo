import { Task } from "./task.model";

export interface TaskRes {
    count: number,
    previous: string,
    next: string,
    results: Task[]
}