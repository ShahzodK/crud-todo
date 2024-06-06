import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { HomeService } from '../../services/home.service';
import { Task } from '../../models/task.model';

@Component({
  selector: 'app-edit-task-modal',
  templateUrl: './edit-task-modal.component.html',
  styleUrls: ['./edit-task-modal.component.scss']
})
export class EditTaskModalComponent implements OnInit, OnDestroy {

  constructor(
              @Inject(MAT_DIALOG_DATA) public data: { task: Task },
              private homeService: HomeService,
              private toastrService: ToastrService,
              private dialogRef: MatDialogRef<EditTaskModalComponent>,
            ) {}
  
  public unsub$: Subject<boolean> = new Subject<boolean>();
  public fetchTaskLoading = true;
  public editTaskLoading = false;

  public taskForm = new FormGroup({
    title: new FormControl<string>('', [ Validators.required ]),
    completed: new FormControl<boolean>(false, [ Validators.required ]),
    user: new FormControl<number>(1, [ Validators.required ]),
  });

  ngOnInit(): void {
      this.homeService.getTask(this.data.task.id).pipe(
        takeUntil(this.unsub$)
      ).subscribe( {
        next: (data) => {
          this.fetchTaskLoading = false
          this.taskForm.patchValue({
            title: data.title,
            completed: data.completed,
            user: data.user
          })
        },
        error: () => {
          this.fetchTaskLoading = false;
          this.dialogRef.close();
        }
      });
  }

  public editTask(): void {
    if(this.taskForm.valid){
      const formValues: Omit<Task, 'created_at' | 'updated_at'> = {
        id: this.data.task.id,
        title: this.taskForm.get('title')?.value!,
        completed: this.taskForm.get('completed')?.value!,
        user: this.taskForm.get('user')?.value!,
      };
      this.editTaskLoading = true;
      this.homeService.updateTask(formValues).pipe(
        takeUntil(this.unsub$)
      ).subscribe({
        next: () => {
          this.toastrService.success('Success', 'Task Edited!');
          this.dialogRef.close(true);
          this.editTaskLoading = false;
        },
        error: () => {
          this.editTaskLoading = false
        }
      })
    };
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }
}
