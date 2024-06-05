import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Task } from '../../models/task.model';
import { HomeService } from '../../services/home.service';
import { Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-task-modal',
  templateUrl: './delete-task-modal.component.html',
  styleUrls: ['./delete-task-modal.component.scss']
})
export class DeleteTaskModalComponent implements OnDestroy {

  constructor(
              @Inject(MAT_DIALOG_DATA) public data: { task: Task },
              public dialogRef: MatDialogRef<DeleteTaskModalComponent>,
              private homeService: HomeService,
              private toastrService: ToastrService
            ) {}
            
  public unsub$: Subject<boolean> = new Subject<boolean>();
  public deleteTaskLoading = false;

  public deleteTask(id: string) {
      this.deleteTaskLoading = true;
      this.homeService.deleteTask(id).pipe(
        takeUntil(this.unsub$)
      ).subscribe((data) => {
        this.deleteTaskLoading = false;
        this.toastrService.success('Success', 'Task deleted!');
        this.dialogRef.close(true);
      })
  }

  ngOnDestroy(): void {
    this.unsub$.next(true);
    this.unsub$.complete();
  }
}
