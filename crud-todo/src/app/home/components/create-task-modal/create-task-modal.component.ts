import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeService } from '../../services/home.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-task-modal',
  templateUrl: './create-task-modal.component.html',
  styleUrls: ['./create-task-modal.component.scss']
})
export class CreateTaskModalComponent implements OnDestroy {

  constructor(
              private homeService: HomeService,
              private toastrService: ToastrService,
              private dialogRef: MatDialogRef<CreateTaskModalComponent>,
            ) {}
  
  public unsub$: Subject<boolean> = new Subject<boolean>();
  public createTaskLoading = false;

  public taskForm = new FormGroup({
    title: new FormControl<string>('', [ Validators.required ]),
    completed: new FormControl<boolean>(false, [ Validators.required ]),
    user: new FormControl<number>(1, [ Validators.required ]),
  });

  public createTask(): void {
    if(this.taskForm.valid){
      const formValues = {
        title: this.taskForm.get('title')?.value!,
        completed: this.taskForm.get('completed')?.value!,
        user: this.taskForm.get('user')?.value!,
      };
      this.createTaskLoading = true;
      this.homeService.createTask(formValues).pipe(
        takeUntil(this.unsub$)
      ).subscribe({
        next: () => {
          this.toastrService.success('Success', 'Task Created!');
          this.dialogRef.close(true);
          this.createTaskLoading = false;
        },
        error: () => {
          this.createTaskLoading = false
        }
      })
    }
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }
}
