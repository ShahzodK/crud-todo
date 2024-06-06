import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { TaskRes } from '../../models/tasksRes.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CreateTaskModalComponent } from '../../components/create-task-modal/create-task-modal.component';
import { BehaviorSubject, Subject, debounceTime, filter, switchMap, takeUntil } from 'rxjs';
import { DeleteTaskModalComponent } from '../../components/delete-task-modal/delete-task-modal.component';
import { Task } from '../../models/task.model';
import { EditTaskModalComponent } from '../../components/edit-task-modal/edit-task-modal.component';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePageComponent implements OnInit, OnDestroy {

  constructor(
              public homeService: HomeService,
              public dialog: MatDialog,
              private cd: ChangeDetectorRef,
            ) {}

  public tasksLoading = false;
  public unsub$: Subject<boolean> = new Subject<boolean>();
  public updateCompleteness$ = new Subject<Task>();
  public tasks$ = new BehaviorSubject<TaskRes | null>(null);

  ngOnInit(): void {
    this.homeService.getTasks().subscribe({
      next: (data) => {
        this.tasksLoading = true;
        this.tasks$.next(data);
      },
      error: () => {
        this.tasksLoading = true;
      }
    });

      this.updateCompleteness$.pipe(
        debounceTime(300),
        switchMap((task: Task) => {
          task.completed = !task.completed;
          return this.homeService.updateTask(task)
        }),
        takeUntil(this.unsub$)
      ).subscribe(() => {
          this.cd.markForCheck();
      })
  }

  public updateTasks<T>(dialog: MatDialogRef<T>): void {
    dialog.afterClosed().pipe(
      takeUntil(this.unsub$),
      filter(result => result === true),
      switchMap(() => {
        this.tasksLoading = false;
        this.cd.markForCheck();
        return this.homeService.getTasks();
      })
    ).subscribe({
      next: (data) => {
        this.tasks$.next(data);
        this.tasksLoading = true;
        this.cd.markForCheck();
      },
      error: () => {
        this.tasksLoading = true;
        this.cd.markForCheck();
      }
    });
  }

  public openCreateTaskDialog(): void {
    const dialog: MatDialogRef<CreateTaskModalComponent> = this.dialog.open(CreateTaskModalComponent, {
      width: '350px',
    });
    this.updateTasks(dialog);
  }

  public openDeleteTaskDialog(task: Task): void {
    const dialog: MatDialogRef<DeleteTaskModalComponent> = this.dialog.open(DeleteTaskModalComponent, {
      width: '350px',
      data: {
        task 
      }
    });
    this.updateTasks(dialog);
  }

  public openEditTaskDialog(task: Task): void {
    const dialog: MatDialogRef<EditTaskModalComponent> = this.dialog.open(EditTaskModalComponent, {
      width: '350px',
      data: {
        task 
      }
    });
    this.updateTasks(dialog);
  }

  public updateTaskCompleteness(task: Task): void {
    this.updateCompleteness$.next(task);
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }
}
